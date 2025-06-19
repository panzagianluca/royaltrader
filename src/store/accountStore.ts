import { create } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { accountsData as demoAccounts } from "../data/accounts"
import { useTradingStore, CONTRACT_SIZE } from "./trading"

/******************************
 * Domain Types
 ******************************/
export interface Account {
  id: string
  name: string
  currency: string
  createdAt: string
  balance?: number
  equity?: number
  dailyPnl?: number
  dailyStopLevel?: number
}

export interface BalanceSnapshot {
  accountId: string
  equity: number
  balance: number
  marginUsed: number
  marginFree: number
  timestamp: number
}

export type OrderStatus = "pending" | "filled" | "cancelled" | "triggered"

export interface Order {
  id: string
  accountId: string
  symbol: string
  side: "buy" | "sell"
  qty: number
  price: number
  status: OrderStatus
  createdAt: number
  updatedAt: number
  /* Legacy UI fields for compatibility */
  type?: string // e.g., "Buy Limit"
  volume?: number
  time?: string
  sl?: number
  tp?: number
  currentPrice?: number
}

export interface Position {
  id: string
  accountId: string
  symbol: string
  type?: "Buy" | "Sell"
  volume: number
  openPrice: number
  openTime?: string
  sl?: number
  tp?: number
  commission?: number
  swap?: number
  pnl?: number
  currentPrice?: number
}

/******************************
 * Store Shape
 ******************************/
interface AccountState {
  /* data */
  accounts: Account[]
  selectedAccountId: string | null
  orders: Record<string, Order[]>
  positions: Record<string, Position[]>
  balances: Record<string, BalanceSnapshot[]>

  /* actions */
  selectAccount: (id: string) => void
  placeOrder: (order: Omit<Order, "id" | "accountId" | "createdAt" | "updatedAt" | "status">) => void
  setBalanceSnapshot: (snapshot: BalanceSnapshot) => void
  cancelOrder: (id: string) => void
  closePosition: (id: string) => void
  placeMarket: (side: "Buy" | "Sell", lots: number, symbol: string, price: number) => void
}

/******************************
 * Helper utils
 ******************************/
const now = () => Date.now()

// Simple ID generator using browser's crypto API (or fallback)
const genId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10))

/******************************
 * Store implementation
 ******************************/
