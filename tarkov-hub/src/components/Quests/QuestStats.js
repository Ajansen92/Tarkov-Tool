import React from 'react'
import { TrendingUp, CheckCircle, Clock, Circle } from 'lucide-react'

const QuestStats = ({ quests }) => {
  // Calculate stats
  const totalQuests = quests.length
  const completedQuests = quests.filter((q) => q.status === 'completed').length
  const inProgressQuests = quests.filter(
    (q) => q.status === 'in-progress'
  ).length
  const availableQuests = quests.filter((q) => q.status === 'available').length
  const completionPercentage =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0

  // Calculate by trader
  const traderStats = {}
  const traders = [
    'Prapor',
    'Therapist',
    'Skier',
    'Peacekeeper',
    'Mechanic',
    'Ragman',
    'Jaeger',
  ]

  traders.forEach((trader) => {
    const traderQuests = quests.filter((q) => q.trader === trader)
    const completed = traderQuests.filter(
      (q) => q.status === 'completed'
    ).length
    traderStats[trader] = {
      total: traderQuests.length,
      completed: completed,
      percentage:
        traderQuests.length > 0
          ? Math.round((completed / traderQuests.length) * 100)
          : 0,
    }
  })

  return (
    <div
      style={{
        marginBottom: '24px',
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '12px',
        padding: '20px',
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
        <TrendingUp size={20} style={{ color: '#3b82f6' }} />
        Progress Overview
      </h3>

      {/* Overall Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            padding: '16px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}
          >
            {completionPercentage}%
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            Complete
          </div>
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle size={24} />
            {completedQuests}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            Completed
          </div>
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Clock size={24} />
            {inProgressQuests}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            In Progress
          </div>
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Circle size={24} />
            {availableQuests}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            Available
          </div>
        </div>
      </div>

      {/* Trader Progress */}
      <div>
        <h4
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#d1d5db',
            marginBottom: '12px',
          }}
        >
          Progress by Trader
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {traders.map((trader) => {
            const stats = traderStats[trader]
            if (stats.total === 0) return null

            return (
              <div
                key={trader}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    minWidth: '100px',
                    fontSize: '14px',
                    color: '#d1d5db',
                  }}
                >
                  {trader}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: '24px',
                    backgroundColor: '#374151',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${stats.percentage}%`,
                      backgroundColor:
                        stats.percentage === 100 ? '#22c55e' : '#3b82f6',
                      transition: 'width 0.3s ease',
                      borderRadius: '12px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {stats.completed}/{stats.total}
                  </div>
                </div>
                <div
                  style={{
                    minWidth: '45px',
                    fontSize: '14px',
                    color: '#9ca3af',
                    textAlign: 'right',
                  }}
                >
                  {stats.percentage}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuestStats
