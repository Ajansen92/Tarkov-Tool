import React from 'react'
import { ArrowUpDown } from 'lucide-react'

const QuestSort = ({ sortBy, setSortBy, sortOrder, setSortOrder }) => {
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'level', label: 'Level' },
    { value: 'trader', label: 'Trader' },
    { value: 'map', label: 'Map' },
    { value: 'status', label: 'Status' },
  ]

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={toggleSortOrder}
        style={{
          padding: '8px',
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          color: '#f3f4f6',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#374151')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#1f2937')
        }
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      >
        <ArrowUpDown
          size={16}
          style={{
            transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>
    </div>
  )
}

export default QuestSort
