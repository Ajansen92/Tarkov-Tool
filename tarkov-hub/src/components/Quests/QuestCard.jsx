import React from 'react'
import { ChevronRight } from 'lucide-react'

const QuestCard = ({ quest, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return { bg: '#1e3a8a', text: '#93c5fd' }
      case 'completed':
        return { bg: '#14532d', text: '#86efac' }
      default:
        return { bg: '#374151', text: '#d1d5db' }
    }
  }

  const statusColors = getStatusColor(quest.status)

  return (
    <div
      onClick={() => onClick(quest)}
      style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #374151',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#4b5563'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#374151'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
              {quest.name}
            </h3>
            <span
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: statusColors.bg,
                color: statusColors.text,
                fontWeight: '500',
              }}
            >
              {quest.status === 'in-progress'
                ? 'In Progress'
                : quest.status === 'completed'
                ? 'Completed'
                : 'Available'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              fontSize: '14px',
              color: '#9ca3af',
              flexWrap: 'wrap',
            }}
          >
            <span>{quest.trader}</span>
            <span>•</span>
            <span>Level {quest.level}</span>
            <span>•</span>
            <span>{quest.map}</span>
          </div>

          {quest.requiredItems && quest.requiredItems.length > 0 && (
            <div
              style={{ marginTop: '12px', fontSize: '13px', color: '#d1d5db' }}
            >
              <span style={{ color: '#9ca3af' }}>Items needed: </span>
              {quest.requiredItems.map((item, i) => (
                <span key={i}>
                  {item.name}
                  {item.count && ` (${item.found || 0}/${item.count})`}
                  {i < quest.requiredItems.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}
        </div>

        <ChevronRight size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
      </div>
    </div>
  )
}

export default QuestCard
