import React, { useState, useRef, useEffect } from 'react'
import {
  MapPin,
  Search,
  Eye,
  Target,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'

const Maps = ({ quests, onNavigateToQuest }) => {
  const [selectedMap, setSelectedMap] = useState('Customs')
  const [showQuestMarkers, setShowQuestMarkers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredQuest, setHoveredQuest] = useState(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapContainerRef = useRef(null)

  // Map data - using placeholder until real images are added
  const maps = [
    {
      name: 'Customs',
      icon: '🏭',
      color: '#3b82f6',
      image: null, // Add your own image URL here
      description: 'Industrial area with dorms and gas station',
      size: 'Medium',
      players: '8-12 PMCs',
      width: 1200,
      height: 900,
    },
    {
      name: 'Woods',
      icon: '🌲',
      color: '#22c55e',
      image: null,
      description: 'Forest terrain with sawmill and USEC camp',
      size: 'Large',
      players: '8-12 PMCs',
      width: 1200,
      height: 900,
    },
    {
      name: 'Shoreline',
      icon: '🏖️',
      color: '#06b6d4',
      image: null,
      description: 'Coastal resort area with spa and weather station',
      size: 'Large',
      players: '10-13 PMCs',
      width: 1200,
      height: 900,
    },
    {
      name: 'Interchange',
      icon: '🏢',
      color: '#8b5cf6',
      image: null,
      description: 'Shopping mall with underground parking',
      size: 'Large',
      players: '10-12 PMCs',
      width: 1200,
      height: 900,
    },
    {
      name: 'Reserve',
      icon: '🏰',
      color: '#f59e0b',
      image: null,
      description: 'Military base with underground bunker system',
      size: 'Large',
      players: '9-11 PMCs',
      width: 1200,
      height: 900,
    },
    {
      name: 'Factory',
      icon: '🏭',
      color: '#ef4444',
      image: null,
      description: 'Close quarters factory complex',
      size: 'Small',
      players: '4-6 PMCs',
      width: 1000,
      height: 700,
    },
    {
      name: 'Labs',
      icon: '🔬',
      color: '#ec4899',
      image: null,
      description: 'Underground research facility (requires keycard)',
      size: 'Medium',
      players: '6-10 PMCs',
      width: 1000,
      height: 700,
    },
    {
      name: 'Lighthouse',
      icon: '💡',
      color: '#eab308',
      image: null,
      description: 'Coastal area with water treatment plant',
      size: 'Large',
      players: '10-12 PMCs',
      width: 1200,
      height: 900,
    },
    {
      name: 'Streets of Tarkov',
      icon: '🌆',
      color: '#6366f1',
      image: null,
      description: 'Urban city streets with apartment buildings',
      size: 'Very Large',
      players: '12-15 PMCs',
      width: 1400,
      height: 1000,
    },
  ]

  const currentMap = maps.find((m) => m.name === selectedMap) || maps[0]

  // Get quests for selected map
  const mapQuests = quests.filter(
    (q) => q.map && (q.map === selectedMap || q.map === 'Any')
  )

  // Generate pseudo-random but consistent positions for quest markers
  const getQuestMarkerPosition = (questId, mapWidth, mapHeight) => {
    const seed = questId
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const x = ((seed * 7) % 80) + 10 // 10-90% of width
    const y = ((seed * 13) % 80) + 10 // 10-90% of height
    return { x: `${x}%`, y: `${y}%` }
  }

  // Filter quests by search
  const filteredQuests = mapQuests.filter((q) =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Reset view when map changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [selectedMap])

  // Zoom handlers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleResetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Pan handlers
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

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
          Interactive Maps
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '16px' }}>
          View maps and quest locations across Tarkov
        </p>
      </div>

      {/* Map Selection Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {maps.map((map) => {
          const questCount = quests.filter((q) => q.map === map.name).length
          const isSelected = selectedMap === map.name

          return (
            <div
              key={map.name}
              onClick={() => setSelectedMap(map.name)}
              style={{
                padding: '16px',
                backgroundColor: isSelected ? '#1e3a8a' : '#1f2937',
                border: `2px solid ${isSelected ? map.color : '#374151'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = map.color
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
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {map.icon}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {map.name}
              </div>
              {questCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: map.color,
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '10px',
                  }}
                >
                  {questCount}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '24px',
        }}
      >
        {/* Map Display */}
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '20px',
            minHeight: '600px',
          }}
        >
          {/* Map Info Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #374151',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '28px' }}>{currentMap.icon}</span>
                {currentMap.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                {currentMap.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginBottom: '4px',
                }}
              >
                Size:{' '}
                <span style={{ color: currentMap.color, fontWeight: '600' }}>
                  {currentMap.size}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Players:{' '}
                <span style={{ color: currentMap.color, fontWeight: '600' }}>
                  {currentMap.players}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '12px',
            }}
          >
            {/* Toggle Quest Markers */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#374151',
                borderRadius: '8px',
                flex: 1,
              }}
            >
              <MapPin size={18} style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: '14px', color: '#d1d5db' }}>
                Quest Locations ({mapQuests.length})
              </span>
              <button
                onClick={() => setShowQuestMarkers(!showQuestMarkers)}
                style={{
                  marginLeft: 'auto',
                  padding: '4px 10px',
                  backgroundColor: showQuestMarkers ? '#3b82f6' : '#4b5563',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Eye size={14} />
                {showQuestMarkers ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Zoom Controls */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                backgroundColor: '#374151',
                borderRadius: '8px',
                padding: '6px',
              }}
            >
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                style={{
                  padding: '8px',
                  backgroundColor: scale <= 0.5 ? '#1f2937' : '#4b5563',
                  color: scale <= 0.5 ? '#6b7280' : 'white',
                  borderRadius: '6px',
                  cursor: scale <= 0.5 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <ZoomOut size={16} />
              </button>
              <div
                style={{
                  padding: '8px 12px',
                  color: '#d1d5db',
                  fontSize: '14px',
                  fontWeight: '600',
                  minWidth: '60px',
                  textAlign: 'center',
                }}
              >
                {Math.round(scale * 100)}%
              </div>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 3}
                style={{
                  padding: '8px',
                  backgroundColor: scale >= 3 ? '#1f2937' : '#4b5563',
                  color: scale >= 3 ? '#6b7280' : 'white',
                  borderRadius: '6px',
                  cursor: scale >= 3 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleResetView}
                style={{
                  padding: '8px',
                  backgroundColor: '#4b5563',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Reset View"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Interactive Map Viewer */}
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '600px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              border: '2px solid #374151',
              position: 'relative',
              overflow: 'hidden',
              cursor:
                scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Map Image with Transform */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Map Image or Placeholder */}
              {currentMap.image ? (
                <img
                  src={currentMap.image}
                  alt={currentMap.name}
                  onError={(e) => {
                    console.log('Image failed to load:', currentMap.image)
                    e.target.style.display = 'none'
                    const fallback = document.getElementById(
                      `fallback-${currentMap.name}`
                    )
                    if (fallback) fallback.style.display = 'block'
                  }}
                  style={{
                    width: `${currentMap.width}px`,
                    height: `${currentMap.height}px`,
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    borderRadius: '4px',
                    objectFit: 'contain',
                    backgroundColor: '#1a1a2e',
                  }}
                />
              ) : null}

              {/* Map placeholder - always visible when no image */}
              <div
                id={`fallback-${currentMap.name}`}
                style={{
                  display: 'block',
                  width: `${currentMap.width}px`,
                  height: `${currentMap.height}px`,
                  backgroundColor: '#1a1a2e',
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(59, 130, 246, 0.1) 50px, rgba(59, 130, 246, 0.1) 51px),
                    repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(59, 130, 246, 0.1) 50px, rgba(59, 130, 246, 0.1) 51px)
                  `,
                  position: 'relative',
                  borderRadius: '4px',
                  border: '2px solid #374151',
                }}
              >
                {/* Center Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      fontSize: '64px',
                      marginBottom: '16px',
                      opacity: 0.4,
                    }}
                  >
                    {currentMap.icon}
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: currentMap.color,
                      marginBottom: '8px',
                    }}
                  >
                    {currentMap.name}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginTop: '8px',
                    }}
                  >
                    Interactive map placeholder
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '8px',
                    }}
                  >
                    Add map image URL to display actual map
                  </div>
                </div>
              </div>

              {/* Container for quest markers - positioned over the map */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${currentMap.width}px`,
                  height: `${currentMap.height}px`,
                  pointerEvents: 'none',
                }}
              >
                {/* Quest Markers */}
                {showQuestMarkers &&
                  mapQuests.map((quest) => {
                    const pos = getQuestMarkerPosition(
                      quest.id,
                      currentMap.width,
                      currentMap.height
                    )
                    const statusColors = {
                      completed: '#86efac',
                      'in-progress': '#93c5fd',
                      available: '#fbbf24',
                    }
                    const color = statusColors[quest.status] || '#9ca3af'

                    return (
                      <div
                        key={quest.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigateToQuest(quest)
                        }}
                        onMouseEnter={() => setHoveredQuest(quest.id)}
                        onMouseLeave={() => setHoveredQuest(null)}
                        style={{
                          position: 'absolute',
                          left: pos.x,
                          top: pos.y,
                          transform: 'translate(-50%, -100%)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          zIndex: hoveredQuest === quest.id ? 100 : 10,
                          pointerEvents: 'auto',
                        }}
                      >
                        {/* Marker Pin */}
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: color,
                            borderRadius: '50% 50% 50% 0',
                            transform: 'rotate(-45deg)',
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation:
                              hoveredQuest === quest.id
                                ? 'bounce 0.5s ease'
                                : 'none',
                          }}
                        >
                          <Target
                            size={14}
                            style={{
                              transform: 'rotate(45deg)',
                              color: '#1f2937',
                            }}
                          />
                        </div>

                        {/* Tooltip on Hover */}
                        {hoveredQuest === quest.id && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '40px',
                              left: '50%',
                              transform: 'translateX(-50%) scale(1)',
                              backgroundColor: '#1f2937',
                              border: `2px solid ${color}`,
                              borderRadius: '8px',
                              padding: '8px 12px',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                              pointerEvents: 'none',
                              zIndex: 1000,
                            }}
                          >
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'white',
                                marginBottom: '2px',
                              }}
                            >
                              {quest.name}
                            </div>
                            <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                              {quest.trader} • Level {quest.level}
                            </div>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '-6px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 0,
                                height: 0,
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: `6px solid ${color}`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Instruction Overlay */}
            {scale === 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(31, 41, 55, 0.9)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#9ca3af',
                  pointerEvents: 'none',
                }}
              >
                Use zoom controls or scroll to zoom • Click and drag to pan when
                zoomed
              </div>
            )}
          </div>

          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>

        {/* Quest List Sidebar */}
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '20px',
            maxHeight: '800px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Target size={20} style={{ color: '#3b82f6' }} />
            Quests on {selectedMap}
          </h3>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
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
              placeholder="Search quests..."
              style={{
                width: '100%',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
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

          {/* Quest Count */}
          <div
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid #374151',
            }}
          >
            Showing {filteredQuests.length} of {mapQuests.length} quests
          </div>

          {/* Quest List */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {filteredQuests.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: '#6b7280',
                }}
              >
                <MapPin
                  size={48}
                  style={{ margin: '0 auto 16px', opacity: 0.3 }}
                />
                <p>No quests found</p>
              </div>
            ) : (
              filteredQuests.map((quest) => {
                const statusColors = {
                  completed: {
                    bg: '#14532d',
                    text: '#86efac',
                    border: '#86efac',
                  },
                  'in-progress': {
                    bg: '#1e3a8a',
                    text: '#93c5fd',
                    border: '#93c5fd',
                  },
                  available: {
                    bg: '#713f12',
                    text: '#fbbf24',
                    border: '#fbbf24',
                  },
                }
                const colors =
                  statusColors[quest.status] || statusColors.available

                return (
                  <div
                    key={quest.id}
                    onClick={() => onNavigateToQuest(quest)}
                    onMouseEnter={() => setHoveredQuest(quest.id)}
                    onMouseLeave={() => setHoveredQuest(null)}
                    style={{
                      padding: '12px',
                      backgroundColor:
                        hoveredQuest === quest.id ? '#4b5563' : '#374151',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderLeft: `3px solid ${colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {quest.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginBottom: '6px',
                      }}
                    >
                      {quest.trader} • Level {quest.level}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        display: 'inline-block',
                        fontWeight: '600',
                      }}
                    >
                      {quest.status === 'in-progress'
                        ? 'In Progress'
                        : quest.status === 'completed'
                        ? 'Completed'
                        : 'Available'}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Maps
