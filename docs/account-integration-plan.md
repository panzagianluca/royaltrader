# Single-Account Trading Integration Plan

*Version 0.1 – 2025-06-19*

---

## 1. Goals & Scope

1. Provide **one unified account selector** that drives every trading view (orders, positions, margin, balance, equity, PnL).
2. Keep **all data local for now** (in-memory or persisted to browser storage); no remote APIs required.
3. Perform **margin, equity and PnL calculations client-side**.
4. Choose and implement the **best front-end state-management library** for this context.
5. Deliver a **clean, modular architecture** that can later be swapped to server APIs with minimal changes.

---

## 2. Key Technical Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| State management | **Zustand** (with TypeScript) | Lightweight, minimal boilerplate, built-in React hooks, good for local prototyping, and easy to migrate to Redux Toolkit or TRPC later. |
| Data persistence | **LocalStorage sync middleware** (provided by Zustand) | Keeps account snapshots between refreshes while remaining optional. |
| Real-time updates | **Event-Emitter simulation** + Zustand store subscription | Mimics WebSocket push without external infra; facilitates future replacement with actual sockets. |
| UI Framework | Existing React stack (assumed) | Aligns with current codebase; minimal overhead. |
| Testing | **Vitest + React Testing Library** for unit/integration; **Cypress** for E2E | Covers business logic and user flows. |

---

## 3. Data Model (TypeScript Interfaces)

```ts
interface Account {
  id: string;
  name: string;
  currency: string;
  createdAt: string;
}

interface BalanceSnapshot {
  accountId: string;
  equity: number;       // account equity (currency units)
  balance: number;      // cash balance
  marginUsed: number;   // current margin requirement
  marginFree: number;   // equity ‑ marginUsed
  timestamp: number;
}

interface Order {
  id: string;
  accountId: string;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;       // limit price (or exec price if filled)
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}

interface Position {
  accountId: string;
  symbol: string;
  qty: number;
  avgPrice: number;
  unrealizedPnl: number;
}
```

---

## 4. Global Store (Zustand)

```ts
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware'

interface TradingState {
  accounts: Account[];
  selectedAccountId: string | null;
  orders: Record<string, Order[]>;       // keyed by accountId
  positions: Record<string, Position[]>; // keyed by accountId
  balances: Record<string, BalanceSnapshot[]>; // time-series per account

  // actions
  selectAccount: (id: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  // ...other mutators
}

export const useTradingStore = create<TradingState>()(
  subscribeWithSelector(
    persist(/* config object */)
  )
);
```

Key notes:
1. `selectedAccountId` is **the single source of truth** for account context.
2. All selectors/components derive their slice of state based on this field.
3. Middleware layer can simulate server push by dispatching actions.

---

## 5. React Components & Hooks

1. **AccountPicker** – dropdown or modal to choose an account.
2. **Dashboard** – summary cards (equity, margin, PnL) observing `selectedAccountId`.
3. **OrdersTable** – filtered by account; supports place/cancel actions.
4. **PositionsTable** – current positions, unrealized PnL.
5. **MarginBox** – visual free/used margin bar.
6. **useAccountData(accountId)** – composite hook returning live orders, positions, balances for the account.

---

## 6. Data Flow & Lifecycle

```mermaid
graph TD;
  UI("React Components (Orders/Positions/etc.)") --> |subscribe| Store[Zustand Store];
  AccountPicker --> |selectAccount(id)| Store;
  PlaceOrderForm --> |placeOrder()| Store;
  SimEngine("Simulated Market Engine") --> |emit update| Store;
  subgraph Store
    selectedAccountId & orders & positions & balances
  end
```

1. User selects account → store updates `selectedAccountId` → components automatically re-render with correct data.
2. Fake market engine periodically adjusts prices/unrealized PnL → pushes updates to store.
3. Placing an order writes into store and triggers margin re-check.

---

## 7. Margin & PnL Calculation Logic

```ts
export function calcMarginRequired(order: Order | Position): number { /* ... */ }
export function calcEquity(balance: number, positions: Position[]): number { /* ... */ }
```

Rules:
* `marginFree = equity – marginUsed` must remain ≥ 0 when accepting new orders.
* `unrealizedPnl` updates every tick based on mocked market prices.

---

## 8. Validation & Guards

1. Order placement is **rejected** if resulting `marginFree` would be negative.
2. Position sizing respects min/max lot sizes (configurable).

---

## 9. Testing Strategy

| Layer | Tool | Example Test |
|-------|------|--------------|
| Business logic | Vitest | `calcEquity` handles positive/negative PnL. |
| Store mutations | Vitest | `placeOrder` decreases marginFree. |
| Component | React Testing Library | Dashboard shows correct equity after trade. |
| E2E | Cypress | Switch accounts and verify tables change. |

---

## 10. Milestone Checklist

- [x] Scaffold `zustand` store with types
- [x] Implement account seed data loader
- [x] Build **AccountPicker** component
- [x] Display **Dashboard** with equity/margin cards
- [x] Implement **OrdersTable** with place/cancel flow
- [ ] Implement **PositionsTable** with live PnL
- [x] Add simulated market engine & event loop
- [x] Write margin/PnL utility functions + unit tests
- [ ] End-to-end test: account switching & order placement
- [ ] Documentation update (`structure.md`, README)

---

## 11. Future-Proofing Notes

* Swap simulated engine for real WebSocket feed by replacing emitter with socket client; store API remains unchanged.
* Persist state to IndexedDB for larger datasets.
* Introduce selectors memoized via `zustand/vanilla` to improve performance.

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| **Equity** | Balance + Unrealized PnL |
| **Margin Used** | Sum of initial margin on open positions/orders |
| **Margin Free** | Equity – Margin Used |
| **PnL** | Profit and Loss |

---

_End of Plan_ 