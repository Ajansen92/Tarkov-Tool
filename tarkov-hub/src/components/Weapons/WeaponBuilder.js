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
} from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const WeaponBuilder = () => {
  const [weapons, setWeapons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWeapon, setSelectedWeapon] = useState(null)
  const [buildName, setBuildName] = useState('')
  const [savedBuilds, setSavedBuilds] = useLocalStorage(
    'tarkov-weapon-builds',
    []
  )
  const [filterCategory, setFilterCategory] = useState('all')

  // Fetch weapons from API
  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const query = `
          query {
            items(types: [gun]) {
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
                  sightingRange
                  centerOfImpact
                  convergence
                  recoilAngle
                  recoilDispersion
                  cameraRecoil
                  cameraSnap
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

        // Filter and sort weapons
        const weaponList = data.data.items
          .filter((item) => item.properties && item.properties.ergonomics)
          .sort((a, b) => a.name.localeCompare(b.name))

        setWeapons(weaponList)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching weapons:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchWeapons()
  }, [])

  // Get caliber from weapon name for filtering
  const getCaliber = (weapon) => {
    return weapon.properties?.caliber || 'Unknown'
  }

  // Get unique calibers for filter
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

  // Save build
  const saveBuild = () => {
    if (!selectedWeapon || !buildName.trim()) return

    const newBuild = {
      id: Date.now(),
      name: buildName,
      weapon: selectedWeapon,
      createdAt: new Date().toISOString(),
    }

    setSavedBuilds([...savedBuilds, newBuild])
    setBuildName('')
    // Show success message (you can replace with a toast notification later)
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
    setBuildName(build.name)
  }

  // Calculate recoil sum
  const getRecoilSum = (weapon) => {
    const props = weapon.properties
    return (props.recoilVertical || 0) + (props.recoilHorizontal || 0)
  }

  // Format fire modes
  const formatFireModes = (modes) => {
    if (!modes || modes.length === 0) return 'Semi'
    return modes.join(' / ').toUpperCase()
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#9ca3af' }}>
          Loading weapons...
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

  return (
    <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
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
              Compare weapon stats and save your favorite builds
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
          gridTemplateColumns: '1fr 400px',
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
              marginBottom: '20px',
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
              Available Weapons ({filteredWeapons.length})
            </h2>

            <div
              style={{
                display: 'grid',
                gap: '12px',
                maxHeight: '70vh',
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
                    onClick={() => setSelectedWeapon(weapon)}
                    style={{
                      background: isSelected ? '#374151' : '#111827',
                      border: isSelected
                        ? '2px solid #3b82f6'
                        : '2px solid transparent',
                      borderRadius: '10px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    {weapon.iconLink && (
                      <img
                        src={weapon.iconLink}
                        alt={weapon.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'contain',
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#f3f4f6',
                          marginBottom: '4px',
                        }}
                      >
                        {weapon.name}
                      </h3>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#9ca3af',
                          marginBottom: '8px',
                        }}
                      >
                        {props.caliber} • {formatFireModes(props.fireModes)} •{' '}
                        {props.fireRate} RPM
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '13px',
                        }}
                      >
                        <div style={{ color: '#22c55e' }}>
                          <Zap
                            size={14}
                            style={{ display: 'inline', marginRight: '4px' }}
                          />
                          Ergo: {props.ergonomics}
                        </div>
                        <div style={{ color: '#ef4444' }}>
                          <TrendingUp
                            size={14}
                            style={{ display: 'inline', marginRight: '4px' }}
                          />
                          Recoil: {getRecoilSum(weapon)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected Weapon / Saved Builds */}
        <div>
          {selectedWeapon ? (
            <div
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
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
                Selected Weapon
              </h2>

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

              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#f3f4f6',
                  marginBottom: '8px',
                }}
              >
                {selectedWeapon.name}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                  marginBottom: '20px',
                }}
              >
                {selectedWeapon.description}
              </p>

              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <StatCard
                  label="Ergonomics"
                  value={selectedWeapon.properties.ergonomics}
                  icon={<Zap size={16} />}
                  color="#22c55e"
                />
                <StatCard
                  label="Vertical Recoil"
                  value={selectedWeapon.properties.recoilVertical}
                  icon={<TrendingUp size={16} />}
                  color="#ef4444"
                />
                <StatCard
                  label="Horizontal Recoil"
                  value={selectedWeapon.properties.recoilHorizontal}
                  icon={<TrendingDown size={16} />}
                  color="#f59e0b"
                />
                <StatCard
                  label="Recoil Sum"
                  value={getRecoilSum(selectedWeapon)}
                  icon={<Target size={16} />}
                  color="#8b5cf6"
                />
                <StatCard
                  label="Fire Rate"
                  value={`${selectedWeapon.properties.fireRate} RPM`}
                  color="#3b82f6"
                />
                <StatCard
                  label="Caliber"
                  value={selectedWeapon.properties.caliber}
                  color="#06b6d4"
                />
                <StatCard
                  label="Fire Modes"
                  value={formatFireModes(selectedWeapon.properties.fireModes)}
                  color="#ec4899"
                />
                <StatCard
                  label="Weight"
                  value={`${selectedWeapon.weight} kg`}
                  color="#9ca3af"
                />
              </div>

              {/* Save Build */}
              <div
                style={{ borderTop: '1px solid #374151', paddingTop: '20px' }}
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
                  placeholder="Build name (e.g., 'Low Recoil M4')"
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
                    transition: 'all 0.2s',
                  }}
                >
                  <Save size={16} />
                  Save Build
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              <Crosshair
                size={48}
                color="#4b5563"
                style={{ margin: '0 auto 16px' }}
              />
              <div style={{ fontSize: '16px', color: '#9ca3af' }}>
                Select a weapon to view stats
              </div>
            </div>
          )}

          {/* Saved Builds */}
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
                }}
              >
                {savedBuilds.map((build) => (
                  <div
                    key={build.id}
                    style={{
                      background: '#111827',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
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
                    <button
                      onClick={() => loadBuild(build)}
                      style={{
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
                        padding: '8px',
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ label, value, icon, color = '#3b82f6' }) => (
  <div
    style={{
      background: '#111827',
      borderRadius: '8px',
      padding: '12px',
      borderLeft: `3px solid ${color}`,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '4px',
        color: '#9ca3af',
        fontSize: '12px',
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
    <div
      style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#f3f4f6',
      }}
    >
      {value}
    </div>
  </div>
)

export default WeaponBuilder
