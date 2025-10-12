import React from 'react'
import { Menu, X } from 'lucide-react'

const Header = ({ activeSection, sidebarOpen, toggleSidebar }) => {
  return (
    <header
      style={{
        backgroundColor: '#1f2937',
        borderBottom: '1px solid #374151',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <button
        onClick={toggleSidebar}
        style={{
          padding: '8px',
          borderRadius: '8px',
          transition: 'all 0.2s',
        }}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'capitalize',
            color: 'white',
          }}
        >
          {activeSection}
        </h2>
        <div style={{ fontSize: '14px', color: '#9ca3af' }}>
          Wipe: December 2024
        </div>
      </div>
    </header>
  )
}

export default Header
