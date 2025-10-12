import React from 'react'
import { Home, Map, CheckSquare, Target, Package } from 'lucide-react'

const Sidebar = ({
  activeSection,
  setActiveSection,
  isOpen,
  toggleSidebar,
}) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'maps', icon: Map, label: 'Maps' },
    { id: 'quests', icon: CheckSquare, label: 'Quests' },
    { id: 'ballistics', icon: Target, label: 'Ballistics' },
    { id: 'items', icon: Package, label: 'Items' },
  ]

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: isOpen ? '256px' : '0',
          backgroundColor: '#1f2937',
          borderRight: '1px solid #374151',
          transition: 'all 0.3s',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid #374151' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
            Tarkov Hub
          </h1>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            All-in-one companion
          </p>
        </div>

        <nav
          style={{
            flex: 1,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={isActive ? 'active' : ''}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  fontWeight: '500',
                  fontSize: '15px',
                  color: isActive ? 'white' : '#d1d5db',
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #374151',
            fontSize: '12px',
            color: '#9ca3af',
          }}
        >
          <div
            style={{ marginBottom: '4px', fontWeight: '500', color: '#d1d5db' }}
          >
            Level 25 PMC
          </div>
          <div>12 Quests Active</div>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
          }}
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}

export default Sidebar
