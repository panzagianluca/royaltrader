import { describe, it, expect } from "vitest"
import { calcMarginRequired, calcEquity } from "@/lib/accountMetrics"

describe("accountMetrics", () => {
  it("calcMarginRequired computes correct margin", () => {
    const lots = 1 // standard lot
    const expected = (100_000) / 100 // CONTRACT_SIZE / LEVERAGE
    expect(calcMarginRequired(lots)).toBe(expected)
  })

  it("calcEquity adds pnl to balance", () => {
    const balance = 1000
    const positions = [
      { id: "1", accountId: "1", symbol: "EURUSD", volume: 1, openPrice: 1.1, pnl: 50 } as any,
      { id: "2", accountId: "1", symbol: "EURUSD", volume: 1, openPrice: 1.1, pnl: -20 } as any,
    ]
    expect(calcEquity(balance, positions)).toBe(1030)
  })
}) 