import React, { useState, useEffect } from 'react'
import {
  Crosshair,
  Save,
  Trash2,
  TrendingDown,
  TrendingUp,
  Target,
  Zap,
  Search,
  Plus,
  X,
  Loader,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const WeaponBuilder = () => {
  // State
  const [weapons, setWeapons] = useState([])
  const [mods, setMods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWeapon, setSelectedWeapon] = useState(null)
  const [equippedMods, setEquippedMods] = useState({})
  const [buildName, setBuildName] = useState('')
  const [savedBuilds, setSavedBuilds] = useLocalStorage(
    'tarkov-weapon-builds-v2',
    []
  )
  const [filterCategory, setFilterCategory] = useState('all')
  const [modSelectionSlot, setModSelectionSlot] = useState(null)
  const [modSearchTerm, setModSearchTerm] = useState('')
  const [expandedSlots, setExpandedSlots] = useState({})

  // Fetch weapons AND mods from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `
          query {
            items(types: [gun, mods]) {
              id
              name
              shortName
              description
              iconLink
              image512pxLink
              basePrice
              avg24hPrice
              weight
              types
              properties {
                ... on ItemPropertiesWeapon {
                  caliber
                  defaultAmmo {
                    name
                  }
                  effectiveDistance
                  ergonomics
                  fireModes
                  fireRate
                  recoilVertical
                  recoilHorizontal
                  slots {
                    name
                    nameId
                    required
                    filters {
                      allowedItems {
                        id
                        name
                      }
                      excludedItems {
                        id
                        name
                      }
                    }
                  }
                }
                ... on ItemPropertiesWeaponMod {
                  ergonomics
                  recoilModifier
                  slots {
                    name
                    nameId
                    required
                    filters {
                      allowedItems {
                        id
                        name
                      }
                      excludedItems {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `

        const response = await fetch('https://api.tarkov.dev/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })

        const data = await response.json()

        if (data.errors) {
          throw new Error(data.errors[0].message)
        }

        // Separate weapons and mods
        const weaponList = data.data.items
          .filter(
            (item) =>
              item.types.includes('gun') &&
              item.properties &&
              item.properties.ergonomics
          )
          .sort((a, b) => a.name.localeCompare(b.name))

        const modList = data.data.items
          .filter((item) => item.types.includes('mods'))
          .sort((a, b) => a.name.localeCompare(b.name))

        setWeapons(weaponList)
        setMods(modList)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get caliber for filtering
  const getCaliber = (weapon) => {
    return weapon.properties?.caliber || 'Unknown'
  }

  // Get unique calibers
  const calibers = [...new Set(weapons.map((w) => getCaliber(w)))].sort()

  // Filter weapons
  const filteredWeapons = weapons.filter((weapon) => {
    const matchesSearch =
      weapon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weapon.shortName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || getCaliber(weapon) === filterCategory
    return matchesSearch && matchesCategory
  })

  // Calculate total stats with mods (RECURSIVE)
  const calculateTotalStats = () => {
    if (!selectedWeapon) return null

    const baseProps = selectedWeapon.properties
    let totalErgo = baseProps.ergonomics
    let totalRecoilV = baseProps.recoilVertical
    let totalRecoilH = baseProps.recoilHorizontal

    // Recursively collect all equipped mods (including nested)
    const collectAllMods = (modsObj) => {
      const allMods = []
      Object.entries(modsObj).forEach(([slotName, mod]) => {
        if (mod) {
          allMods.push(mod)
          // Check if this mod has nested mods
          const nestedKey = `${slotName}_nested`
          if (modsObj[nestedKey]) {
            allMods.push(...collectAllMods(modsObj[nestedKey]))
          }
        }
      })
      return allMods
    }

    const allMods = collectAllMods(equippedMods)

    // Add stats from all mods
    allMods.forEach((mod) => {
      if (mod && mod.properties) {
        totalErgo += mod.properties.ergonomics || 0
        if (mod.properties.recoilModifier) {
          totalRecoilV *= mod.properties.recoilModifier
          totalRecoilH *= mod.properties.recoilModifier
        }
      }
    })

    return {
      ergonomics: Math.round(totalErgo),
      recoilVertical: Math.round(totalRecoilV),
      recoilHorizontal: Math.round(totalRecoilH),
      recoilSum: Math.round(totalRecoilV + totalRecoilH),
    }
  }

  // Get compatible mods for a slot
  const getCompatibleMods = (slot) => {
    if (!slot || !slot.filters || !slot.filters.allowedItems) return []

    const allowedIds = slot.filters.allowedItems.map((item) => item.id)
    const excludedIds = slot.filters.excludedItems
      ? slot.filters.excludedItems.map((item) => item.id)
      : []

    return mods.filter(
      (mod) => allowedIds.includes(mod.id) && !excludedIds.includes(mod.id)
    )
  }

  // Filter mods by search term
  const filterModsBySearch = (modsList) => {
    if (!modSearchTerm) return modsList
    return modsList.filter(
      (mod) =>
        mod.name.toLowerCase().includes(modSearchTerm.toLowerCase()) ||
        mod.shortName?.toLowerCase().includes(modSearchTerm.toLowerCase())
    )
  }

  // Equip a mod to a slot
  const equipMod = (slotName, mod) => {
    setEquippedMods((prev) => ({
      ...prev,
      [slotName]: mod,
    }))
    setModSelectionSlot(null)
    setModSearchTerm('')
  }

  // Remove a mod from a slot (and all nested mods)
  const removeMod = (slotName) => {
    setEquippedMods((prev) => {
      const newMods = { ...prev }
      delete newMods[slotName]
      // Also remove any nested mods
      delete newMods[`${slotName}_nested`]
      return newMods
    })
  }

  // Toggle slot expansion
  const toggleSlotExpansion = (slotId) => {
    setExpandedSlots((prev) => ({
      ...prev,
      [slotId]: !prev[slotId],
    }))
  }

  // Save build with all attachments
  const saveBuild = () => {
    if (!selectedWeapon || !buildName.trim()) return

    const newBuild = {
      id: Date.now(),
      name: buildName,
      weapon: selectedWeapon,
      attachments: equippedMods,
      stats: calculateTotalStats(),
      createdAt: new Date().toISOString(),
    }

    setSavedBuilds([...savedBuilds, newBuild])
    setBuildName('')
  }

  // Delete build
  const deleteBuild = (buildId) => {
    const confirmed = window.confirm('Delete this build?')
    if (confirmed) {
      setSavedBuilds(savedBuilds.filter((b) => b.id !== buildId))
    }
  }

  // Load build
  const loadBuild = (build) => {
    setSelectedWeapon(build.weapon)
    setEquippedMods(build.attachments || {})
    setBuildName(build.name)
  }

  // Reset build
  const resetBuild = () => {
    setEquippedMods({})
    setExpandedSlots({})
  }

  // Format fire modes
  const formatFireModes = (modes) => {
    if (!modes || modes.length === 0) return 'Semi'
    return modes.join(' / ').toUpperCase()
  }

  // Recursive slot renderer
  const renderSlots = (slots, parentSlotName = '', depth = 0) => {
    if (!slots || slots.length === 0) return null

    return slots.map((slot, idx) => {
      const slotId = parentSlotName
        ? `${parentSlotName}.${slot.name}`
        : slot.name
      const equippedMod = equippedMods[slotId]
      const compatibleMods = getCompatibleMods(slot)
      const hasNestedSlots =
        equippedMod &&
        equippedMod.properties &&
        equippedMod.properties.slots &&
        equippedMod.properties.slots.length > 0
      const isExpanded = expandedSlots[slotId]

      return (
        <div key={idx} style={{ marginLeft: depth > 0 ? '20px' : '0' }}>
          <div
            style={{
              background: depth === 0 ? '#111827' : '#1f2937',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${depth === 0 ? '#374151' : '#4b5563'}`,
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {hasNestedSlots && (
                  <button
                    onClick={() => toggleSlotExpansion(slotId)}
                    style={{
                      padding: '2px',
                      background: 'transparent',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#d1d5db',
                  }}
                >
                  {depth > 0 && '↳ '}
                  {slot.name}
                  {slot.required && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontSize: '11px',
                        color: '#ef4444',
                      }}
                    >
                      *Required
                    </span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                {compatibleMods.length} compatible
              </div>
            </div>

            {equippedMod ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  background: depth === 0 ? '#1f2937' : '#111827',
                  borderRadius: '6px',
                }}
              >
                {equippedMod.iconLink && (
                  <img
                    src={equippedMod.iconLink}
                    alt={equippedMod.name}
                    style={{ width: '40px', height: '40px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#f3f4f6' }}>
                    {equippedMod.shortName || equippedMod.name}
                  </div>
                  {equippedMod.properties && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        marginTop: '2px',
                      }}
                    >
                      {equippedMod.properties.ergonomics &&
                        `Ergo: ${
                          equippedMod.properties.ergonomics > 0 ? '+' : ''
                        }${equippedMod.properties.ergonomics}`}
                      {hasNestedSlots &&
                        ` • ${equippedMod.properties.slots.length} slots`}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeMod(slotId)}
                  style={{
                    padding: '6px',
                    background: '#374151',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModSelectionSlot({ ...slot, slotId })}
                disabled={compatibleMods.length === 0}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: compatibleMods.length > 0 ? '#3b82f6' : '#374151',
                  color: compatibleMods.length > 0 ? '#f3f4f6' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: compatibleMods.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={14} />
                {compatibleMods.length > 0
                  ? 'Select Attachment'
                  : 'No Compatible Mods'}
              </button>
            )}
          </div>

          {/* NESTED SLOTS - Render recursively if mod has slots and is expanded */}
          {hasNestedSlots && isExpanded && (
            <div style={{ marginTop: '8px' }}>
              {renderSlots(equippedMod.properties.slots, slotId, depth + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Loader size={48} color="#3b82f6" style={{ margin: '0 auto 16px' }} />
        <div style={{ fontSize: '18px', color: '#9ca3af' }}>
          Loading weapons and attachments...
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
          This may take a moment
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
      </div>
    )
  }

  const currentStats = calculateTotalStats()

  return (
    <div style={{ padding: '20px', maxWidth: '1800px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          background: '#1f2937',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <Crosshair size={32} color="#3b82f6" />
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#f3f4f6',
                margin: 0,
              }}
            >
              Weapon Build Calculator
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: '4px 0 0 0',
              }}
            >
              Full attachment system with nested slots - Build your perfect
              weapon
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <Search
              size={18}
              color="#9ca3af"
              style={{ position: 'absolute', left: '12px', top: '12px' }}
            />
            <input
              type="text"
              placeholder="Search weapons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '14px',
              }}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '10px 16px',
              background: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Calibers</option>
            {calibers.map((caliber) => (
              <option key={caliber} value={caliber}>
                {caliber}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr 350px',
          gap: '20px',
        }}
      >
        {/* Weapon List */}
        <div>
          <div
            style={{
              background: '#1f2937',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '16px',
              }}
            >
              Weapons ({filteredWeapons.length})
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '75vh',
                overflowY: 'auto',
                paddingRight: '8px',
              }}
            >
              {filteredWeapons.map((weapon) => {
                const props = weapon.properties
                const isSelected = selectedWeapon?.id === weapon.id

                return (
                  <div
                    key={weapon.id}
                    onClick={() => {
                      setSelectedWeapon(weapon)
                      setEquippedMods({})
                      setExpandedSlots({})
                    }}
                    style={{
                      background: isSelected ? '#374151' : '#111827',
                      border: isSelected
                        ? '2px solid #3b82f6'
                        : '2px solid transparent',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {(weapon.image512pxLink || weapon.iconLink) && (
                      <img
                        src={weapon.image512pxLink || weapon.iconLink}
                        alt={weapon.name}
                        style={{
                          width: '100%',
                          height: 'auto',
                          marginBottom: '8px',
                          imageRendering: 'crisp-edges',
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#f3f4f6',
                        marginBottom: '4px',
                      }}
                    >
                      {weapon.shortName || weapon.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {props.caliber}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Build Area */}
        <div>
          {selectedWeapon ? (
            <div
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              {/* Weapon Image */}
              {selectedWeapon.image512pxLink && (
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    background: '#111827',
                    borderRadius: '8px',
                    padding: '20px',
                  }}
                >
                  <img
                    src={selectedWeapon.image512pxLink}
                    alt={selectedWeapon.name}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#f3f4f6',
                    margin: 0,
                  }}
                >
                  {selectedWeapon.name}
                </h2>
                <button
                  onClick={resetBuild}
                  style={{
                    padding: '8px 12px',
                    background: '#374151',
                    color: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Reset Build
                </button>
              </div>

              {/* Current Stats */}
              {currentStats && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                    padding: '16px',
                    background: '#111827',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginBottom: '4px',
                      }}
                    >
                      Ergonomics
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#22c55e',
                      }}
                    >
                      {currentStats.ergonomics}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginBottom: '4px',
                      }}
                    >
                      V.Recoil
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#ef4444',
                      }}
                    >
                      {currentStats.recoilVertical}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginBottom: '4px',
                      }}
                    >
                      H.Recoil
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#f59e0b',
                      }}
                    >
                      {currentStats.recoilHorizontal}
                    </div>
                  </div>
                </div>
              )}

              {/* Attachment Slots - RECURSIVE RENDERING */}
              <div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#f3f4f6',
                    marginBottom: '12px',
                  }}
                >
                  Attachment Slots (
                  {selectedWeapon.properties.slots?.length || 0})
                </h3>

                {selectedWeapon.properties.slots &&
                selectedWeapon.properties.slots.length > 0 ? (
                  <div
                    style={{
                      maxHeight: '50vh',
                      overflowY: 'auto',
                      paddingRight: '8px',
                    }}
                  >
                    {renderSlots(selectedWeapon.properties.slots)}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '14px',
                    }}
                  >
                    No attachment slots available for this weapon
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
              }}
            >
              <Crosshair
                size={48}
                color="#4b5563"
                style={{ margin: '0 auto 16px' }}
              />
              <div style={{ fontSize: '16px', color: '#9ca3af' }}>
                Select a weapon to start building
              </div>
            </div>
          )}
        </div>

        {/* Saved Builds / Mod Selection */}
        <div>
          {modSelectionSlot ? (
            <div
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#f3f4f6',
                    margin: 0,
                  }}
                >
                  Select {modSelectionSlot.name}
                </h2>
                <button
                  onClick={() => {
                    setModSelectionSlot(null)
                    setModSearchTerm('')
                  }}
                  style={{
                    padding: '6px',
                    background: '#374151',
                    color: '#f3f4f6',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search
                  size={16}
                  color="#9ca3af"
                  style={{ position: 'absolute', left: '10px', top: '10px' }}
                />
                <input
                  type="text"
                  placeholder="Search mods..."
                  value={modSearchTerm}
                  onChange={(e) => setModSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 8px 8px 34px',
                    background: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: '#f3f4f6',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div
                style={{
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {filterModsBySearch(getCompatibleMods(modSelectionSlot)).map(
                  (mod) => (
                    <div
                      key={mod.id}
                      onClick={() => equipMod(modSelectionSlot.slotId, mod)}
                      style={{
                        background: '#111827',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: '1px solid #374151',
                        transition: 'all 0.2s',
                      }}
                    >
                      {(mod.image512pxLink || mod.iconLink) && (
                        <img
                          src={mod.image512pxLink || mod.iconLink}
                          alt={mod.name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            marginBottom: '8px',
                            imageRendering: 'crisp-edges',
                          }}
                        />
                      )}
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#f3f4f6',
                          marginBottom: '4px',
                        }}
                      >
                        {mod.shortName || mod.name}
                      </div>
                      {mod.properties && (
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {mod.properties.ergonomics &&
                            `Ergo: ${mod.properties.ergonomics > 0 ? '+' : ''}${
                              mod.properties.ergonomics
                            } `}
                          {mod.properties.recoilModifier &&
                            `Recoil: ${(
                              (1 - mod.properties.recoilModifier) *
                              100
                            ).toFixed(0)}%`}
                          {mod.properties.slots &&
                            mod.properties.slots.length > 0 &&
                            ` • ${mod.properties.slots.length} slots`}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <>
              {selectedWeapon && (
                <div
                  style={{
                    background: '#1f2937',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '12px',
                    }}
                  >
                    Save This Build
                  </h3>
                  <input
                    type="text"
                    placeholder="Build name (e.g., 'Meta M4 Low Recoil')"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#374151',
                      border: '1px solid #4b5563',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                      fontSize: '14px',
                      marginBottom: '12px',
                    }}
                  />
                  <button
                    onClick={saveBuild}
                    disabled={!buildName.trim()}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: buildName.trim() ? '#22c55e' : '#374151',
                      color: buildName.trim() ? '#111827' : '#6b7280',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: buildName.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Save size={16} />
                    Save Build
                  </button>
                </div>
              )}

              {savedBuilds.length > 0 && (
                <div
                  style={{
                    background: '#1f2937',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '16px',
                    }}
                  >
                    Saved Builds ({savedBuilds.length})
                  </h2>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      maxHeight: '60vh',
                      overflowY: 'auto',
                    }}
                  >
                    {savedBuilds.map((build) => (
                      <div
                        key={build.id}
                        style={{
                          background: '#111827',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid #374151',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          {build.weapon.iconLink && (
                            <img
                              src={build.weapon.iconLink}
                              alt={build.weapon.name}
                              style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'contain',
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#f3f4f6',
                              }}
                            >
                              {build.name}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#9ca3af',
                                marginTop: '2px',
                              }}
                            >
                              {build.weapon.shortName || build.weapon.name}
                            </div>
                          </div>
                        </div>

                        {build.stats && (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 1fr',
                              gap: '8px',
                              padding: '8px',
                              background: '#1f2937',
                              borderRadius: '6px',
                              marginBottom: '8px',
                            }}
                          >
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{ fontSize: '10px', color: '#9ca3af' }}
                              >
                                Ergo
                              </div>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#22c55e',
                                }}
                              >
                                {build.stats.ergonomics}
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{ fontSize: '10px', color: '#9ca3af' }}
                              >
                                V.Recoil
                              </div>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#ef4444',
                                }}
                              >
                                {build.stats.recoilVertical}
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{ fontSize: '10px', color: '#9ca3af' }}
                              >
                                H.Recoil
                              </div>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#f59e0b',
                                }}
                              >
                                {build.stats.recoilHorizontal}
                              </div>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            marginBottom: '8px',
                          }}
                        >
                          {Object.keys(build.attachments || {}).length}{' '}
                          attachments equipped
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => loadBuild(build)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: '#3b82f6',
                              color: '#f3f4f6',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteBuild(build.id)}
                            style={{
                              padding: '8px 12px',
                              background: '#374151',
                              color: '#ef4444',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeaponBuilder
