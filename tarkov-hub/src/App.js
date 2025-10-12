import React, { useState } from 'react'
import Layout from './components/Layout/Layout'
import QuestList from './components/Quests/QuestList'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('quests')

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Dashboard - Coming Soon
            </h2>
          </div>
        )
      case 'maps':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Maps - Coming Soon
            </h2>
          </div>
        )
      case 'quests':
        return <QuestList />
      case 'ballistics':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Ballistics - Coming Soon
            </h2>
          </div>
        )
      case 'items':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Items - Coming Soon
            </h2>
          </div>
        )
      default:
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h2>
          </div>
        )
    }
  }

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </Layout>
  )
}

export default App
