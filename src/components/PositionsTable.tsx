import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X, Scissors, Pencil } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRef } from "react"
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual"
import { ScrollArea } from "@/components/ui/scroll-area"
import { notifySuccess } from "@/components/ui/notifications"
import { useTradingStore } from "@/store/trading"

// pull positions from global store
const usePositions = () => useTradingStore((s) => s.positions)
const usePrices = () => useTradingStore((s) => s.prices)
const useClosePosition = () => useTradingStore((s) => s.closePosition)

export default function PositionsTable() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const positions = usePositions()
  const prices = usePrices()
  const closePosition = useClosePosition()

  const rowVirtualizer = useVirtualizer({
    count: positions.length,
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
      <col style={{ width: '90px' }} />{/* Order ID */}
      <col style={{ width: '80px' }} />{/* Symbol */}
      <col style={{ width: '60px' }} />{/* Side */}
      <col style={{ width: '70px' }} />{/* Volume */}
      <col style={{ width: '160px' }} />{/* Open Time */}
      <col style={{ width: '90px' }} />{/* Open Price */}
      <col style={{ width: '80px' }} />{/* SL */}
      <col style={{ width: '80px' }} />{/* TP */}
      <col style={{ width: '100px' }} />{/* Current Price */}
      <col style={{ width: '100px' }} />{/* Commission */}
      <col style={{ width: '70px' }} />{/* Swap */}
      <col style={{ width: '80px' }} />{/* PnL */}
      <col style={{ width: '90px' }} />{/* Actions */}
    </colgroup>
  )

  const HeaderTable = () => (
    <Table className="w-full table-fixed whitespace-nowrap">
      <ColumnGroup />
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Open Time</TableHead>
          <TableHead>Open Price</TableHead>
          <TableHead>S/L</TableHead>
          <TableHead>T/P</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Swap</TableHead>
          <TableHead className="text-center">PnL</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <HeaderTable />
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <Table className="relative w-full table-fixed whitespace-nowrap">
          <ColumnGroup />
          <TableBody>
            {paddingTop > 0 && (
              <TableRow>
                <TableCell colSpan={13} style={{ height: `${paddingTop}px`, padding: 0 }} />
              </TableRow>
            )}
            {virtualItems.map((virtualRow: VirtualItem) => {
              const position = positions[virtualRow.index]
              return (
                <TableRow key={position.id}>
                  <TableCell className="py-1">{position.id}</TableCell>
                  <TableCell className="py-1">{position.symbol}</TableCell>
                  <TableCell className="py-1">{position.type ?? "—"}</TableCell>
                  <TableCell className="py-1">{position.volume.toFixed(2)}</TableCell>
                  <TableCell className="py-1">{position.openTime}</TableCell>
                  <TableCell className="py-1">{position.openPrice.toFixed(5)}</TableCell>
                  <TableCell className="py-1">{position.sl?.toFixed(5) ?? "—"}</TableCell>
                  <TableCell className="py-1">{position.tp?.toFixed(5) ?? "—"}</TableCell>
                  <TableCell className="py-1">{prices[position.symbol]?.toFixed(5) ?? "—"}</TableCell>
                  <TableCell className="py-1">{position.commission?.toFixed(2) ?? "—"}</TableCell>
                  <TableCell className="py-1">{position.swap?.toFixed(2) ?? "—"}</TableCell>
                  <TableCell className={`text-center py-1 ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {position.pnl.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" className="p-1">
                              <Pencil size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modify</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-1"
                              onClick={() => {
                                closePosition(position.id)
                                notifySuccess(`Position ${position.id} closed successfully`)
                              }}
                            >
                              <X size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Close</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" className="p-1">
                              <Scissors size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Partial Close</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <TableRow>
                <TableCell colSpan={13} style={{ height: `${paddingBottom}px`, padding: 0 }} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
} 