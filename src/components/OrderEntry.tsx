import { useState, useCallback, useMemo } from 'react'
import { Minus, Plus } from 'lucide-react'

export default function OrderEntry() {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [lotSize, setLotSize] = useState(0.01)
  const [limitPrice, setLimitPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')

  // Calculate margin and risk percentage based on lot size
  const marginInfo = useMemo(() => {
    const riskPercentage = (lotSize / 1) * 100 // 1 lot = 100%
    const marginValue = lotSize * 1000 // Each 0.1 lot = $100

    // Determine color based on risk level
    let color = 'bg-green-500'
    if (riskPercentage > 80) {
      color = 'bg-red-500'
    } else if (riskPercentage > 50) {
      color = 'bg-yellow-500'
    }

    return {
      percentage: Math.min(riskPercentage, 100),
      margin: marginValue,
      color
    }
  }, [lotSize])

  const handleLotSizeChange = useCallback((direction: 'increase' | 'decrease') => {
    setLotSize(prev => {
      const step = prev < 0.1 ? 0.01 : 0.1
      const newValue = direction === 'increase' ? prev + step : prev - step
      // Ensure value stays between 0.01 and reasonable maximum
      return Math.max(0.01, Math.min(100, Number(newValue.toFixed(2))))
    })
  }, [])

  // Format currency with commas and 2 decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
      {/* Market/Limit Selection */}
      <div className="grid grid-cols-2 gap-2">
        <button
          className={`py-2 px-4 rounded-lg border-2 font-semibold transition-colors ${
            orderType === 'market'
              ? 'bg-blue-500 border-blue-600 text-white'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setOrderType('market')}
        >
          MARKET
        </button>
        <button
          className={`py-2 px-4 rounded-lg border-2 font-semibold transition-colors ${
            orderType === 'limit'
              ? 'bg-blue-500 border-blue-600 text-white'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setOrderType('limit')}
        >
          LIMIT
        </button>
      </div>

      {/* Buy/Sell Selection */}
      <div className="grid grid-cols-2 gap-2">
        <button
          className={`py-2 px-4 rounded-lg border-2 font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-green-500 border-green-600 text-white'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setSide('buy')}
        >
          BUY
        </button>
        <button
          className={`py-2 px-4 rounded-lg border-2 font-semibold transition-colors ${
            side === 'sell'
              ? 'bg-red-500 border-red-600 text-white'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setSide('sell')}
        >
          SELL
        </button>
      </div>

      {/* Limit Price Input */}
      {orderType === 'limit' && (
        <div className="relative">
          <input
            type="text"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full p-2 border-2 rounded-lg bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            placeholder="0.00"
          />
          <div className="absolute -top-2 left-4 px-1 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            PRICE
          </div>
        </div>
      )}

      {/* Lot Size Control */}
      <div className="relative">
        <div className="flex items-center border-2 rounded-lg border-gray-300 dark:border-gray-600">
          <button
            onClick={() => handleLotSizeChange('decrease')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
          >
            <Minus size={18} />
          </button>
          <input
            type="text"
            value={lotSize}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value) && value >= 0.01) {
                setLotSize(Number(value.toFixed(2)))
              }
            }}
            className="flex-1 text-center bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
          />
          <button
            onClick={() => handleLotSizeChange('increase')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="absolute -top-2 left-4 px-1 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
          LOTSIZE
        </div>
      </div>

      {/* Stop Loss and Take Profit */}
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-2 relative">
          <input
            type="text"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full p-2 border-2 rounded-lg bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            placeholder="0.00"
          />
          <div className="absolute -top-2 left-4 px-1 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            STOPLOSS
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div className="col-span-2 relative">
          <input
            type="text"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="w-full p-2 border-2 rounded-lg bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            placeholder="0.00"
          />
          <div className="absolute -top-2 left-4 px-1 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            TAKEPROFIT
          </div>
        </div>
      </div>

      {/* Margin Risk Indicator */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${marginInfo.color}`}
            style={{ width: `${marginInfo.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Margin: {formatCurrency(marginInfo.margin)}</span>
          <span>{marginInfo.percentage.toFixed(1)}%</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
          side === 'buy'
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {side.toUpperCase()}
      </button>
    </div>
  )
} 