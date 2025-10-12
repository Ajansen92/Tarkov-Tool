const TARKOV_API_URL = 'https://api.tarkov.dev/graphql'

const QUESTS_QUERY = `
  query {
    tasks {
      id
      name
      trader {
        name
      }
      minPlayerLevel
      map {
        name
      }
      objectives {
        id
        type
        description
        optional
        ... on TaskObjectiveItem {
          items {
            name
          }
          count
        }
      }
      experience
      finishRewards {
        traderStanding {
          trader {
            name
          }
          standing
        }
        items {
          item {
            name
          }
          count
        }
      }
      taskRequirements {
        task {
          id
          name
        }
      }
    }
  }
`

export const fetchAllQuests = async () => {
  try {
    const response = await fetch(TARKOV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUESTS_QUERY,
      }),
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    return data.data.tasks
  } catch (error) {
    console.error('Error fetching quests:', error)
    throw error
  }
}
