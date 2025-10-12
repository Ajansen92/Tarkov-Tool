import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { fetchAllQuests } from '../utils/tarkovApi'
import { transformAllQuests } from '../utils/questTransformer'

export const useQuests = () => {
  const [savedQuests, setSavedQuests] = useLocalStorage('tarkov-quests', [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadQuests = async () => {
      if (savedQuests.length > 0) {
        console.log('Already have quests in localStorage:', savedQuests.length)
        // Log a few quests with items to verify
        const questsWithItems = savedQuests.filter(
          (q) => q.requiredItems && q.requiredItems.length > 0
        )
        console.log('Quests with required items:', questsWithItems.length)
        if (questsWithItems.length > 0) {
          console.log('Example quest with items:', questsWithItems[0])
        }
        return
      }

      console.log('Fetching quests from API...')
      setLoading(true)
      setError(null)

      try {
        const apiQuests = await fetchAllQuests()
        console.log('Received quests from API:', apiQuests.length)

        // Log first quest with items to see structure
        const questWithItems = apiQuests.find(
          (q) =>
            q.objectives &&
            q.objectives.some((obj) => obj.items && obj.items.length > 0)
        )
        if (questWithItems) {
          console.log('Example API quest with items:', questWithItems)
        }

        const transformedQuests = transformAllQuests(apiQuests)
        console.log('Transformed quests:', transformedQuests.length)

        const transformedWithItems = transformedQuests.filter(
          (q) => q.requiredItems && q.requiredItems.length > 0
        )
        console.log(
          'Transformed quests with items:',
          transformedWithItems.length
        )
        if (transformedWithItems.length > 0) {
          console.log(
            'Example transformed quest with items:',
            transformedWithItems[0]
          )
        }

        setSavedQuests(transformedQuests)
      } catch (err) {
        setError(err)
        console.error('Failed to load quests:', err)
      } finally {
        setLoading(false)
      }
    }

    loadQuests()
  }, [])

  const refreshQuests = async () => {
    setLoading(true)
    setError(null)

    try {
      const apiQuests = await fetchAllQuests()
      console.log('Refreshed - Received quests from API:', apiQuests.length)

      const transformedQuests = transformAllQuests(apiQuests)

      // Merge with existing progress
      const mergedQuests = transformedQuests.map((apiQuest) => {
        const savedQuest = savedQuests.find((sq) => sq.id === apiQuest.id)
        if (savedQuest) {
          return {
            ...apiQuest,
            status: savedQuest.status,
            requiredItems: apiQuest.requiredItems.map((item, idx) => ({
              ...item,
              found: savedQuest.requiredItems?.[idx]?.found || 0,
            })),
          }
        }
        return apiQuest
      })

      setSavedQuests(mergedQuests)
    } catch (err) {
      setError(err)
      console.error('Failed to refresh quests:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    quests: savedQuests,
    setQuests: setSavedQuests,
    loading,
    error,
    refreshQuests,
  }
}
