// Transform API data to our app's format
export const transformQuestData = (apiQuest) => {
  return {
    id: apiQuest.id,
    name: apiQuest.name,
    trader: apiQuest.trader?.name || 'Unknown',
    level: apiQuest.minPlayerLevel || 1,
    map: apiQuest.map?.name || 'Any',
    objectives: apiQuest.objectives?.map((obj) => obj.description) || [],
    rewards: {
      experience: apiQuest.experience || 0,
      reputation: apiQuest.finishRewards?.traderStanding?.[0]?.standing || 0,
      items: apiQuest.finishRewards?.items?.map((item) => item.item.name) || [],
    },
    requiredItems: extractRequiredItems(apiQuest.objectives),
    status: 'available',
    dependencies: apiQuest.taskRequirements?.map((req) => req.task.id) || [],
    notes: '',
  }
}

// Extract required items from objectives
const extractRequiredItems = (objectives) => {
  if (!objectives) return []

  const items = []

  objectives.forEach((obj) => {
    // Check if this is an item objective
    if (
      obj.__typename === 'TaskObjectiveItem' &&
      obj.items &&
      obj.items.length > 0
    ) {
      obj.items.forEach((item) => {
        items.push({
          name: item.name,
          count: obj.count || 1,
          found: 0,
        })
      })
    } else if (
      obj.type === 'giveItem' ||
      obj.type === 'findItem' ||
      obj.type === 'pickUp'
    ) {
      // Fallback: try to extract item names from description
      // This is a backup for when __typename isn't available
      if (obj.items && obj.items.length > 0) {
        obj.items.forEach((item) => {
          items.push({
            name: item.name || 'Unknown Item',
            count: obj.count || 1,
            found: 0,
          })
        })
      }
    }
  })

  return items
}

// Transform all quests
export const transformAllQuests = (apiQuests) => {
  return apiQuests.map(transformQuestData)
}
