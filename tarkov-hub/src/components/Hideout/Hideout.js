import React, { useState, useEffect } from 'react'
import {
  Box,
  Package,
  Zap,
  Wrench,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
} from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const Hideout = () => {
  const [hideoutData, setHideoutData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userProgress, setUserProgress] = useLocalStorage('tarkov-hideout', {})
  const [expandedStation, setExpandedStation] = useState(null)
  const [filterLevel, setFilterLevel] = useState('all') // all, incomplete, complete

  // Fetch hideout data from API
  useEffect(() => {
    const fetchHideoutData = async () => {
      try {
        const query = `
          query {
            hideoutStations {
              id
              name
              normalizedName
              imageLink
              levels {
                id
                level
                constructionTime
                description
                itemRequirements {
                  item {
                    id
                    name
                    shortName
                    iconLink
                    avg24hPrice
                  }
                  count
                  quantity
                }
                stationLevelRequirements {
                  station {
                    id
                    name
                  }
                  level
                }
                skillRequirements {
                  name
                  level
                }
                traderRequirements {
                  trader {
                    name
                  }
                  level
                }
                crafts {
                  duration
                  requiredItems {
                    item {
                      name
                      shortName
                    }
                    count
                  }
                  rewardItems {
                    item {
                      name
                      shortName
                    }
                    count
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

        setHideoutData(data.data.hideoutStations)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching hideout data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchHideoutData()
  }, [])

  // Update user progress for a specific station level
  const updateStationLevel = (stationId, level) => {
    setUserProgress((prev) => ({
      ...prev,
      [stationId]: level,
    }))
  }

  // Get current level for a station
  const getCurrentLevel = (stationId) => {
    return userProgress[stationId] || 0
  }

  // Calculate total cost for a level
  const calculateLevelCost = (level) => {
    if (!level.itemRequirements) return 0
    return level.itemRequirements.reduce((total, req) => {
      return total + req.item.avg24hPrice * req.count
    }, 0)
  }

  // Format price
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `₽${(price / 1000000).toFixed(2)}M`
    } else if (price >= 1000) {
      return `₽${(price / 1000).toFixed(0)}K`
    }
    return `₽${price}`
  }

  // Format time
  const formatTime = (seconds) => {
    if (!seconds) return 'Instant'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Filter stations based on completion status
  const filteredStations = hideoutData.filter((station) => {
    const currentLevel = getCurrentLevel(station.id)
    const maxLevel = station.levels.length

    if (filterLevel === 'complete') {
      return currentLevel === maxLevel
    } else if (filterLevel === 'incomplete') {
      return currentLevel < maxLevel
    }
    return true
  })

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (hideoutData.length === 0) return { current: 0, total: 0, percentage: 0 }

    let totalLevels = 0
    let completedLevels = 0

    hideoutData.forEach((station) => {
      totalLevels += station.levels.length
      completedLevels += getCurrentLevel(station.id)
    })

    return {
      current: completedLevels,
      total: totalLevels,
      percentage: Math.round((completedLevels / totalLevels) * 100),
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#9ca3af' }}>
          Loading hideout data...
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

  const progress = calculateOverallProgress()

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
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
          <Box size={32} color="#3b82f6" />
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#f3f4f6',
              margin: 0,
            }}
          >
            Hideout Tracker
          </h1>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#d1d5db',
            }}
          >
            <span>Overall Progress</span>
            <span style={{ fontWeight: '600' }}>
              {progress.current} / {progress.total} ({progress.percentage}%)
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
                width: `${progress.percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #22c55e)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'incomplete', 'complete'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterLevel(filter)}
              style={{
                padding: '8px 16px',
                background: filterLevel === filter ? '#3b82f6' : '#374151',
                color: '#f3f4f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stations Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredStations.map((station) => {
          const currentLevel = getCurrentLevel(station.id)
          const maxLevel = station.levels.length
          const isMaxed = currentLevel === maxLevel
          const nextLevel = station.levels[currentLevel]

          return (
            <div
              key={station.id}
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                overflow: 'hidden',
                border: isMaxed ? '2px solid #22c55e' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {/* Station Header */}
              <div style={{ padding: '16px', background: '#111827' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  {station.imageLink ? (
                    <img
                      src={station.imageLink}
                      alt={station.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: '#374151',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Package size={24} color="#9ca3af" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#f3f4f6',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {station.name}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Level {currentLevel} / {maxLevel}
                      {isMaxed && (
                        <span
                          style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            background: '#22c55e',
                            color: '#111827',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          MAX
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div style={{ marginTop: '12px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: '#374151',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(currentLevel / maxLevel) * 100}%`,
                        height: '100%',
                        background: isMaxed ? '#22c55e' : '#3b82f6',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Level Controls */}
              {!isMaxed && nextLevel && (
                <div style={{ padding: '16px' }}>
                  <div
                    style={{
                      marginBottom: '12px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #374151',
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
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#d1d5db',
                          fontWeight: '600',
                        }}
                      >
                        Next: Level {nextLevel.level}
                      </span>
                      <span style={{ fontSize: '14px', color: '#fbbf24' }}>
                        {formatPrice(calculateLevelCost(nextLevel))}
                      </span>
                    </div>
                    {nextLevel.constructionTime > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          color: '#9ca3af',
                        }}
                      >
                        <Wrench size={14} />
                        <span>{formatTime(nextLevel.constructionTime)}</span>
                      </div>
                    )}
                  </div>

                  {/* Requirements Button */}
                  <button
                    onClick={() =>
                      setExpandedStation(
                        expandedStation === station.id ? null : station.id
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#374151',
                      color: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>View Requirements</span>
                    {expandedStation === station.id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  {/* Mark Complete Button */}
                  <button
                    onClick={() =>
                      updateStationLevel(station.id, currentLevel + 1)
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#22c55e',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Check size={16} />
                    Mark Level {nextLevel.level} Complete
                  </button>
                </div>
              )}

              {/* Maxed Station Actions */}
              {isMaxed && (
                <div style={{ padding: '16px' }}>
                  <button
                    onClick={() =>
                      updateStationLevel(station.id, currentLevel - 1)
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#374151',
                      color: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                    }}
                  >
                    Reset to Level {currentLevel - 1}
                  </button>
                </div>
              )}

              {/* Expanded Requirements */}
              {expandedStation === station.id && nextLevel && (
                <div
                  style={{
                    padding: '16px',
                    background: '#111827',
                    borderTop: '1px solid #374151',
                  }}
                >
                  {/* Item Requirements */}
                  {nextLevel.itemRequirements &&
                    nextLevel.itemRequirements.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#d1d5db',
                            marginBottom: '8px',
                          }}
                        >
                          Required Items
                        </h4>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          {nextLevel.itemRequirements.map((req, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                background: '#1f2937',
                                borderRadius: '6px',
                              }}
                            >
                              {req.item.iconLink && (
                                <img
                                  src={req.item.iconLink}
                                  alt={req.item.name}
                                  style={{ width: '32px', height: '32px' }}
                                />
                              )}
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{ fontSize: '13px', color: '#f3f4f6' }}
                                >
                                  {req.item.name}
                                </div>
                                <div
                                  style={{ fontSize: '12px', color: '#9ca3af' }}
                                >
                                  {formatPrice(req.item.avg24hPrice)} ×{' '}
                                  {req.count}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#fbbf24',
                                }}
                              >
                                {formatPrice(req.item.avg24hPrice * req.count)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Station Requirements */}
                  {nextLevel.stationLevelRequirements &&
                    nextLevel.stationLevelRequirements.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#d1d5db',
                            marginBottom: '8px',
                          }}
                        >
                          Required Stations
                        </h4>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          {nextLevel.stationLevelRequirements.map(
                            (req, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px',
                                  background: '#1f2937',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  color: '#f3f4f6',
                                }}
                              >
                                <Lock size={14} color="#9ca3af" />
                                {req.station.name} - Level {req.level}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Skill Requirements */}
                  {nextLevel.skillRequirements &&
                    nextLevel.skillRequirements.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#d1d5db',
                            marginBottom: '8px',
                          }}
                        >
                          Required Skills
                        </h4>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          {nextLevel.skillRequirements.map((req, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                background: '#1f2937',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: '#f3f4f6',
                              }}
                            >
                              <Zap size={14} color="#fbbf24" />
                              {req.name} - Level {req.level}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Trader Requirements */}
                  {nextLevel.traderRequirements &&
                    nextLevel.traderRequirements.length > 0 && (
                      <div>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#d1d5db',
                            marginBottom: '8px',
                          }}
                        >
                          Required Traders
                        </h4>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          {nextLevel.traderRequirements.map((req, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                background: '#1f2937',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: '#f3f4f6',
                              }}
                            >
                              <Package size={14} color="#8b5cf6" />
                              {req.trader.name} - Level {req.level}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredStations.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: '#9ca3af',
          }}
        >
          <Package size={48} style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: '18px' }}>
            No stations found with current filter
          </div>
        </div>
      )}
    </div>
  )
}

export default Hideout
