import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Position = {
  id: string
  symbol: string
  type?: "Buy" | "Sell"
  volume: number
  openPrice: number
  openTime: string
  sl?: number
  tp?: number
  commission?: number
  swap?: number
  pnl: number
  currentPrice?: number
}

export type Order = {
  id: string
  symbol: string
  volume: number
  type: string
  price: number
  time: string
  sl?: number
  tp?: number
  currentPrice?: number
  status?: "pending" | "triggered" | "cancelled"
}

export type HistoryEntry = {
  id: string
  symbol: string
  side: "Buy" | "Sell"
  volume: number
  openTime: string
  closeTime: string
  openPrice: number
  closePrice: number
  pnl: number
  commission?: number
  swap?: number
}

export type Alert = {
  id: string
  symbol: string
  alertPrice: number
  marketPrice: number
}

export const CONTRACT_SIZE = 100_000
export const LEVERAGE = 100 // 1:100 leverage

type TradingState = {
  prices: Record<string, number>
  dayOpens: Record<string, number>
  positions: Position[]
  orders: Order[]
  history: HistoryEntry[]
  chartSymbol: string
  setChartSymbol: (sym: string) => void
  balance: number
  equity: number
  marginUsed: number
  freeMargin: number
  updatePrice: (symbol: string, price: number) => void
  placeOrder: (order: Omit<Order, "id" | "time"> & { status?: "pending" | "triggered" | "cancelled" }) => void
  placeMarket: (side: "Buy" | "Sell", lots: number, symbol: string, price: number) => void
  closePosition: (id: string) => void
  cancelOrder: (id: string) => void
  cancelAllPending: () => void
  closeAllPositions: () => void
  closeProfitablePositions: () => void
  closeLosingPositions: () => void
  _closePositionsByFilter: (filterFn: (p: Position) => boolean) => void
  alerts: Alert[]
  addAlert: (symbol: string, alertPrice: number) => void
  removeAlert: (id: string) => void
  clearAlerts: () => void
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set) => ({
      prices: {
        EURUSD: 1.085,
        GBPJPY: 191.5,
      },
      dayOpens: {
        EURUSD: 1.085,
        GBPJPY: 191.5,
      },
      positions: [
        {
          id: "654321",
          symbol: "EURUSD",
          volume: 1,
          openPrice: 1.0850,
          openTime: new Date().toISOString(),
          pnl: 250,
        },
        {
          id: "654322",
          symbol: "GBPJPY",
          volume: 0.5,
          openPrice: 191.5,
          openTime: new Date().toISOString(),
          pnl: -150,
        },
      ],
      chartSymbol: "FX:EURUSD",
      setChartSymbol: (sym: string) => set({ chartSymbol: sym }),
      orders: [],
      history: [],
      alerts: [],
      balance: 100_000,
      equity: 100_000,
      marginUsed: 0,
      freeMargin: 100_000,
      updatePrice: (symbol: string, price: number) => {
        set((state: TradingState) => {
          // 1) Update positions' PnL
          const newPositions = state.positions.map((pos) => {
            if (pos.symbol !== symbol) return pos
            const pnl =
              (price - pos.openPrice) *
              pos.volume *
              CONTRACT_SIZE *
              (pos.type === "Sell" ? -1 : 1)
            return { ...pos, pnl, currentPrice: price }
          })

          // 2) Check pending orders for this symbol
          const triggeredOrders: Order[] = []

          const updatedOrders = state.orders.map((o) => {
            if (o.symbol !== symbol || o.status !== "pending") return o

            const isBuy = o.type.startsWith("Buy")
            const isLimit = o.type.includes("Limit")
            const isStop = o.type.includes("Stop")

            const shouldTrigger =
              (isBuy && isLimit && price <= o.price) ||
              (isBuy && isStop && price >= o.price) ||
              (!isBuy && isLimit && price >= o.price) ||
              (!isBuy && isStop && price <= o.price)

            if (shouldTrigger) {
              triggeredOrders.push(o)
              return { ...o, status: "triggered", executionPrice: price } as Order & { executionPrice: number }
            }

            return o
          })

          // 3) For each triggered order, open market position
          let finalPositions = newPositions
          let balance = state.balance
          let marginUsed = state.marginUsed

          triggeredOrders.forEach((ord) => {
            const side: "Buy" | "Sell" = ord.type.startsWith("Buy") ? "Buy" : "Sell"
            const lots = ord.volume
            const requiredMargin = (lots * CONTRACT_SIZE) / LEVERAGE
            const commission = 4 * lots

            // Margin check – skip if insufficient (should be rare)
            if (state.freeMargin < requiredMargin) {
              return
            }

            const position: Position = {
              id: Date.now().toString(),
              symbol: ord.symbol,
              type: side,
              volume: lots,
              openPrice: price,
              openTime: new Date().toISOString(),
              pnl: 0,
              commission,
              currentPrice: price,
            }

            finalPositions = [...finalPositions, position]
            balance -= commission
            marginUsed += requiredMargin

            // Toast (lazy import to avoid circular deps in SSR)
            import("@/components/ui/notifications").then(({ notifySuccess }) => {
              notifySuccess(`Order ${ord.id} triggered → ${side} ${lots} ${ord.symbol}`)
            })
          })

          // Remove triggered orders from the active list
          const remainingOrders = updatedOrders.filter((o) => o.status !== "triggered")

          // 4) Recalculate equity/freeMargin with updated positions
          const equity = balance + finalPositions.reduce((s, p) => s + p.pnl, 0)
          const freeMargin = equity - marginUsed

          const newPrices = { ...state.prices, [symbol]: price }

          let newDayOpens = state.dayOpens
          if (!(symbol in newDayOpens)) {
            newDayOpens = { ...newDayOpens, [symbol]: price }
          }

          // update alerts market price
          const updatedAlerts = state.alerts.map((a) => a.symbol === symbol ? { ...a, marketPrice: price } : a)

          return {
            prices: newPrices,
            dayOpens: newDayOpens,
            positions: finalPositions,
            orders: remainingOrders,
            balance,
            marginUsed,
            equity,
            freeMargin,
            alerts: updatedAlerts,
          }
        })
      },
      placeOrder: (orderInput: Omit<Order, "id" | "time"> & { status?: "pending" | "triggered" | "cancelled" }) => {
        const id = Date.now().toString()
        const time = new Date().toISOString()
        set((state) => ({ orders: [...state.orders, { id, time, status: "pending", ...orderInput }] }))
      },
      placeMarket: (side, lots, symbol, price) => {
        const requiredMargin = (lots * CONTRACT_SIZE) / LEVERAGE
        const commission = 4 * lots
        set((state: TradingState) => {
          if (state.freeMargin < requiredMargin) {
            return {}
          }
          const id = Date.now().toString()
          const position: Position = {
            id,
            symbol,
            type: side,
            volume: lots,
            openPrice: price,
            openTime: new Date().toISOString(),
            pnl: 0,
            commission,
            currentPrice: price,
          }
          const marginUsed = state.marginUsed + requiredMargin
          const balance = state.balance - commission
          return {
            positions: [...state.positions, position],
            marginUsed,
            balance,
          }
        })
      },
      closePosition: (id: string) => {
        set((state: TradingState) => {
          const pos = state.positions.find((p) => p.id === id)
          if (!pos) return {}
          const remaining = state.positions.filter((p) => p.id !== id)
          const requiredMargin = (pos.volume * CONTRACT_SIZE) / LEVERAGE
          const balance = state.balance + pos.pnl - (pos.commission ?? 0)
          const marginUsed = state.marginUsed - requiredMargin
          const equity = balance + remaining.reduce((s, p) => s + p.pnl, 0)
          const freeMargin = equity - marginUsed

          const historyEntry: HistoryEntry = {
            id: pos.id,
            symbol: pos.symbol,
            side: pos.type ?? "Buy",
            volume: pos.volume,
            openTime: pos.openTime,
            closeTime: new Date().toISOString(),
            openPrice: pos.openPrice,
            closePrice: pos.currentPrice ?? state.prices[pos.symbol] ?? pos.openPrice,
            pnl: pos.pnl,
            commission: pos.commission,
            swap: pos.swap,
          }

          return { positions: remaining, balance, marginUsed, equity, freeMargin, history: [...state.history, historyEntry] }
        })
      },
      cancelOrder: (id: string) => {
        set((state: TradingState) => ({
          orders: state.orders.filter((o) => o.id !== id || o.status !== "pending"),
        }))
      },
      cancelAllPending: () => {
        set((state: TradingState) => ({
          orders: state.orders.filter((o) => o.status !== "pending"),
        }))
      },
      closeAllPositions: () => {
        useTradingStore.getState()._closePositionsByFilter(() => true)
      },
      closeProfitablePositions: () => {
        useTradingStore.getState()._closePositionsByFilter((p) => p.pnl > 0)
      },
      closeLosingPositions: () => {
        useTradingStore.getState()._closePositionsByFilter((p) => p.pnl < 0)
      },
      _closePositionsByFilter: (filterFn: (p: Position) => boolean) => {
        set((state: TradingState) => {
          const toClose = state.positions.filter(filterFn)
          if (toClose.length === 0) return {}

          const remaining = state.positions.filter((p) => !filterFn(p))

          let balance = state.balance
          let marginUsed = state.marginUsed

          const historyEntries: HistoryEntry[] = toClose.map((pos) => {
            const requiredMargin = (pos.volume * CONTRACT_SIZE) / LEVERAGE
            balance += pos.pnl - (pos.commission ?? 0)
            marginUsed -= requiredMargin

            return {
              id: pos.id,
              symbol: pos.symbol,
              side: pos.type ?? "Buy",
              volume: pos.volume,
              openTime: pos.openTime,
              closeTime: new Date().toISOString(),
              openPrice: pos.openPrice,
              closePrice: pos.currentPrice ?? state.prices[pos.symbol] ?? pos.openPrice,
              pnl: pos.pnl,
              commission: pos.commission,
              swap: pos.swap,
            }
          })

          const equity = balance + remaining.reduce((s, p) => s + p.pnl, 0)
          const freeMargin = equity - marginUsed

          return {
            positions: remaining,
            history: [...state.history, ...historyEntries],
            balance,
            marginUsed,
            equity,
            freeMargin,
          }
        })
      },
      addAlert: (symbol: string, alertPrice: number) => {
        const id = Date.now().toString()
        set((state: TradingState) => ({
          alerts: [...state.alerts, { id, symbol, alertPrice, marketPrice: state.prices[symbol] ?? alertPrice }],
        }))
      },
      removeAlert: (id: string) => {
        set((state: TradingState) => ({ alerts: state.alerts.filter((a) => a.id !== id) }))
      },
      clearAlerts: () => {
        set({ alerts: [] })
      },
    }),
    { name: "trading-store", version: 2, migrate: (state) => {
        if (state) {
          // ensure no default orders linger
          return { ...state, orders: [] }
        }
        return state as any
      } }
  )
)

/* price simulator for demo */
if (typeof window !== "undefined") {
  setInterval(() => {
    const { prices, updatePrice, chartSymbol } = useTradingStore.getState()
    Object.entries(prices).forEach(([symbol, price]) => {
      const jitter = (Math.random() - 0.5) * 0.0002
      updatePrice(symbol, Number((price + jitter).toFixed(5)))
    })
  }, 1000)
} 