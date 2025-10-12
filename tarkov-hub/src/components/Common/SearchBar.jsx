import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <Search
        size={18}
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '10px 12px 10px 40px',
          color: '#f3f4f6',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.target.style.borderColor = '#374151')}
      />
    </div>
  )
}

export default SearchBar
