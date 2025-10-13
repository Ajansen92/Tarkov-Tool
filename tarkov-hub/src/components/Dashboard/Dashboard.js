import React from 'react'
import {
  TrendingUp,
  Map,
  CheckSquare,
  Target,
  Package,
  StickyNote,
  ChevronRight,
  Award,
} from 'lucide-react'

const Dashboard = ({ quests, onNavigateToSection, onNavigateToQuest }) => {
  // Calculate stats
  const totalQuests = quests.length
  const completedQuests = quests.filter((q) => q.status === 'completed').length
  const inProgressQuests = quests.filter(
    (q) => q.status === 'in-progress'
  ).length
  const completionPercentage =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0

  // Get recent in-progress quests
  const recentQuests = quests
    .filter((q) => q.status === 'in-progress')
    .slice(0, 5)

  // Get quests with notes
  const questsWithNotes = quests
    .filter((q) => q.notes && q.notes.trim())
    .slice(0, 5)

  // Maps data
  const maps = [
    { name: 'Customs', icon: '🏭', color: '#3b82f6' },
    { name: 'Woods', icon: '🌲', color: '#22c55e' },
    { name: 'Shoreline', icon: '🏖️', color: '#06b6d4' },
    { name: 'Interchange', icon: '🏢', color: '#8b5cf6' },
    { name: 'Reserve', icon: '🏰', color: '#f59e0b' },
    { name: 'Labs', icon: '🔬', color: '#ef4444' },
    { name: 'Lighthouse', icon: '💡', color: '#eab308' },
    { name: 'Streets', icon: '🌆', color: '#6366f1' },
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
          }}
        >
          Welcome back, PMC
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '16px' }}>
          Here's your Tarkov progress overview
        </p>
      </div>

      {/* Main Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Completion Card */}
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#374151')}
          onClick={() => onNavigateToSection('quests')}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <Award size={24} style={{ color: '#22c55e' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
              Overall Progress
            </h3>
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#22c55e',
              marginBottom: '8px',
            }}
          >
            {completionPercentage}%
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            {completedQuests} of {totalQuests} quests completed
          </div>
        </div>

        {/* In Progress Card */}
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#374151')}
          onClick={() => onNavigateToSection('quests')}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <TrendingUp size={24} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
              Active Quests
            </h3>
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '8px',
            }}
          >
            {inProgressQuests}
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            Currently in progress
          </div>
        </div>

        {/* Notes Card */}
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fbbf24')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#374151')}
          onClick={() => onNavigateToSection('quests')}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <StickyNote size={24} style={{ color: '#fbbf24' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
              Quest Notes
            </h3>
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '8px',
            }}
          >
            {questsWithNotes.length}
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            Quests with notes
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Recent Quests */}
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckSquare size={20} style={{ color: '#3b82f6' }} />
              Active Quests
            </h3>
            <button
              onClick={() => onNavigateToSection('quests')}
              style={{
                fontSize: '14px',
                color: '#3b82f6',
                background: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#374151')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              View All →
            </button>
          </div>

          {recentQuests.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: '#6b7280',
              }}
            >
              <CheckSquare
                size={48}
                style={{ margin: '0 auto 16px', opacity: 0.3 }}
              />
              <p>No active quests</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Start some quests to see them here
              </p>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {recentQuests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => onNavigateToQuest(quest)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#4b5563')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#374151')
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'white',
                      }}
                    >
                      {quest.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginTop: '4px',
                      }}
                    >
                      {quest.trader} • Level {quest.level}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: '#9ca3af' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quests with Notes */}
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <StickyNote size={20} style={{ color: '#fbbf24' }} />
              Quest Notes
            </h3>
            <button
              onClick={() => onNavigateToSection('quests')}
              style={{
                fontSize: '14px',
                color: '#3b82f6',
                background: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#374151')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              View All →
            </button>
          </div>

          {questsWithNotes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: '#6b7280',
              }}
            >
              <StickyNote
                size={48}
                style={{ margin: '0 auto 16px', opacity: 0.3 }}
              />
              <p>No quest notes yet</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Add notes to quests to see them here
              </p>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {questsWithNotes.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => onNavigateToQuest(quest)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#4b5563')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#374151')
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
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
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {quest.notes}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      style={{ color: '#9ca3af', flexShrink: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Maps */}
      <div
        style={{
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Map size={20} style={{ color: '#3b82f6' }} />
            Quick Map Access
          </h3>
          <button
            onClick={() => onNavigateToSection('maps')}
            style={{
              fontSize: '14px',
              color: '#3b82f6',
              background: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#374151')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            View All →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
          }}
        >
          {maps.map((map) => (
            <div
              key={map.name}
              onClick={() => onNavigateToSection('maps')}
              style={{
                padding: '16px',
                backgroundColor: '#374151',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#374151'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {map.icon}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {map.name}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: map.color,
                  fontWeight: '600',
                }}
              >
                COMING SOON
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
