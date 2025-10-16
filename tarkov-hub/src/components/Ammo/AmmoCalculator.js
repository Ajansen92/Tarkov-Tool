import React, { useState, useEffect } from 'react'
import {
  Target,
  Shield,
  Zap,
  TrendingUp,
  Activity,
  Info,
  Search,
} from 'lucide-react'

const AmmoCalculator = () => {
  const [ammoTypes, setAmmoTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAmmo, setSelectedAmmo] = useState(null)
  const [armorClass, setArmorClass] = useState(4)
  const [armorDurability, setArmorDurability] = useState(100)
  const [weaponFireRate, setWeaponFireRate] = useState(800)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCaliber, setFilterCaliber] = useState('all')

  // Fetch ammunition data
  useEffect(() => {
    const fetchAmmo = async () => {
      try {
        const query = `
          query {
            ammo {
              item {
                id
                name
                shortName
                iconLink
                avg24hPrice
              }
              caliber
              damage
              armorDamage
              penetrationPower
              fragmentationChance
              initialSpeed
              tracer
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

        setAmmoTypes(
          data.data.ammo.sort((a, b) => a.item.name.localeCompare(b.item.name))
        )
        setLoading(false)
      } catch (err) {
        console.error('Error fetching ammo:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchAmmo()
  }, [])

  // Get unique calibers
  const calibers = [...new Set(ammoTypes.map((a) => a.caliber))].sort()

  // Filter ammo
  const filteredAmmo = ammoTypes.filter((ammo) => {
    const matchesSearch =
      ammo.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ammo.item.shortName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCaliber =
      filterCaliber === 'all' || ammo.caliber === filterCaliber
    return matchesSearch && matchesCaliber
  })

  // Calculate penetration chance
  const calculatePenetrationChance = () => {
    if (!selectedAmmo) return 0

    const pen = selectedAmmo.penetrationPower
    const armorValue = armorClass * 10 // Simplified: Class 4 = 40 armor
    const durabilityFactor = armorDurability / 100
    const effectiveArmor = armorValue * durabilityFactor

    // Simplified Tarkov penetration formula
    if (pen >= effectiveArmor * 1.3) return 100
    if (pen >= effectiveArmor)
      return 75 + ((pen - effectiveArmor) / effectiveArmor) * 25
    if (pen >= effectiveArmor * 0.7)
      return 50 + ((pen - effectiveArmor * 0.7) / (effectiveArmor * 0.3)) * 25
    if (pen >= effectiveArmor * 0.4)
      return 25 + ((pen - effectiveArmor * 0.4) / (effectiveArmor * 0.3)) * 25
    return Math.max(0, (pen / (effectiveArmor * 0.4)) * 25)
  }

  // Calculate effective damage
  const calculateEffectiveDamage = () => {
    if (!selectedAmmo) return 0

    const penChance = calculatePenetrationChance() / 100
    const fullDamage = selectedAmmo.damage
    const reducedDamage = fullDamage * 0.4 // 60% damage reduction on non-pen

    return penChance * fullDamage + (1 - penChance) * reducedDamage
  }

  // Calculate shots to kill
  const calculateShotsToKill = () => {
    const effectiveDamage = calculateEffectiveDamage()
    const thoraxHP = 85 // PMC thorax HP
    return Math.ceil(thoraxHP / effectiveDamage)
  }

  // Calculate time to kill (TTK)
  const calculateTTK = () => {
    const shotsNeeded = calculateShotsToKill()
    const timePerShot = 60 / weaponFireRate // Convert RPM to seconds per shot
    return ((shotsNeeded - 1) * timePerShot).toFixed(2)
  }

  // Get armor class color
  const getArmorClassColor = (classNum) => {
    const colors = {
      1: '#6b7280',
      2: '#22c55e',
      3: '#3b82f6',
      4: '#8b5cf6',
      5: '#f59e0b',
      6: '#ef4444',
    }
    return colors[classNum] || '#9ca3af'
  }

  // Get penetration chance color
  const getPenChanceColor = (chance) => {
    if (chance >= 80) return '#22c55e'
    if (chance >= 50) return '#fbbf24'
    if (chance >= 25) return '#f59e0b'
    return '#ef4444'
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#9ca3af' }}>
          Loading ammunition data...
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

  const penChance = calculatePenetrationChance()
  const effectiveDamage = calculateEffectiveDamage()
  const shotsToKill = calculateShotsToKill()
  const ttk = calculateTTK()

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
          <Target size={32} color="#3b82f6" />
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#f3f4f6',
                margin: 0,
              }}
            >
              Ammo Effectiveness Calculator
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: '4px 0 0 0',
              }}
            >
              Calculate penetration chance, damage, and time to kill
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
              placeholder="Search ammunition..."
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
            value={filterCaliber}
            onChange={(e) => setFilterCaliber(e.target.value)}
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
          gridTemplateColumns: '400px 1fr',
          gap: '20px',
        }}
      >
        {/* Ammo List */}
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
              Ammunition ({filteredAmmo.length})
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '75vh',
                overflowY: 'auto',
                paddingRight: '8px',
              }}
            >
              {filteredAmmo.map((ammo) => {
                const isSelected = selectedAmmo?.item.id === ammo.item.id

                return (
                  <div
                    key={ammo.item.id}
                    onClick={() => setSelectedAmmo(ammo)}
                    style={{
                      background: isSelected ? '#374151' : '#111827',
                      border: isSelected
                        ? '2px solid #3b82f6'
                        : '2px solid transparent',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {ammo.item.iconLink && (
                      <img
                        src={ammo.item.iconLink}
                        alt={ammo.item.name}
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
                          marginBottom: '4px',
                        }}
                      >
                        {ammo.item.shortName || ammo.item.name}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          marginBottom: '4px',
                        }}
                      >
                        {ammo.caliber}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: '#ef4444' }}>
                          DMG: {ammo.damage}
                        </span>
                        <span style={{ color: '#fbbf24' }}>
                          PEN: {ammo.penetrationPower}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div>
          {selectedAmmo ? (
            <div>
              {/* Ammo Details */}
              <div
                style={{
                  background: '#1f2937',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '20px',
                  }}
                >
                  {selectedAmmo.item.iconLink && (
                    <img
                      src={selectedAmmo.item.iconLink}
                      alt={selectedAmmo.item.name}
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                  <div>
                    <h2
                      style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#f3f4f6',
                        margin: 0,
                      }}
                    >
                      {selectedAmmo.item.name}
                    </h2>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        marginTop: '4px',
                      }}
                    >
                      {selectedAmmo.caliber}
                      {selectedAmmo.tracer && (
                        <span style={{ marginLeft: '8px', color: '#f59e0b' }}>
                          • TRACER
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Base Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                  }}
                >
                  <StatCard
                    label="Damage"
                    value={selectedAmmo.damage}
                    icon={<Zap size={16} />}
                    color="#ef4444"
                  />
                  <StatCard
                    label="Penetration"
                    value={selectedAmmo.penetrationPower}
                    icon={<Target size={16} />}
                    color="#fbbf24"
                  />
                  <StatCard
                    label="Armor Damage"
                    value={`${selectedAmmo.armorDamage}%`}
                    icon={<Shield size={16} />}
                    color="#8b5cf6"
                  />
                  <StatCard
                    label="Frag Chance"
                    value={`${(selectedAmmo.fragmentationChance * 100).toFixed(
                      0
                    )}%`}
                    icon={<Activity size={16} />}
                    color="#22c55e"
                  />
                </div>
              </div>

              {/* Configuration */}
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
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#f3f4f6',
                    marginBottom: '16px',
                  }}
                >
                  Target Configuration
                </h3>

                {/* Armor Class Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      fontSize: '14px',
                      color: '#d1d5db',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Armor Class
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5, 6].map((classNum) => (
                      <button
                        key={classNum}
                        onClick={() => setArmorClass(classNum)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background:
                            armorClass === classNum
                              ? getArmorClassColor(classNum)
                              : '#374151',
                          color: '#f3f4f6',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {classNum}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Armor Durability Slider */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>
                      Armor Durability
                    </label>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#f3f4f6',
                      }}
                    >
                      {armorDurability}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={armorDurability}
                    onChange={(e) => setArmorDurability(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${armorDurability}%, #374151 ${armorDurability}%, #374151 100%)`,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  />
                </div>

                {/* Weapon Fire Rate */}
                <div>
                  <label
                    style={{
                      fontSize: '14px',
                      color: '#d1d5db',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Weapon Fire Rate (RPM)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="1200"
                    step="50"
                    value={weaponFireRate}
                    onChange={(e) => setWeaponFireRate(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#374151',
                      border: '1px solid #4b5563',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              {/* Results */}
              <div
                style={{
                  background: '#1f2937',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#f3f4f6',
                    marginBottom: '16px',
                  }}
                >
                  Effectiveness Results
                </h3>

                {/* Penetration Chance */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#d1d5db' }}>
                      Penetration Chance
                    </span>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: getPenChanceColor(penChance),
                      }}
                    >
                      {penChance.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '12px',
                      background: '#374151',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${penChance}%`,
                        height: '100%',
                        background: getPenChanceColor(penChance),
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <ResultCard
                    label="Effective Damage"
                    value={effectiveDamage.toFixed(1)}
                    color="#ef4444"
                  />
                  <ResultCard
                    label="Shots to Kill"
                    value={shotsToKill}
                    color="#fbbf24"
                  />
                  <ResultCard
                    label="Time to Kill"
                    value={`${ttk}s`}
                    color="#22c55e"
                  />
                </div>

                {/* Info Box */}
                <div
                  style={{
                    background: '#111827',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #374151',
                  }}
                >
                  <div
                    style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}
                  >
                    <Info size={16} color="#3b82f6" />
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#d1d5db',
                      }}
                    >
                      Calculation Notes
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#9ca3af',
                      lineHeight: '1.6',
                    }}
                  >
                    • Assumes thorax shots (85 HP)
                    <br />
                    • Non-penetrating shots deal 40% damage
                    <br />
                    • TTK calculated from fire rate
                    <br />
                    • Fragmentation not included
                    <br />• Simplified penetration formula
                  </div>
                </div>
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
              <Target
                size={48}
                color="#4b5563"
                style={{ margin: '0 auto 16px' }}
              />
              <div style={{ fontSize: '16px', color: '#9ca3af' }}>
                Select ammunition to calculate effectiveness
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ label, value, icon, color }) => (
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
        fontSize: '20px',
        fontWeight: '600',
        color: '#f3f4f6',
      }}
    >
      {value}
    </div>
  </div>
)

// Result Card Component
const ResultCard = ({ label, value, color }) => (
  <div
    style={{
      background: '#111827',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
      {label}
    </div>
    <div
      style={{
        fontSize: '28px',
        fontWeight: '700',
        color: color,
      }}
    >
      {value}
    </div>
  </div>
)

export default AmmoCalculator
