<<<<<<< HEAD
import { Search, Star } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

interface Instrument {
  symbol: string
  price: number
  change: number
  category: 'forex' | 'commodities' | 'indices' | 'crypto'
  isFavorite: boolean
}

const sampleInstruments: Instrument[] = [
  // Forex Pairs
  { symbol: 'EURUSD', price: 1.2345, change: 0.12, category: 'forex', isFavorite: true },
  { symbol: 'GBPUSD', price: 1.3456, change: -0.25, category: 'forex', isFavorite: false },
  { symbol: 'USDJPY', price: 150.123, change: 0.15, category: 'forex', isFavorite: true },
  { symbol: 'AUDUSD', price: 0.6789, change: -0.18, category: 'forex', isFavorite: false },
  { symbol: 'USDCAD', price: 1.3456, change: 0.22, category: 'forex', isFavorite: true },
  { symbol: 'NZDUSD', price: 0.6123, change: -0.10, category: 'forex', isFavorite: false },
  { symbol: 'EURGBP', price: 0.8567, change: 0.08, category: 'forex', isFavorite: true },
  { symbol: 'USDCHF', price: 0.9012, change: -0.15, category: 'forex', isFavorite: false },
  // Commodities
  { symbol: 'XAUUSD', price: 1987.50, change: 0.26, category: 'commodities', isFavorite: false },
  { symbol: 'USOIL', price: 75.45, change: -0.85, category: 'commodities', isFavorite: true },
  // Indices
  { symbol: 'SPX500', price: 4500.25, change: 0.28, category: 'indices', isFavorite: false },
  { symbol: 'NAS100', price: 15200.75, change: 0.30, category: 'indices', isFavorite: true },
  // Crypto
  { symbol: 'BTCUSD', price: 42000.00, change: 0.60, category: 'crypto', isFavorite: true },
  { symbol: 'ETHUSD', price: 2200.00, change: -0.68, category: 'crypto', isFavorite: false },
]

export default function Watchlist() {
  const [searchQuery, setSearchQuery] = useState('')
  const [watchlistFilter, setWatchlistFilter] = useState('all')
  const [instruments, setInstruments] = useState(sampleInstruments)

  const toggleFavorite = (symbol: string) => {
    setInstruments(instruments.map(instrument => 
      instrument.symbol === symbol 
        ? { ...instrument, isFavorite: !instrument.isFavorite }
        : instrument
    ))
  }

  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch = instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = watchlistFilter === 'all' || 
                         (watchlistFilter === 'favorites' && instrument.isFavorite) ||
                         instrument.category === watchlistFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Watchlists</h2>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search instruments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={watchlistFilter} onValueChange={setWatchlistFilter}>
            <SelectTrigger className="w-[120px] [&[data-state=open]]:bg-background-alpha/60 hover:bg-background-alpha/60 backdrop-blur-sm transition-colors border border-background-alpha">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-background-primary/60 backdrop-blur-md border border-background-alpha">
              <SelectItem value="all" className="hover:bg-background-alpha/60 backdrop-blur-sm cursor-pointer">All</SelectItem>
              <SelectItem value="favorites" className="hover:bg-background-alpha/60 backdrop-blur-sm cursor-pointer">Favorites</SelectItem>
              <SelectItem value="forex" className="hover:bg-background-alpha/60 backdrop-blur-sm cursor-pointer">Forex</SelectItem>
              <SelectItem value="commodities" className="hover:bg-background-alpha/60 backdrop-blur-sm cursor-pointer">Commodities</SelectItem>
              <SelectItem value="indices" className="hover:bg-background-alpha/60 backdrop-blur-sm cursor-pointer">Indices</SelectItem>
              <SelectItem value="crypto" className="hover:bg-background-alpha/60 backdrop-blur-sm cursor-pointer">Crypto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pr-4">
            <table className="w-full">
              <thead className="sticky top-0 bg-background-primary z-10">
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                  <th className="p-2 w-8"></th>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstruments.map((instrument) => (
                  <tr key={instrument.symbol} className="text-sm hover:bg-background-alpha">
                    <td className="p-2">
                      <button 
                        onClick={() => toggleFavorite(instrument.symbol)}
                        className={`p-1 rounded transition-colors ${instrument.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      >
                        <Star size={16} className={instrument.isFavorite ? 'fill-current' : ''} />
                      </button>
                    </td>
                    <td className="p-2">{instrument.symbol}</td>
                    <td className="p-2">{instrument.price.toFixed(4)}</td>
                    <td className={`p-2 ${instrument.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {instrument.change >= 0 ? '+' : ''}{instrument.change.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 
=======
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
>>>>>>> c254e8cf48d387eb4c76990f33465727455194c6