export const useAccountStore = create<AccountState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        accounts: [...demoAccounts.map((a) => ({
          id: a.id,
          name: `Account ${a.accountNumber}`,
          currency: "USD",
          createdAt: new Date().toISOString(),
          balance: a.balance,
          equity: a.equity,
          dailyPnl: a.dailyPnl,
          dailyStopLevel: a.dailyStopLevel,
        }))],
        selectedAccountId: "1",
        orders: {},
        positions: (() => {
          const legacyPos = useTradingStore.getState().positions ?? []
          return { ["1"]: legacyPos as unknown as Position[] }
        })(),
        balances: {},

        /* actions */
        selectAccount: (id) => {
          set((state) => {
            // if the account doesn't exist yet, add a placeholder
            if (!state.accounts.find((a) => a.id === id)) {
              const placeholder: Account = {
                id,
                name: `Account ${id}`,
                currency: "USD",
                createdAt: new Date().toISOString(),
              }
              return { selectedAccountId: id, accounts: [...state.accounts, placeholder] }
            }
            return { selectedAccountId: id }
          })
        },
        placeOrder: (orderInput: Omit<Order, "id" | "accountId" | "createdAt" | "updatedAt" | "status">) => {
          const accountId = get().selectedAccountId
          if (!accountId) return
          const id = genId()
          const createdAt = now()
          const newOrder: Order = {
            ...orderInput,
            id,
            accountId,
            status: "pending",
            createdAt,
            updatedAt: createdAt,
            volume: (orderInput as any).qty ?? undefined,
            time: new Date(createdAt).toISOString(),
          }
          set((state) => {
            const acctOrders = state.orders[accountId] ?? []
            return {
              orders: { ...state.orders, [accountId]: [...acctOrders, newOrder] },
            }
          })
        },
        cancelOrder: (id: string) => {
          const accountId = get().selectedAccountId
          if (!accountId) return
          set((state) => {
            const acctOrders = state.orders[accountId] ?? []
            return {
              orders: {
                ...state.orders,
                [accountId]: acctOrders.filter((o) => o.id !== id || o.status !== "pending"),
              },
            }
          })
        },
        closePosition: (id: string) => {
          const accountId = get().selectedAccountId
          if (!accountId) return
          set((state) => {
            const acctPos = state.positions[accountId] ?? []
            return {
              positions: {
                ...state.positions,
                [accountId]: acctPos.filter((p) => p.id !== id),
              },
            }
          })
        },
        placeMarket: (side, lots, symbol, price) => {
          const accountId = get().selectedAccountId
          if (!accountId) return
          const id = Date.now().toString()
          const position: Position = {
            id,
            accountId,
            symbol,
            type: side,
            volume: lots,
            openPrice: price,
            openTime: new Date().toISOString(),
            pnl: 0,
            currentPrice: price,
          }
          set((state) => {
            const acctPositions = state.positions[accountId] ?? []
            return {
              positions: {
                ...state.positions,
                [accountId]: [...acctPositions, position],
              },
            }
          })
        },
        setBalanceSnapshot: (snapshot) => {
          set((state) => {
            const arr = state.balances[snapshot.accountId] ?? []
            return {
              balances: {
                ...state.balances,
                [snapshot.accountId]: [...arr, snapshot],
              },
            }
          })
        },
      }),
      {
        name: "account-store",
        version: 2,
        migrate: (state: any, version: number) => {
          if (!state) return state
          if (version === 1) {
            // enrich accounts with balances from demoAccounts
            const enriched = (state.accounts ?? []).map((acc: any) => {
              const legacy = demoAccounts.find((d) => d.id === acc.id)
              return legacy ? { ...legacy, ...acc } : acc
            })
            return { ...state, accounts: enriched }
          }
          return state
        },
      }
    )
  )
)

/******************************
 * Simulated Market Engine Sync
 ******************************/

if (typeof window !== "undefined") {
  // Recalculate unrealized PnL & equity every 2 seconds.
  setInterval(() => {
    const { positions, accounts } = useAccountStore.getState()
    const prices = useTradingStore.getState().prices

    let stateChanged = false
    const newPositions: typeof positions = { ...positions }
    const { orders } = useAccountStore.getState()
    const newOrders: typeof orders = { ...orders }

    const updatedAccounts = accounts.map((acct) => {
      const acctPositions = positions[acct.id] ?? []
      let totalPnl = 0
      const updatedPos = acctPositions.map((p) => {
        const current = prices[p.symbol] ?? p.currentPrice ?? p.openPrice
        const pnl =
          (current - p.openPrice) * p.volume * CONTRACT_SIZE * (p.type === "Sell" ? -1 : 1)
        totalPnl += pnl
        if (p.currentPrice !== current || p.pnl !== pnl) {
          stateChanged = true
        }
        return { ...p, currentPrice: current, pnl }
      })
      newPositions[acct.id] = updatedPos

      // update orders' current price
      const acctOrders = newOrders[acct.id] ?? []
      const updatedOrders = acctOrders.map((ord) => ({
        ...ord,
        currentPrice: prices[ord.symbol] ?? ord.currentPrice,
      }))
      newOrders[acct.id] = updatedOrders

      return {
        ...acct,
        equity: (acct.balance ?? 0) + totalPnl,
        dailyPnl: totalPnl,
      }
    })

    if (stateChanged) {
      useAccountStore.setState({ positions: newPositions, accounts: updatedAccounts, orders: newOrders })
    }
  }, 2000)
} 