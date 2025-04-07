import { createContext, useContext, useState, ReactNode } from 'react'

interface TradingContextType {
  symbol: string
  setSymbol: (symbol: string) => void
}

const TradingContext = createContext<TradingContextType | undefined>(undefined)

export function TradingProvider({ children }: { children: ReactNode }) {
  const [symbol, setSymbol] = useState('BTCUSDT')

  return (
    <TradingContext.Provider value={{ symbol, setSymbol }}>
      {children}
    </TradingContext.Provider>
  )
}

export function useTrading() {
  const context = useContext(TradingContext)
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider')
  }
  return context
} 