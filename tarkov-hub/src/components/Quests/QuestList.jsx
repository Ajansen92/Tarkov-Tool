import React, { useState } from 'react'
import { useQuests } from '../../hooks/useQuests'
import QuestFilters from './QuestFilters'
import QuestCard from './QuestCard'
import QuestDetails from './QuestDetails'

const QuestList = () => {
  const { quests, setQuests, loading, error } = useQuests()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTrader, setSelectedTrader] = useState('All Traders')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedQuest, setSelectedQuest] = useState(null)

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch = quest.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesTrader =
      selectedTrader === 'All Traders' || quest.trader === selectedTrader
    const matchesStatus =
      selectedStatus === 'All Status' ||
      (selectedStatus === 'In Progress' && quest.status === 'in-progress') ||
      (selectedStatus === 'Available' && quest.status === 'available') ||
      (selectedStatus === 'Completed' && quest.status === 'completed')

    return matchesSearch && matchesTrader && matchesStatus
  })

  const handleQuestClick = (quest) => {
    setSelectedQuest(quest)
  }

  const handleUpdateQuest = (updatedQuest) => {
    const updatedQuests = quests.map((q) =>
      q.id === updatedQuest.id ? updatedQuest : q
    )
    setQuests(updatedQuests)
    setSelectedQuest(updatedQuest)
  }

  const handleCloseDetails = () => {
    setSelectedQuest(null)
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: '5px solid #374151',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ marginTop: '16px', color: '#9ca3af' }}>
          Loading quests from Tarkov API...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <div
          style={{
            backgroundColor: '#7f1d1d',
            border: '1px solid #991b1b',
            borderRadius: '8px',
            padding: '16px',
            color: '#fecaca',
          }}
        >
          <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Error loading quests
          </h3>
          <p>{error.message}</p>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>
            Using cached quest data if available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: 'white',
          }}
        >
          Quest Tracker
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Track your progress through Tarkov's quests ({quests.length} total)
        </p>
      </div>

      <QuestFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTrader={selectedTrader}
        setSelectedTrader={setSelectedTrader}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Showing {filteredQuests.length} of {quests.length} quests
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingBottom: '40px',
        }}
      >
        {filteredQuests.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px',
              color: '#6b7280',
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              border: '1px solid #374151',
            }}
          >
            <p style={{ fontSize: '16px' }}>No quests found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={handleQuestClick}
            />
          ))
        )}
      </div>

      {selectedQuest && (
        <QuestDetails
          quest={selectedQuest}
          onClose={handleCloseDetails}
          onUpdateQuest={handleUpdateQuest}
        />
      )}
    </div>
  )
}

export default QuestList
