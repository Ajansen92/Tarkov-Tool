import React from 'react'
import { X, CheckCircle, Circle, Package, StickyNote } from 'lucide-react'
import QuestDependencies from './QuestDependencies'

const QuestDetails = ({
  quest,
  onClose,
  onUpdateQuest,
  allQuests,
  onNavigateToQuest,
}) => {
  if (!quest) return null

  const handleStatusChange = (newStatus) => {
    onUpdateQuest({ ...quest, status: newStatus })
  }

  const handleNotesChange = (newNotes) => {
    onUpdateQuest({ ...quest, notes: newNotes })
  }

  const handleItemFound = (itemIndex, increment) => {
    const updatedQuest = { ...quest }
    const item = updatedQuest.requiredItems[itemIndex]

    if (item.count) {
      const newFound = Math.max(
        0,
        Math.min(item.count, (item.found || 0) + increment)
      )
      updatedQuest.requiredItems[itemIndex] = { ...item, found: newFound }
    } else {
      updatedQuest.requiredItems[itemIndex] = { ...item, found: !item.found }
    }

    onUpdateQuest(updatedQuest)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return '#3b82f6'
      case 'completed':
        return '#22c55e'
      default:
        return '#6b7280'
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#1f2937',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #374151',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid #374151',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                {quest.name}
              </h2>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  color: '#9ca3af',
                  fontSize: '14px',
                }}
              >
                <span>{quest.trader}</span>
                <span>•</span>
                <span>Level {quest.level}</span>
                <span>•</span>
                <span>{quest.map}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#9ca3af',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#374151'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#9ca3af'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Status */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#d1d5db',
                  marginBottom: '8px',
                }}
              >
                Quest Status
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['available', 'in-progress', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border:
                        quest.status === status
                          ? `2px solid ${getStatusColor(status)}`
                          : '1px solid #374151',
                      backgroundColor:
                        quest.status === status
                          ? `${getStatusColor(status)}20`
                          : '#374151',
                      color:
                        quest.status === status
                          ? getStatusColor(status)
                          : '#9ca3af',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize',
                    }}
                  >
                    {status === 'in-progress' ? 'In Progress' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '12px',
                }}
              >
                Objectives
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {quest.objectives.map((objective, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#374151',
                      borderRadius: '8px',
                    }}
                  >
                    <CheckCircle
                      size={18}
                      style={{
                        color: '#3b82f6',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    />
                    <span style={{ color: '#d1d5db', fontSize: '14px' }}>
                      {objective}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quest Dependencies */}
            <QuestDependencies
              quest={quest}
              allQuests={allQuests}
              onQuestClick={onNavigateToQuest}
            />

            {/* Personal Notes */}
            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <StickyNote size={18} />
                Personal Notes
              </h3>
              <textarea
                value={quest.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add your notes here... (strategies, item locations, tips, etc.)"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#4b5563')}
              />
            </div>

            {/* Required Items */}
            {quest.requiredItems && quest.requiredItems.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Package size={18} />
                  Required Items
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {quest.requiredItems.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '16px',
                        backgroundColor: '#374151',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        {item.count ? (
                          <>
                            <span style={{ color: 'white', fontWeight: '500' }}>
                              {item.name}
                            </span>
                            <span
                              style={{
                                color:
                                  (item.found || 0) >= item.count
                                    ? '#22c55e'
                                    : '#9ca3af',
                                fontSize: '14px',
                              }}
                            >
                              {item.found || 0} / {item.count}
                            </span>
                          </>
                        ) : (
                          <>
                            {item.found ? (
                              <CheckCircle
                                size={20}
                                style={{ color: '#22c55e' }}
                              />
                            ) : (
                              <Circle size={20} style={{ color: '#6b7280' }} />
                            )}
                            <span style={{ color: 'white', fontWeight: '500' }}>
                              {item.name}
                            </span>
                          </>
                        )}
                      </div>

                      {item.count ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleItemFound(i, -1)}
                            disabled={(item.found || 0) === 0}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#1f2937',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              opacity: (item.found || 0) === 0 ? 0.3 : 1,
                              cursor:
                                (item.found || 0) === 0
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            −
                          </button>
                          <button
                            onClick={() => handleItemFound(i, 1)}
                            disabled={(item.found || 0) >= item.count}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              opacity:
                                (item.found || 0) >= item.count ? 0.3 : 1,
                              cursor:
                                (item.found || 0) >= item.count
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleItemFound(i, 0)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            backgroundColor: item.found ? '#dc2626' : '#22c55e',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500',
                          }}
                        >
                          {item.found ? 'Mark Not Found' : 'Mark Found'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            <div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '12px',
                }}
              >
                Rewards
              </h3>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#374151',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#9ca3af' }}>Experience</span>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>
                    +{quest.rewards.experience.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#9ca3af' }}>Reputation</span>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>
                    +{quest.rewards.reputation}
                  </span>
                </div>
                {quest.rewards.items && quest.rewards.items.length > 0 && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span style={{ color: '#9ca3af' }}>Items</span>
                    <span style={{ color: '#d1d5db', fontWeight: '500' }}>
                      {quest.rewards.items.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuestDetails
