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
import { useTradingStore } from "@/store/trading"

const useHistory = () => useTradingStore((s) => s.history)

export default function HistoryTable() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const history = useHistory()

  const rowVirtualizer = useVirtualizer({
    count: history.length,
    getScrollElement: () =>
      (scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as Element | null),
    overscan: 8,
    estimateSize: () => 40,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualItems.length ? virtualItems[0].start : 0
  const paddingBottom = virtualItems.length
    ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    : 0

  const ColumnGroup = () => (
    <colgroup>
      <col style={{ width: "90px" }} />{/* Ticket */}
      <col style={{ width: "80px" }} />{/* Symbol */}
      <col style={{ width: "60px" }} />{/* Side */}
      <col style={{ width: "60px" }} />{/* Lots */}
      <col style={{ width: "150px" }} />{/* Open Time */}
      <col style={{ width: "150px" }} />{/* Close Time */}
      <col style={{ width: "90px" }} />{/* Open Price */}
      <col style={{ width: "90px" }} />{/* Close Price */}
      <col style={{ width: "80px" }} />{/* PnL */}
      <col style={{ width: "90px" }} />{/* Commission */}
      <col style={{ width: "70px" }} />{/* Swap */}
      <col style={{ width: "80px" }} />{/* Duration */}
    </colgroup>
  )

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  const formatDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    const remMins = mins % 60
    if (hrs < 24) return `${hrs}h ${remMins}m`
    const days = Math.floor(hrs / 24)
    return `${days}d ${hrs % 24}h`
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Table className="w-full table-fixed whitespace-nowrap">
        <ColumnGroup />
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Lots</TableHead>
            <TableHead>Open Time</TableHead>
            <TableHead>Close Time</TableHead>
            <TableHead>Open Price</TableHead>
            <TableHead>Close Price</TableHead>
            <TableHead className="text-center">P/L</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Swap</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <Table className="relative w-full table-fixed whitespace-nowrap">
          <ColumnGroup />
          <TableBody>
            {paddingTop > 0 && (
              <TableRow>
                <TableCell colSpan={12} style={{ height: `${paddingTop}px`, padding: 0 }} />
              </TableRow>
            )}
            {virtualItems.map((virtualRow: VirtualItem) => {
              const entry = history[virtualRow.index]
              return (
                <TableRow key={entry.id} style={{ transform: `translateY(${virtualRow.start}px)` }}>
                  <TableCell className="py-1">{entry.id}</TableCell>
                  <TableCell className="py-1">{entry.symbol}</TableCell>
                  <TableCell className="py-1">{entry.side}</TableCell>
                  <TableCell className="py-1">{entry.volume.toFixed(2)}</TableCell>
                  <TableCell className="py-1">{formatDate(entry.openTime)}</TableCell>
                  <TableCell className="py-1">{formatDate(entry.closeTime)}</TableCell>
                  <TableCell className="py-1">{entry.openPrice.toFixed(5)}</TableCell>
                  <TableCell className="py-1">{entry.closePrice.toFixed(5)}</TableCell>
                  <TableCell className={`text-center py-1 ${entry.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{entry.pnl.toFixed(2)}</TableCell>
                  <TableCell className="py-1">{entry.commission?.toFixed(2) ?? '—'}</TableCell>
                  <TableCell className="py-1">{entry.swap?.toFixed(2) ?? '—'}</TableCell>
                  <TableCell className="py-1">{formatDuration(entry.openTime, entry.closeTime)}</TableCell>
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <TableRow>
                <TableCell colSpan={12} style={{ height: `${paddingBottom}px`, padding: 0 }} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
} 