import React from 'react'
import SearchBar from '../Common/SearchBar'
import { traders, statuses } from '../../data/quests'

const QuestFilters = ({
  searchTerm,
  setSearchTerm,
  selectedTrader,
  setSelectedTrader,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}
    >
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search quests..."
      />

      <select
        value={selectedTrader}
        onChange={(e) => setSelectedTrader(e.target.value)}
        style={{
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '10px 16px',
          color: '#f3f4f6',
          fontSize: '14px',
          outline: 'none',
          cursor: 'pointer',
          minWidth: '150px',
        }}
      >
        {traders.map((trader) => (
          <option key={trader} value={trader}>
            {trader}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        style={{
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '10px 16px',
          color: '#f3f4f6',
          fontSize: '14px',
          outline: 'none',
          cursor: 'pointer',
          minWidth: '150px',
        }}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  )
}

export default QuestFilters
