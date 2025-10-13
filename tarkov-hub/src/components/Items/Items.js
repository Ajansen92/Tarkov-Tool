import React, { useState, useMemo, useEffect } from 'react'
import {
  Package,
  Search,
  X,
  Filter,
  Grid,
  List,
  TrendingUp,
  DollarSign,
  Weight,
} from 'lucide-react'

const Items = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedItem, setSelectedItem] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch items from Tarkov API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('https://api.tarkov.dev/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                items {
                  id
                  name
                  shortName
                  description
                  weight
                  width
                  height
                  basePrice
                  avg24hPrice
                  sellFor {
                    vendor {
                      name
                    }
                    price
                  }
                  types
                }
              }
            `,
          }),
        })

        const data = await response.json()

        if (data.errors) {
          throw new Error(data.errors[0].message)
        }

        // Transform API data to our format
        const transformedItems = data.data.items.map((item) => {
          // Get trader sell price (max trader price)
          const traderPrices =
            item.sellFor
              ?.filter((sell) => sell.vendor.name !== 'Flea Market')
              .map((sell) => sell.price) || []
          const maxTraderPrice =
            traderPrices.length > 0
              ? Math.max(...traderPrices)
              : item.basePrice || 0

          // Determine category from types
          const types = item.types || []
          let category = 'Barter Items'

          if (types.includes('gun')) category = 'Weapons'
          else if (types.includes('ammo')) category = 'Ammunition'
          else if (types.includes('armor')) category = 'Armor'
          else if (types.includes('rig')) category = 'Rigs'
          else if (types.includes('backpack')) category = 'Backpacks'
          else if (types.includes('meds')) category = 'Medical'
          else if (types.includes('food') || types.includes('drink'))
            category = 'Food & Drink'
          else if (types.includes('keys')) category = 'Keys'
          else if (types.includes('container')) category = 'Containers'
          else if (types.includes('preset')) category = 'Presets'
          else if (types.includes('wearable')) category = 'Wearables'

          // Determine rarity based on price
          let rarity = 'common'
          const price = item.avg24hPrice || item.basePrice || 0
          if (price > 500000) rarity = 'legendary'
          else if (price > 100000) rarity = 'rare'
          else if (price > 30000) rarity = 'uncommon'

          // Get icon emoji based on category
          const getIcon = (cat) => {
            const iconMap = {
              Weapons: '🔫',
              Ammunition: '💣',
              Armor: '🛡️',
              Rigs: '🎽',
              Backpacks: '🎒',
              Medical: '🏥',
              'Food & Drink': '🍱',
              Keys: '🔑',
              Containers: '📦',
              'Barter Items': '💎',
              Presets: '⚙️',
              Wearables: '👕',
            }
            return iconMap[cat] || '📦'
          }

          return {
            id: item.id,
            name: item.name,
            shortName: item.shortName,
            category: category,
            icon: getIcon(category),
            price: item.avg24hPrice || item.basePrice || 0,
            weight: item.weight || 0,
            size: `${item.width}x${item.height}`,
            description: item.description || 'No description available.',
            sellPrice: item.avg24hPrice || item.basePrice || 0,
            traderPrice: maxTraderPrice,
            rarity: rarity,
          }
        })

        setItems(transformedItems)
      } catch (err) {
        setError(err)
        console.error('Failed to load items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Item categories - dynamically generated from items
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(items.map((item) => item.category))]
    return cats.sort()
  }, [items])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let compareA, compareB

      switch (sortBy) {
        case 'name':
          compareA = a.name.toLowerCase()
          compareB = b.name.toLowerCase()
          break
        case 'price':
          compareA = a.price
          compareB = b.price
          break
        case 'weight':
          compareA = a.weight
          compareB = b.weight
          break
        default:
          return 0
      }

      if (typeof compareA === 'string') {
        if (sortOrder === 'asc') {
          return compareA.localeCompare(compareB)
        } else {
          return compareB.localeCompare(compareA)
        }
      } else {
        if (sortOrder === 'asc') {
          return compareA - compareB
        } else {
          return compareB - compareA
        }
      }
    })

    return filtered
  }, [items, searchTerm, selectedCategory, sortBy, sortOrder])

  // Get rarity color
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return '#f59e0b'
      case 'rare':
        return '#8b5cf6'
      case 'uncommon':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
          }}
        >
          Items Database
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '16px' }}>
          Browse and search through Tarkov's item catalog
        </p>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          const itemCount =
            category === 'All'
              ? items.length
              : items.filter((i) => i.category === category).length

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                backgroundColor: isSelected ? '#3b82f6' : '#1f2937',
                border: `1px solid ${isSelected ? '#3b82f6' : '#374151'}`,
                borderRadius: '20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#374151'
              }}
            >
              {category}
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                }}
              >
                {itemCount}
              </span>
            </button>
          )
        })}
      </div>

      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items..."
            style={{
              width: '100%',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '10px 12px 10px 40px',
              color: '#f3f4f6',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '4px',
                backgroundColor: 'transparent',
                color: '#9ca3af',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#f3f4f6',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="weight">Weight</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
              cursor: 'pointer',
            }}
          >
            <TrendingUp
              size={16}
              style={{
                transform:
                  sortOrder === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        </div>

        {/* View Toggle */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 12px',
              backgroundColor: viewMode === 'grid' ? '#3b82f6' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '6px 12px',
              backgroundColor: viewMode === 'list' ? '#3b82f6' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div
        style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginBottom: '16px',
        }}
      >
        Showing {filteredAndSortedItems.length} of {items.length} items
      </div>

      {/* Items Display */}
      {viewMode === 'grid' ? (
        // Grid View
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredAndSortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = getRarityColor(item.rarity)
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#374151'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Item Icon/Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '48px' }}>{item.icon}</div>
                <div
                  style={{
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getRarityColor(item.rarity),
                    color: 'white',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.rarity}
                </div>
              </div>

              {/* Item Name */}
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginBottom: '12px',
                }}
              >
                {item.category}
              </div>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #374151',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginBottom: '4px',
                    }}
                  >
                    Price
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#22c55e',
                    }}
                  >
                    ₽{item.price.toLocaleString()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginBottom: '4px',
                    }}
                  >
                    Weight
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#d1d5db',
                    }}
                  >
                    {item.weight} kg
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginBottom: '4px',
                    }}
                  >
                    Size
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#d1d5db',
                    }}
                  >
                    {item.size}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                  lineHeight: '1.4',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {filteredAndSortedItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 1fr',
                gap: '16px',
                padding: '16px 20px',
                alignItems: 'center',
                borderBottom:
                  index < filteredAndSortedItems.length - 1
                    ? '1px solid #374151'
                    : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#374151')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <div style={{ fontSize: '32px' }}>{item.icon}</div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '2px',
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {item.category}
                </div>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: getRarityColor(item.rarity),
                  color: 'white',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {item.rarity}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#22c55e',
                }}
              >
                ₽{item.price.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                {item.weight} kg
              </div>
              <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                {item.size}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '24px',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: `2px solid ${getRarityColor(selectedItem.rarity)}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #374151',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
              >
                <div style={{ fontSize: '64px' }}>{selectedItem.icon}</div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {selectedItem.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                    {selectedItem.shortName} • {selectedItem.category}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  padding: '8px',
                  backgroundColor: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Description */}
              <div
                style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                }}
              >
                {selectedItem.description}
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Flea Market Price
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#22c55e',
                    }}
                  >
                    ₽{selectedItem.sellPrice.toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Trader Price
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                    }}
                  >
                    ₽{selectedItem.traderPrice.toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Weight
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#d1d5db',
                    }}
                  >
                    {selectedItem.weight} kg
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Size
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#d1d5db',
                    }}
                  >
                    {selectedItem.size}
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              {(selectedItem.uses ||
                selectedItem.energy ||
                selectedItem.hydration ||
                selectedItem.duration) && (
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '12px',
                    }}
                  >
                    Additional Properties
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px',
                    }}
                  >
                    {selectedItem.uses && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          Uses:{' '}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#3b82f6',
                          }}
                        >
                          {selectedItem.uses}
                        </span>
                      </div>
                    )}
                    {selectedItem.energy && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          Energy:{' '}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#22c55e',
                          }}
                        >
                          +{selectedItem.energy}
                        </span>
                      </div>
                    )}
                    {selectedItem.hydration && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          Hydration:{' '}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#06b6d4',
                          }}
                        >
                          +{selectedItem.hydration}
                        </span>
                      </div>
                    )}
                    {selectedItem.duration && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          Duration:{' '}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#8b5cf6',
                          }}
                        >
                          {selectedItem.duration}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rarity Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: getRarityColor(selectedItem.rarity),
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}
              >
                {selectedItem.rarity} Item
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Items
