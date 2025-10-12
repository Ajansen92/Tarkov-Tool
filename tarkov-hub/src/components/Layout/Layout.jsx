import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children, activeSection, setActiveSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#111827',
        color: '#f3f4f6',
      }}
    >
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s',
          marginLeft: sidebarOpen ? '256px' : '0',
        }}
      >
        <Header
          activeSection={activeSection}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            height: 'calc(100vh - 73px)', // Subtract header height
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
