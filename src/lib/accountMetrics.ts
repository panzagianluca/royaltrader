import { CONTRACT_SIZE, LEVERAGE } from "@/store/trading"
import type { Order, Position } from "@/store/accountStore"

/**
 * Calculate margin required for a trade (order or position).
 * @param lots Number of standard lots.
 */
export function calcMarginRequired(lots: number): number {
  return (lots * CONTRACT_SIZE) / LEVERAGE
}

export function calcMarginRequiredFromOrder(order: Pick<Order, "qty" | "volume">): number {
  const lots = (order as any).qty ?? order.volume ?? 0
  return calcMarginRequired(lots)
}

export function calcEquity(balance: number, positions: Position[]): number {
  const totalPnl = positions.reduce((sum, p) => sum + (p.pnl ?? 0), 0)
  return balance + totalPnl
} 