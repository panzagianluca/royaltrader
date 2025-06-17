import { Search, Star } from 'lucide-react'
import { useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ScrollArea } from './ui/scroll-area'
import { useTradingStore } from '@/store/trading'

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

  const prices = useTradingStore((s) => s.prices)
  const dayOpens = useTradingStore((s) => s.dayOpens)

  const [instruments, setInstruments] = useState(sampleInstruments)

  // Augment instruments with live price & change
  const liveInstruments = instruments.map((inst) => {
    const livePrice = prices[inst.symbol] ?? inst.price
    const open = dayOpens[inst.symbol] ?? inst.price
    const changePct = ((livePrice - open) / open) * 100
    return { ...inst, price: livePrice, change: changePct }
  })

  const filteredInstruments = liveInstruments.filter(instrument => {
    const matchesSearch = instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = watchlistFilter === 'all' || 
                         (watchlistFilter === 'favorites' && instrument.isFavorite) ||
                         instrument.category === watchlistFilter
    return matchesSearch && matchesFilter
  })

  const toggleFavorite = (symbol: string) => {
    setInstruments(instruments.map(instrument => 
      instrument.symbol === symbol 
        ? { ...instrument, isFavorite: !instrument.isFavorite }
        : instrument
    ))
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-md text-sm">
      <div className="p-4">
        <div className="flex gap-2">
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
              <thead className="sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                  <th className="p-2 w-8"></th>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstruments.map((instrument) => (
                  <tr
                    key={instrument.symbol}
                    className="text-sm hover:bg-background-alpha cursor-pointer"
                    onClick={() => useTradingStore.getState().setChartSymbol(`FX:${instrument.symbol}`)}
                  >
                    <td className="p-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(instrument.symbol)
                        }}
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
