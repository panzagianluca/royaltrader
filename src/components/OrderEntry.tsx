import { useState, useMemo, useCallback } from 'react'
import { Minus, Plus, Check } from 'lucide-react'
import * as Progress from '@radix-ui/react-progress'
import * as Label from '@radix-ui/react-label'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Button, SegmentedControl } from '@radix-ui/themes'
import { cn } from '@/lib/utils'

export default function OrderEntry() {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [lots, setLots] = useState(0.1)
  const [limitPrice, setLimitPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [isStopLossEnabled, setIsStopLossEnabled] = useState(false)
  const [isTakeProfitEnabled, setIsTakeProfitEnabled] = useState(false)
  const [currentPrice] = useState('1.0850')
  const [balance] = useState(100000)
  const [stopLossDistance, setStopLossDistance] = useState('0')
  const [stopLossPnL, setStopLossPnL] = useState('')
  const [stopLossPnLPercentage, setStopLossPnLPercentage] = useState('')
  const [takeProfitDistance, setTakeProfitDistance] = useState('0')
  const [takeProfitPnL, setTakeProfitPnL] = useState('')
  const [takeProfitPnLPercentage, setTakeProfitPnLPercentage] = useState('')

  const marginInfo = useMemo(() => {
    const riskPercentage = (lots / 1) * 100
    const marginValue = lots * 1000

    let color = 'bg-green-500'
    if (riskPercentage >= 100) {
      color = 'bg-red-500'
    } else if (riskPercentage > 80) {
      color = 'bg-yellow-500'
    }

    return {
      percentage: riskPercentage,
      margin: marginValue,
      color,
      isHigh: riskPercentage >= 100
    }
  }, [lots])

  const handleLotSizeChange = useCallback((direction: 'increase' | 'decrease') => {
    setLots(prev => {
      const step = prev < 0.1 ? 0.01 : 0.1
      const newValue = direction === 'increase' ? prev + step : prev - step
      return Math.max(0.01, Math.min(100, Number(newValue.toFixed(2))))
    })
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const calculateMetrics = useCallback((price: string) => {
    if (!price || !currentPrice) return { distance: 0, pnl: 0, pnlPercentage: 0 }
    
    const priceNum = parseFloat(price)
    const currentPriceNum = parseFloat(currentPrice)
    const distance = Math.abs(priceNum - currentPriceNum)
    const pnl = distance * lots * 1000
    const pnlPercentage = (pnl / balance) * 100
    
    return {
      distance: distance.toFixed(4),
      pnl: formatCurrency(pnl),
      pnlPercentage: pnlPercentage.toFixed(2)
    }
  }, [currentPrice, lots, balance])

  return (
    <div className="p-4 space-y-4 bg-background rounded-md h-full text-sm">
      {/* Order Type Selector */}
      <div className="w-full">
        <SegmentedControl.Root 
          value={orderType}
          onValueChange={(value: string) => setOrderType(value as 'market' | 'limit')}
          size="3"
          className="w-full [&>button]:flex-1"
        >
          <SegmentedControl.Item value="market">MARKET</SegmentedControl.Item>
          <SegmentedControl.Item value="limit">LIMIT</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      {/* Buy/Sell Selector */}
      <div className="w-full">
        <SegmentedControl.Root 
          value={side}
          onValueChange={(value: string) => setSide(value as 'buy' | 'sell')}
          size="3"
          className="w-full [&>button]:flex-1 [&>button]:transition-colors [&>button]:duration-200"
        >
          <SegmentedControl.Item 
            value="buy"
            className="[&[data-state=active]]:bg-[#22c55e] [&[data-state=active]]:text-white [&[data-state=inactive]]:bg-[#dcfce7] [&[data-state=inactive]]:text-[#166534]"
          >
            BUY
          </SegmentedControl.Item>
          <SegmentedControl.Item 
            value="sell"
            className="[&[data-state=active]]:bg-[#ef4444] [&[data-state=active]]:text-white [&[data-state=inactive]]:bg-[#fee2e2] [&[data-state=inactive]]:text-[#991b1b]"
          >
            SELL
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      {/* Limit Price Input */}
      {orderType === 'limit' && (
        <div className="relative">
          <Label.Root htmlFor="limit-price" className="absolute -top-2 left-4 px-1 text-xs text-muted-foreground bg-background">
            PRICE
          </Label.Root>
          <div className="flex items-center border-2 rounded-lg border-gray-300 dark:border-gray-600">
            <button
              onClick={() => {
                const currentValue = parseFloat(limitPrice) || 0
                setLimitPrice((currentValue - 0.0001).toFixed(4))
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
            >
              <Minus size={18} />
            </button>
            <input
              id="limit-price"
              type="text"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="flex-1 text-center bg-transparent border-none focus:outline-none"
              placeholder="0.0000"
            />
            <button
              onClick={() => {
                const currentValue = parseFloat(limitPrice) || 0
                setLimitPrice((currentValue + 0.0001).toFixed(4))
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Lot Size Control */}
      <div className="relative">
        <Label.Root htmlFor="lot-size" className="absolute -top-2 left-4 px-1 text-xs text-muted-foreground bg-background">
          LOTSIZE
        </Label.Root>
        <div className="flex items-center border-2 rounded-lg border-gray-300 dark:border-gray-600">
          <button
            onClick={() => handleLotSizeChange('decrease')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
          >
            <Minus size={18} />
          </button>
          <input
            id="lot-size"
            type="text"
            value={lots}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value) && value >= 0.01) {
                setLots(Number(value.toFixed(2)))
              }
            }}
            className="flex-1 text-center bg-transparent border-none focus:outline-none"
          />
          <button
            onClick={() => handleLotSizeChange('increase')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Stop Loss and Take Profit - Three Column Layout */}
      <div className="grid grid-cols-[2fr,1fr,2fr] gap-4">
        {/* Column 1 - Stop Loss */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 h-8">
            <Checkbox.Root
              checked={isStopLossEnabled}
              onCheckedChange={(checked: boolean | 'indeterminate') => setIsStopLossEnabled(checked === true)}
              className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            >
              <Checkbox.Indicator>
                <Check className="h-3 w-3 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label.Root className="text-sm font-medium">
              Stop Loss
            </Label.Root>
          </div>
          <div className={cn("space-y-2", !isStopLossEnabled && "opacity-50")}>
            <div className="flex items-center border-2 rounded-lg border-gray-300 dark:border-gray-600 h-8">
              <button
                onClick={() => {
                  if (!isStopLossEnabled) return;
                  const currentValue = parseFloat(stopLoss) || 0
                  setStopLoss((currentValue - 0.0001).toFixed(4))
                }}
                className={cn(
                  "flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg shrink-0",
                  !isStopLossEnabled && "cursor-not-allowed"
                )}
              >
                <Minus size={14} />
              </button>
              <input
                type="text"
                value={stopLoss}
                onChange={(e) => isStopLossEnabled && setStopLoss(e.target.value)}
                className="flex-1 text-center bg-transparent border-none focus:outline-none h-full px-2 min-w-0 w-full"
                placeholder="0.0000"
                disabled={!isStopLossEnabled}
              />
              <button
                onClick={() => {
                  if (!isStopLossEnabled) return;
                  const currentValue = parseFloat(stopLoss) || 0
                  setStopLoss((currentValue + 0.0001).toFixed(4))
                }}
                className={cn(
                  "flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg shrink-0",
                  !isStopLossEnabled && "cursor-not-allowed"
                )}
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              <input
                type="text"
                value={stopLossDistance}
                onChange={(e) => isStopLossEnabled && setStopLossDistance(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="0"
                disabled={!isStopLossEnabled}
              />
            </div>
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              <input
                type="text"
                value={stopLossPnL}
                onChange={(e) => isStopLossEnabled && setStopLossPnL(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder={String(calculateMetrics(stopLoss).pnl)}
                disabled={!isStopLossEnabled}
              />
            </div>
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              <input
                type="text"
                value={stopLossPnLPercentage}
                onChange={(e) => isStopLossEnabled && setStopLossPnLPercentage(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder={`${String(calculateMetrics(stopLoss).pnlPercentage)}%`}
                disabled={!isStopLossEnabled}
              />
            </div>
          </div>
        </div>

        {/* Column 2 - Center Column */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="h-8" /> {/* Empty first row */}
          <div className="h-8 flex items-center justify-center font-medium">
            Price
          </div>
          <div className="h-8 flex items-center justify-center">
            Distance
          </div>
          <div className="h-8 flex items-center justify-center">
            PnL
          </div>
          <div className="h-8 flex items-center justify-center">
            PnL%
          </div>
        </div>

        {/* Column 3 - Take Profit */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 h-8">
            <Checkbox.Root
              checked={isTakeProfitEnabled}
              onCheckedChange={(checked: boolean | 'indeterminate') => setIsTakeProfitEnabled(checked === true)}
              className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            >
              <Checkbox.Indicator>
                <Check className="h-3 w-3 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label.Root className="text-sm font-medium">
              Take Profit
            </Label.Root>
          </div>
          <div className={cn("space-y-2", !isTakeProfitEnabled && "opacity-50")}>
            <div className="flex items-center border-2 rounded-lg border-gray-300 dark:border-gray-600 h-8">
              <button
                onClick={() => {
                  if (!isTakeProfitEnabled) return;
                  const currentValue = parseFloat(takeProfit) || 0
                  setTakeProfit((currentValue - 0.0001).toFixed(4))
                }}
                className={cn(
                  "flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg shrink-0",
                  !isTakeProfitEnabled && "cursor-not-allowed"
                )}
              >
                <Minus size={14} />
              </button>
              <input
                type="text"
                value={takeProfit}
                onChange={(e) => isTakeProfitEnabled && setTakeProfit(e.target.value)}
                className="flex-1 text-center bg-transparent border-none focus:outline-none h-full px-2 min-w-0 w-full"
                placeholder="0.0000"
                disabled={!isTakeProfitEnabled}
              />
              <button
                onClick={() => {
                  if (!isTakeProfitEnabled) return;
                  const currentValue = parseFloat(takeProfit) || 0
                  setTakeProfit((currentValue + 0.0001).toFixed(4))
                }}
                className={cn(
                  "flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg shrink-0",
                  !isTakeProfitEnabled && "cursor-not-allowed"
                )}
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              <div className="text-xs text-muted-foreground h-8 flex items-center">
                <input
                  type="text"
                  value={takeProfitDistance}
                  onChange={(e) => isTakeProfitEnabled && setTakeProfitDistance(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="0"
                  disabled={!isTakeProfitEnabled}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              <input
                type="text"
                value={takeProfitPnL}
                onChange={(e) => isTakeProfitEnabled && setTakeProfitPnL(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder={String(calculateMetrics(takeProfit).pnl)}
                disabled={!isTakeProfitEnabled}
              />
            </div>
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              <input
                type="text"
                value={takeProfitPnLPercentage}
                onChange={(e) => isTakeProfitEnabled && setTakeProfitPnLPercentage(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder={`${String(calculateMetrics(takeProfit).pnlPercentage)}%`}
                disabled={!isTakeProfitEnabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Margin Risk Indicator */}
      <div className="space-y-2">
        <Progress.Root 
          className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          value={Math.min(marginInfo.percentage, 100)}
        >
          <Progress.Indicator 
            className={cn("h-full transition-all duration-300", marginInfo.color)}
            style={{ width: `${Math.min(marginInfo.percentage, 100)}%` }}
          />
        </Progress.Root>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Margin: ${marginInfo.margin.toFixed(2)}</span>
          <span>{marginInfo.percentage.toFixed(0)}%</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          size="3"
          className={cn(
            "w-full transition-colors duration-200",
            side === 'buy' 
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          {side.toUpperCase()}
        </Button>
      </div>
    </div>
  )
}
