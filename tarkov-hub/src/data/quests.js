export const quests = [
  {
    id: 1,
    name: 'Delivery from the Past',
    trader: 'Prapor',
    level: 5,
    map: 'Customs',
    objectives: [
      'Obtain the case in the dorms',
      'Hand over the case to Prapor',
    ],
    rewards: {
      experience: 8000,
      reputation: 0.05,
      items: ['M4A1'],
    },
    requiredItems: [{ name: 'Unknown key', found: false }],
    status: 'available', // available, in-progress, completed
  },
  {
    id: 2,
    name: 'Chemical - Part 1',
    trader: 'Skier',
    level: 10,
    map: 'Customs',
    objectives: [
      'Find 3 Chemical containers on Customs',
      'Hand over the containers to Skier',
    ],
    rewards: {
      experience: 5500,
      reputation: 0.03,
      items: [],
    },
    requiredItems: [{ name: 'Chemical container', count: 3, found: 0 }],
    status: 'in-progress',
  },
  {
    id: 3,
    name: 'Golden Swag',
    trader: 'Prapor',
    level: 15,
    map: 'Customs',
    objectives: [
      'Find 5 Gold chains',
      'Find 5 Rolex watches',
      'Hand over the items to Prapor',
    ],
    rewards: {
      experience: 12000,
      reputation: 0.08,
      items: [],
    },
    requiredItems: [
      { name: 'Gold chain', count: 5, found: 3 },
      { name: 'Rolex', count: 5, found: 1 },
    ],
    status: 'in-progress',
  },
  {
    id: 4,
    name: 'Stirrup',
    trader: 'Skier',
    level: 8,
    map: 'Any',
    objectives: ['Kill 3 PMCs with pistols'],
    rewards: {
      experience: 7000,
      reputation: 0.04,
      items: [],
    },
    requiredItems: [],
    status: 'available',
  },
]

export const traders = [
  'All Traders',
  'Prapor',
  'Therapist',
  'Skier',
  'Peacekeeper',
  'Mechanic',
  'Ragman',
  'Jaeger',
]

export const statuses = ['All Status', 'Available', 'In Progress', 'Completed']
