import React, { useState, useMemo } from 'react'
import {
  Target,
  Search,
  X,
  TrendingUp,
  Shield,
  Zap,
  Crosshair,
} from 'lucide-react'

const Ballistics = () => {
  const [selectedCaliber, setSelectedCaliber] = useState('5.56x45mm')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('penetration')
  const [sortOrder, setSortOrder] = useState('desc')

  // Ammo data organized by caliber
  const ammoData = {
    '5.56x45mm': [
      {
        name: 'M995',
        damage: 40,
        penetration: 53,
        armorDamage: 58,
        fragChance: 32,
        velocity: 1013,
        price: 1800,
      },
      {
        name: 'M855A1',
        damage: 45,
        penetration: 43,
        armorDamage: 48,
        fragChance: 35,
        velocity: 945,
        price: 850,
      },
      {
        name: 'M856A1',
        damage: 51,
        penetration: 37,
        armorDamage: 42,
        fragChance: 38,
        velocity: 950,
        price: 650,
      },
      {
        name: 'M855',
        damage: 49,
        penetration: 28,
        armorDamage: 37,
        fragChance: 25,
        velocity: 922,
        price: 350,
      },
      {
        name: 'M193',
        damage: 57,
        penetration: 24,
        armorDamage: 26,
        fragChance: 13,
        velocity: 910,
        price: 180,
      },
      {
        name: 'HP',
        damage: 75,
        penetration: 11,
        armorDamage: 22,
        fragChance: 10,
        velocity: 838,
        price: 220,
      },
      {
        name: 'FMJ',
        damage: 54,
        penetration: 20,
        armorDamage: 30,
        fragChance: 15,
        velocity: 957,
        price: 150,
      },
    ],
    '7.62x39mm': [
      {
        name: 'BP',
        damage: 58,
        penetration: 47,
        armorDamage: 65,
        fragChance: 12,
        velocity: 730,
        price: 950,
      },
      {
        name: 'MAI AP',
        damage: 47,
        penetration: 58,
        armorDamage: 66,
        fragChance: 5,
        velocity: 905,
        price: 1200,
      },
      {
        name: 'PS',
        damage: 57,
        penetration: 32,
        armorDamage: 50,
        fragChance: 15,
        velocity: 700,
        price: 250,
      },
      {
        name: 'T-45M',
        damage: 64,
        penetration: 30,
        armorDamage: 48,
        fragChance: 10,
        velocity: 720,
        price: 380,
      },
      {
        name: 'HP',
        damage: 87,
        penetration: 15,
        armorDamage: 30,
        fragChance: 13,
        velocity: 654,
        price: 180,
      },
      {
        name: 'US',
        damage: 56,
        penetration: 29,
        armorDamage: 48,
        fragChance: 13,
        velocity: 730,
        price: 200,
      },
    ],
    '5.45x39mm': [
      {
        name: 'BS',
        damage: 40,
        penetration: 51,
        armorDamage: 60,
        fragChance: 17,
        velocity: 830,
        price: 850,
      },
      {
        name: 'PPBS',
        damage: 39,
        penetration: 60,
        armorDamage: 39,
        fragChance: 2,
        velocity: 895,
        price: 1400,
      },
      {
        name: 'BT',
        damage: 44,
        penetration: 37,
        armorDamage: 48,
        fragChance: 17,
        velocity: 880,
        price: 450,
      },
      {
        name: 'BP',
        damage: 48,
        penetration: 35,
        armorDamage: 46,
        fragChance: 17,
        velocity: 830,
        price: 380,
      },
      {
        name: 'PS',
        damage: 50,
        penetration: 25,
        armorDamage: 42,
        fragChance: 18,
        velocity: 890,
        price: 180,
      },
      {
        name: 'HP',
        damage: 74,
        penetration: 11,
        armorDamage: 26,
        fragChance: 20,
        velocity: 818,
        price: 120,
      },
    ],
    '7.62x51mm': [
      {
        name: 'M993',
        damage: 67,
        penetration: 70,
        armorDamage: 82,
        fragChance: 13,
        velocity: 910,
        price: 2500,
      },
      {
        name: 'M61',
        damage: 70,
        penetration: 64,
        armorDamage: 80,
        fragChance: 13,
        velocity: 849,
        price: 1800,
      },
      {
        name: 'M62',
        damage: 79,
        penetration: 54,
        armorDamage: 72,
        fragChance: 14,
        velocity: 816,
        price: 950,
      },
      {
        name: 'M80',
        damage: 80,
        penetration: 41,
        armorDamage: 66,
        fragChance: 19,
        velocity: 833,
        price: 450,
      },
      {
        name: 'BPZ FMJ',
        damage: 88,
        penetration: 31,
        armorDamage: 60,
        fragChance: 16,
        velocity: 838,
        price: 280,
      },
      {
        name: 'Ultra Nosler',
        damage: 107,
        penetration: 15,
        armorDamage: 48,
        fragChance: 100,
        velocity: 822,
        price: 650,
      },
    ],
    '9x19mm': [
      {
        name: 'AP 6.3',
        damage: 52,
        penetration: 30,
        armorDamage: 35,
        fragChance: 2,
        velocity: 420,
        price: 450,
      },
      {
        name: 'PBP',
        damage: 52,
        penetration: 39,
        armorDamage: 37,
        fragChance: 2,
        velocity: 560,
        price: 850,
      },
      {
        name: 'PSO',
        damage: 54,
        penetration: 25,
        armorDamage: 33,
        fragChance: 10,
        velocity: 340,
        price: 180,
      },
      {
        name: 'Pst gzh',
        damage: 54,
        penetration: 20,
        armorDamage: 32,
        fragChance: 10,
        velocity: 457,
        price: 120,
      },
      {
        name: 'Luger CCI',
        damage: 70,
        penetration: 10,
        armorDamage: 33,
        fragChance: 25,
        velocity: 420,
        price: 90,
      },
      {
        name: 'RIP',
        damage: 102,
        penetration: 2,
        armorDamage: 11,
        fragChance: 100,
        velocity: 381,
        price: 280,
      },
    ],
    '12 Gauge': [
      {
        name: 'AP-20',
        damage: 164,
        penetration: 37,
        armorDamage: 65,
        fragChance: 3,
        velocity: 510,
        price: 850,
      },
      {
        name: 'Flechette',
        damage: 25,
        penetration: 26,
        armorDamage: 35,
        fragChance: 0,
        velocity: 320,
        price: 280,
      },
      {
        name: 'Magnum Buck',
        damage: 37,
        penetration: 2,
        armorDamage: 11,
        fragChance: 0,
        velocity: 385,
        price: 120,
      },
      {
        name: 'Dual Sabot',
        damage: 85,
        penetration: 17,
        armorDamage: 32,
        fragChance: 10,
        velocity: 415,
        price: 380,
      },
      {
        name: 'Slug',
        damage: 170,
        penetration: 20,
        armorDamage: 80,
        fragChance: 5,
        velocity: 415,
        price: 180,
      },
    ],
    '.45 ACP': [
      {
        name: 'AP',
        damage: 66,
        penetration: 32,
        armorDamage: 46,
        fragChance: 6,
        velocity: 261,
        price: 650,
      },
      {
        name: 'Match FMJ',
        damage: 72,
        penetration: 25,
        armorDamage: 50,
        fragChance: 10,
        velocity: 293,
        price: 180,
      },
      {
        name: 'Hydra-Shok',
        damage: 99,
        penetration: 13,
        armorDamage: 39,
        fragChance: 65,
        velocity: 274,
        price: 320,
      },
      {
        name: 'RIP',
        damage: 127,
        penetration: 4,
        armorDamage: 11,
        fragChance: 100,
        velocity: 293,
        price: 450,
      },
    ],
    '9x39mm': [
      {
        name: 'BP',
        damage: 60,
        penetration: 55,
        armorDamage: 60,
        fragChance: 6,
        velocity: 295,
        price: 950,
      },
      {
        name: 'SPP',
        damage: 64,
        penetration: 46,
        armorDamage: 55,
        fragChance: 10,
        velocity: 310,
        price: 750,
      },
      {
        name: 'SP-6',
        damage: 58,
        penetration: 46,
        armorDamage: 60,
        fragChance: 2,
        velocity: 305,
        price: 650,
      },
      {
        name: 'SP-5',
        damage: 68,
        penetration: 38,
        armorDamage: 50,
        fragChance: 10,
        velocity: 290,
        price: 380,
      },
      {
        name: 'PAB-9',
        damage: 62,
        penetration: 28,
        armorDamage: 46,
        fragChance: 8,
        velocity: 320,
        price: 280,
      },
    ],
  }

  const calibers = Object.keys(ammoData)
  const currentAmmo = ammoData[selectedCaliber] || []

  // Filter and sort ammo
  const filteredAndSortedAmmo = useMemo(() => {
    let filtered = currentAmmo.filter((ammo) =>
      ammo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      let compareA = a[sortBy]
      let compareB = b[sortBy]

      if (sortOrder === 'asc') {
        return compareA - compareB
      } else {
        return compareB - compareA
      }
    })

    return filtered
  }, [currentAmmo, searchTerm, sortBy, sortOrder])

  // Get armor class effectiveness color
  const getArmorClassColor = (penetration) => {
    if (penetration >= 60) return '#22c55e' // Class 6
    if (penetration >= 50) return '#3b82f6' // Class 5
    if (penetration >= 40) return '#8b5cf6' // Class 4
    if (penetration >= 30) return '#f59e0b' // Class 3
    if (penetration >= 20) return '#f97316' // Class 2
    return '#ef4444' // Class 1
  }

  const getArmorClassName = (penetration) => {
    if (penetration >= 60) return 'Class 6'
    if (penetration >= 50) return 'Class 5'
    if (penetration >= 40) return 'Class 4'
    if (penetration >= 30) return 'Class 3'
    if (penetration >= 20) return 'Class 2'
    return 'Class 1-2'
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
          }}
        >
          Ballistics Chart
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '16px' }}>
          Compare ammunition effectiveness, penetration, and damage values
        </p>
      </div>

      {/* Caliber Selection */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {calibers.map((caliber) => {
          const isSelected = selectedCaliber === caliber
          const ammoCount = ammoData[caliber].length

          return (
            <div
              key={caliber}
              onClick={() => setSelectedCaliber(caliber)}
              style={{
                padding: '16px',
                backgroundColor: isSelected ? '#1e3a8a' : '#1f2937',
                border: `2px solid ${isSelected ? '#3b82f6' : '#374151'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#374151'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {caliber}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                }}
              >
                {ammoCount} types
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls Row */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ammo types..."
            style={{
              width: '100%',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '10px 12px 10px 40px',
              color: '#f3f4f6',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '4px',
                backgroundColor: 'transparent',
                color: '#9ca3af',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Options */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#f3f4f6',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="penetration">Penetration</option>
            <option value="damage">Damage</option>
            <option value="armorDamage">Armor Damage</option>
            <option value="fragChance">Frag Chance</option>
            <option value="velocity">Velocity</option>
            <option value="price">Price</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <TrendingUp
              size={16}
              style={{
                transform:
                  sortOrder === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s',
              }}
            />
            {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div
        style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginBottom: '16px',
        }}
      >
        Showing {filteredAndSortedAmmo.length} of {currentAmmo.length} ammo
        types
      </div>

      {/* Ammo Comparison Table */}
      <div
        style={{
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px repeat(6, 1fr)',
            gap: '16px',
            padding: '16px 20px',
            backgroundColor: '#374151',
            borderBottom: '1px solid #4b5563',
            fontWeight: '600',
            fontSize: '13px',
            color: '#d1d5db',
          }}
        >
          <div>Ammo Type</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={14} />
            Penetration
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Crosshair size={14} />
            Damage
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} />
            Armor Dmg
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} />
            Frag %
          </div>
          <div>Velocity</div>
          <div>Price</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: '600px', overflow: 'auto' }}>
          {filteredAndSortedAmmo.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                color: '#6b7280',
              }}
            >
              <Target
                size={48}
                style={{ margin: '0 auto 16px', opacity: 0.3 }}
              />
              <p>No ammo types found</p>
            </div>
          ) : (
            filteredAndSortedAmmo.map((ammo, index) => {
              const armorClassColor = getArmorClassColor(ammo.penetration)
              const armorClassName = getArmorClassName(ammo.penetration)

              return (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '200px repeat(6, 1fr)',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom:
                      index < filteredAndSortedAmmo.length - 1
                        ? '1px solid #374151'
                        : 'none',
                    transition: 'background 0.2s',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#374151')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  {/* Ammo Name */}
                  <div>
                    <div
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {ammo.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: armorClassColor,
                        fontWeight: '600',
                      }}
                    >
                      {armorClassName}
                    </div>
                  </div>

                  {/* Penetration */}
                  <div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: armorClassColor,
                        marginBottom: '4px',
                      }}
                    >
                      {ammo.penetration}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#374151',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(ammo.penetration / 70) * 100}%`,
                          height: '100%',
                          backgroundColor: armorClassColor,
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </div>

                  {/* Damage */}
                  <div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#f59e0b',
                        marginBottom: '4px',
                      }}
                    >
                      {ammo.damage}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#374151',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(ammo.damage / 170) * 100}%`,
                          height: '100%',
                          backgroundColor: '#f59e0b',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </div>

                  {/* Armor Damage */}
                  <div style={{ color: '#d1d5db' }}>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {ammo.armorDamage}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#374151',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(ammo.armorDamage / 82) * 100}%`,
                          height: '100%',
                          backgroundColor: '#8b5cf6',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </div>

                  {/* Frag Chance */}
                  <div style={{ color: '#d1d5db' }}>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {ammo.fragChance}%
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#374151',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${ammo.fragChance}%`,
                          height: '100%',
                          backgroundColor: '#ef4444',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </div>

                  {/* Velocity */}
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                    {ammo.velocity} m/s
                  </div>

                  {/* Price */}
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    ₽{ammo.price.toLocaleString()}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '12px',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '12px',
          }}
        >
          Armor Class Penetration Guide
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#22c55e',
                borderRadius: '4px',
              }}
            />
            <span style={{ fontSize: '13px', color: '#d1d5db' }}>
              Class 6 (60+)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#3b82f6',
                borderRadius: '4px',
              }}
            />
            <span style={{ fontSize: '13px', color: '#d1d5db' }}>
              Class 5 (50-59)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#8b5cf6',
                borderRadius: '4px',
              }}
            />
            <span style={{ fontSize: '13px', color: '#d1d5db' }}>
              Class 4 (40-49)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#f59e0b',
                borderRadius: '4px',
              }}
            />
            <span style={{ fontSize: '13px', color: '#d1d5db' }}>
              Class 3 (30-39)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#f97316',
                borderRadius: '4px',
              }}
            />
            <span style={{ fontSize: '13px', color: '#d1d5db' }}>
              Class 2 (20-29)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#ef4444',
                borderRadius: '4px',
              }}
            />
            <span style={{ fontSize: '13px', color: '#d1d5db' }}>
              Class 1 (&lt;20)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ballistics
