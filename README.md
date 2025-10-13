# Tarkov Hub

A comprehensive companion app for Escape from Tarkov players. Track quests, view maps, compare ammunition, browse items, and manage your progression.

![Tarkov Hub](https://img.shields.io/badge/React-18.x-blue)
![Status](https://img.shields.io/badge/status-active-success)

## 🎮 Features

### Dashboard

- **Progress Overview** - Track overall quest completion percentage
- **Active Quests** - View currently in-progress quests
- **Quest Notes** - See quests with personal notes
- **Quick Navigation** - Jump to any section instantly

### Quest Tracker

- **Complete Quest Database** - All Tarkov quests from the official API
- **Progress Tracking** - Mark quests as available, in-progress, or completed
- **Quest Dependencies** - View prerequisite and unlocked quests
- **Personal Notes** - Add notes to any quest
- **Item Tracking** - Track required items for quest completion
- **Advanced Filtering** - Filter by trader, status, level, and map
- **Multiple Sort Options** - Sort by name, level, trader, map, or status
- **Progress Statistics** - View completion stats by trader

### Interactive Maps

- **All 9 Tarkov Maps** - Customs, Woods, Shoreline, Interchange, Reserve, Factory, Labs, Lighthouse, Streets
- **Zoom & Pan Controls** - Interactive map navigation (50%-300% zoom)
- **Quest Markers** - See all quest locations on each map
- **Hover Tooltips** - View quest details on marker hover
- **Click-through Navigation** - Click markers to view quest details
- **Toggle Markers** - Show/hide quest locations

### Ballistics Chart

- **8 Calibers** - 5.56x45mm, 7.62x39mm, 5.45x39mm, 7.62x51mm, 9x19mm, 12 Gauge, .45 ACP, 9x39mm
- **40+ Ammo Types** - Complete ammunition database with real stats
- **Penetration Analysis** - Color-coded armor class effectiveness
- **Damage Comparison** - Visual bars for quick comparison
- **Price Analysis** - Compare cost per round
- **Multiple Sort Options** - Sort by penetration, damage, armor damage, frag chance, velocity, or price
- **Search Functionality** - Find specific ammo types

### Items Database

- **1000+ Items** - Complete Tarkov item catalog from API
- **Live Pricing** - Real-time flea market prices
- **Category Filtering** - Browse by Weapons, Ammo, Armor, Medical, Food, Keys, Barter Items, and more
- **Search Function** - Find any item instantly
- **Grid & List Views** - Toggle between display modes
- **Item Details** - Click for full stats including weight, size, prices, and special properties
- **Rarity System** - Color-coded item rarity (Common, Uncommon, Rare, Legendary)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tarkov-hub.git
cd tarkov-hub
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **Lucide React** - Icon library
- **Tarkov.dev API** - Real-time game data
- **GraphQL** - API queries
- **localStorage** - Local data persistence

## 📁 Project Structure

```
tarkov-hub/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.js
│   │   │   ├── Header.js
│   │   │   └── Layout.js
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js
│   │   ├── Quests/
│   │   │   ├── QuestList.js
│   │   │   ├── QuestCard.js
│   │   │   ├── QuestFilters.js
│   │   │   ├── QuestDetails.js
│   │   │   ├── QuestDependencies.js
│   │   │   ├── QuestStats.js
│   │   │   └── QuestSort.js
│   │   ├── Maps/
│   │   │   └── Maps.js
│   │   ├── Ballistics/
│   │   │   └── Ballistics.js
│   │   ├── Items/
│   │   │   └── Items.js
│   │   └── Common/
│   │       └── SearchBar.js
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useQuests.js
│   ├── utils/
│   │   ├── tarkovApi.js
│   │   └── questTransformer.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .gitignore
├── package.json
└── README.md
```

## 🔄 Data Sources

- **Quest Data**: [Tarkov.dev GraphQL API](https://api.tarkov.dev/graphql)
- **Item Data**: [Tarkov.dev GraphQL API](https://api.tarkov.dev/graphql)

All data is fetched in real-time from the official Tarkov API.

## 💾 Local Storage

The app stores the following data locally:

- Quest progress and status
- Quest notes
- Item tracking progress

Data persists across sessions and browser refreshes.

## 🎯 Future Features

- [ ] Hideout tracker with upgrade requirements
- [ ] Weapon build calculator
- [ ] Trader loyalty level tracking
- [ ] Flea market price alerts
- [ ] Ammo effectiveness calculator
- [ ] Loot location markers on maps
- [ ] Extraction point information
- [ ] Mobile responsive design improvements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Tarkov.dev](https://tarkov.dev/) for providing the excellent API
- [Battlestate Games](https://www.escapefromtarkov.com/) for Escape from Tarkov
- All contributors and testers

## 📧 Contact

Project Link: [https://github.com/yourusername/tarkov-hub](https://github.com/yourusername/tarkov-hub)

---

**Note**: This is a fan-made tool and is not affiliated with Battlestate Games.
