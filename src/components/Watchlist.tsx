import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

type MarketSymbol = {
  id: string
  symbol: string
  name: string
  category: 'forex' | 'indices' | 'crypto' | 'commodities'
  bid: number
  ask: number
  spread: number
  change: number
  isFavorite: boolean
}

export default function Watchlist() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'forex' | 'indices' | 'crypto' | 'commodities' | 'favorites'>('all')
  const [symbols, setSymbols] = useState<MarketSymbol[]>([])

  // Mock data - in a real app this would come from an API
  useEffect(() => {
    const mockSymbols: MarketSymbol[] = [
      // Forex
      { id: '1', symbol: 'EURUSD', name: 'Euro/US Dollar', category: 'forex', bid: 1.0854, ask: 1.0856, spread: 0.0002, change: 0.12, isFavorite: false },
      { id: '2', symbol: 'GBPUSD', name: 'British Pound/US Dollar', category: 'forex', bid: 1.2654, ask: 1.2657, spread: 0.0003, change: -0.24, isFavorite: true },
      { id: '3', symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', category: 'forex', bid: 151.34, ask: 151.37, spread: 0.03, change: 0.45, isFavorite: false },
      
      // Indices
      { id: '4', symbol: 'SPX', name: 'S&P 500', category: 'indices', bid: 5234.56, ask: 5234.78, spread: 0.22, change: 1.23, isFavorite: true },
      { id: '5', symbol: 'NDX', name: 'Nasdaq 100', category: 'indices', bid: 18234.67, ask: 18235.12, spread: 0.45, change: 2.34, isFavorite: false },
      { id: '6', symbol: 'DJI', name: 'Dow Jones', category: 'indices', bid: 39456.78, ask: 39457.23, spread: 0.45, change: -0.56, isFavorite: false },
      
      // Crypto
      { id: '7', symbol: 'BTCUSD', name: 'Bitcoin', category: 'crypto', bid: 68432.45, ask: 68435.67, spread: 3.22, change: 5.67, isFavorite: true },
      { id: '8', symbol: 'ETHUSD', name: 'Ethereum', category: 'crypto', bid: 3456.78, ask: 3457.12, spread: 0.34, change: 3.45, isFavorite: false },
      
      // Commodities
      { id: '9', symbol: 'XAUUSD', name: 'Gold', category: 'commodities', bid: 2345.67, ask: 2346.12, spread: 0.45, change: 0.78, isFavorite: false },
      { id: '10', symbol: 'XAGUSD', name: 'Silver', category: 'commodities', bid: 27.45, ask: 27.56, spread: 0.11, change: -0.23, isFavorite: false },
    ]
    setSymbols(mockSymbols)
  }, [])

  const toggleFavorite = (id: string) => {
    setSymbols(prev => prev.map(symbol => 
      symbol.id === id ? { ...symbol, isFavorite: !symbol.isFavorite } : symbol
    ))
  }

  const filteredSymbols = symbols.filter(symbol => {
    // Filter by search term
    const matchesSearch = symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by category
    const matchesCategory = activeCategory === 'all' || 
                          (activeCategory === 'favorites' ? symbol.isFavorite : symbol.category === activeCategory)
    
    return matchesSearch && matchesCategory
  })

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-3 border-b dark:border-gray-700">
        <h3 className="font-medium dark:text-white mb-2">Watchlist</h3>
        
        {/* Search Bar */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search symbols..."
            className="w-full p-2 pl-8 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-sm rounded ${activeCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeCategory === 'favorites' ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
            onClick={() => setActiveCategory('favorites')}
          >
            Favorites
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeCategory === 'forex' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
            onClick={() => setActiveCategory('forex')}
          >
            Forex
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeCategory === 'indices' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
            onClick={() => setActiveCategory('indices')}
          >
            Indices
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeCategory === 'crypto' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
            onClick={() => setActiveCategory('crypto')}
          >
            Crypto
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeCategory === 'commodities' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
            onClick={() => setActiveCategory('commodities')}
          >
            Commodities
          </button>
        </div>
      </div>
      
      {/* Symbols Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 z-10">
            <tr>
              <th className="p-2 text-left w-8"></th>
              <th className="p-2 text-left">Symbol</th>
              <th className="p-2 text-right">Bid</th>
              <th className="p-2 text-right">Ask</th>
              <th className="p-2 text-right">Spread</th>
              <th className="p-2 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {filteredSymbols.map((symbol) => (
              <tr 
                key={symbol.id} 
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <td className="p-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(symbol.id)
                    }}
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    <Star 
                      size={16} 
                      fill={symbol.isFavorite ? 'currentColor' : 'none'} 
                      className={symbol.isFavorite ? 'text-yellow-500' : ''}
                    />
                  </button>
                </td>
                <td className="p-2 dark:text-white">
                  <div className="font-medium">{symbol.symbol}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{symbol.name}</div>
                </td>
                <td className="p-2 text-right dark:text-white">{formatNumber(symbol.bid, symbol.category === 'forex' ? 4 : 2)}</td>
                <td className="p-2 text-right dark:text-white">{formatNumber(symbol.ask, symbol.category === 'forex' ? 4 : 2)}</td>
                <td className="p-2 text-right dark:text-white">{formatNumber(symbol.spread, symbol.category === 'forex' ? 4 : 2)}</td>
                <td className={`p-2 text-right ${getChangeColor(symbol.change)}`}>
                  {symbol.change > 0 ? '+' : ''}{formatNumber(symbol.change)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
