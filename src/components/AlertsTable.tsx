import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef } from "react"
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useTradingStore } from "@/store/trading"

const ROW_HEIGHT = 28
const rowHeightClass = "h-7"

const useAlerts = () => useTradingStore((s) => s.alerts)
const useRemoveAlert = () => useTradingStore((s) => s.removeAlert)
const usePrices = () => useTradingStore((s) => s.prices)

export default function AlertsTable() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const alerts = useAlerts()
  const removeAlert = useRemoveAlert()
  const prices = usePrices()

  const rowVirtualizer = useVirtualizer({
    count: alerts.length,
    getScrollElement: () =>
      (scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as Element | null),
    overscan: 8,
    estimateSize: () => ROW_HEIGHT,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualItems.length ? virtualItems[0].start : 0
  const paddingBottom = virtualItems.length
    ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    : 0

  const ColumnGroup = () => (
    <colgroup>
      <col style={{ width: "80px" }} />{/* Symbol */}
      <col style={{ width: "100px" }} />{/* Alert Price */}
      <col style={{ width: "100px" }} />{/* Market Price */}
      <col style={{ width: "60px" }} />{/* Action */}
    </colgroup>
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Table className="w-full table-fixed whitespace-nowrap">
        <ColumnGroup />
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs h-8">Symbol</TableHead>
            <TableHead className="text-xs h-8">Alert Price</TableHead>
            <TableHead className="text-xs h-8">Market Price</TableHead>
            <TableHead className="text-xs h-8 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <Table className="relative w-full table-fixed whitespace-nowrap">
          <ColumnGroup />
          <TableBody>
            {paddingTop > 0 && (
              <TableRow>
                <TableCell colSpan={4} style={{ height: `${paddingTop}px`, padding: 0 }} />
              </TableRow>
            )}
            {virtualItems.map((virtualRow: VirtualItem) => {
              const alert = alerts[virtualRow.index]
              return (
                <TableRow key={alert.id} className={rowHeightClass}>
                  <TableCell className="py-1">{alert.symbol}</TableCell>
                  <TableCell className="py-1">{alert.alertPrice.toFixed(5)}</TableCell>
                  <TableCell className="py-1">{prices[alert.symbol]?.toFixed(5) ?? alert.marketPrice.toFixed(5)}</TableCell>
                  <TableCell className="py-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      onClick={() => removeAlert(alert.id)}
                    >
                      <X size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <TableRow>
                <TableCell colSpan={4} style={{ height: `${paddingBottom}px`, padding: 0 }} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
} 