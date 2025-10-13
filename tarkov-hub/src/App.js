import React, { useState } from 'react'
import Layout from './components/Layout/Layout'
import QuestList from './components/Quests/QuestList'
import Dashboard from './components/Dashboard/Dashboard'
import Maps from './components/Maps/Maps'
import Ballistics from './components/Ballistics/Ballistics'
import Items from './components/Items/Items'
import { useQuests } from './hooks/useQuests'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedQuestForList, setSelectedQuestForList] = useState(null)
  const { quests } = useQuests()

  const handleNavigateToSection = (section) => {
    setActiveSection(section)
  }

  const handleNavigateToQuest = (quest) => {
    setSelectedQuestForList(quest)
    setActiveSection('quests')
  }

  const handleClearSelectedQuest = () => {
    setSelectedQuestForList(null)
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            quests={quests}
            onNavigateToSection={handleNavigateToSection}
            onNavigateToQuest={handleNavigateToQuest}
          />
        )
      case 'maps':
        return (
          <Maps quests={quests} onNavigateToQuest={handleNavigateToQuest} />
        )
      case 'quests':
        return (
          <QuestList
            initialSelectedQuest={selectedQuestForList}
            onClearSelectedQuest={handleClearSelectedQuest}
          />
        )
      case 'ballistics':
        return <Ballistics />
      case 'items':
        return <Items />
      default:
        return (
          <Dashboard
            quests={quests}
            onNavigateToSection={handleNavigateToSection}
            onNavigateToQuest={handleNavigateToQuest}
          />
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
