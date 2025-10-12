import { gql } from '@apollo/client'

export const GET_ALL_QUESTS = gql`
  query GetAllQuests {
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
        ... on TaskObjectiveShoot {
          target
          count
          shotType
        }
      }
      startRewards {
        traderStanding {
          trader {
            name
          }
          standing
        }
      }
      finishRewards {
        traderStanding {
          trader {
            name
          }
          standing
        }
        offerUnlock {
          item {
            name
          }
          level
        }
        items {
          item {
            name
          }
          count
        }
      }
      experience
      taskRequirements {
        task {
          id
          name
        }
      }
    }
  }
`
