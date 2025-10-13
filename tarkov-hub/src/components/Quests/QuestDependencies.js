import React from 'react'
import { ChevronRight } from 'lucide-react'

const QuestDependencies = ({ quest, allQuests, onQuestClick }) => {
  // Find quests that this quest requires (prerequisites)
  const prerequisites =
    quest.dependencies
      ?.map((depId) => allQuests.find((q) => q.id === depId))
      .filter(Boolean) || []

  // Find quests that require this quest (unlocks)
  const unlocks = allQuests.filter((q) => q.dependencies?.includes(quest.id))

  if (prerequisites.length === 0 && unlocks.length === 0) {
    return null
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3
        style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '12px',
        }}
      >
        Quest Chain
      </h3>

      {prerequisites.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}
          >
            Prerequisites (complete these first):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {prerequisites.map((preReq) => (
              <div
                key={preReq.id}
                onClick={() => onQuestClick(preReq)}
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
                    {preReq.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginTop: '4px',
                    }}
                  >
                    {preReq.trader} • Level {preReq.level}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#9ca3af' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {unlocks.length > 0 && (
        <div>
          <div
            style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}
          >
            Unlocks these quests:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unlocks.map((unlock) => (
              <div
                key={unlock.id}
                onClick={() => onQuestClick(unlock)}
                style={{
                  padding: '12px',
                  backgroundColor: '#1e3a8a',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#1e40af')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#1e3a8a')
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
                    {unlock.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#93c5fd',
                      marginTop: '4px',
                    }}
                  >
                    {unlock.trader} • Level {unlock.level}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#93c5fd' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestDependencies
