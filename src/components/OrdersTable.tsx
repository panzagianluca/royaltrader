import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Pencil } from "lucide-react"
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

const useOrders = () => useTradingStore((s) => s.orders)

export default function OrdersTable() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const orders = useOrders()
  const cancelOrder = useTradingStore((s) => s.cancelOrder)
  const rowVirtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => (scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as Element | null),
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
      <col style={{ width: '80px' }} />{/* Side */}
      <col style={{ width: '70px' }} />{/* Volume */}
      <col style={{ width: '160px' }} />{/* Creation Time */}
      <col style={{ width: '90px' }} />{/* Order Price */}
      <col style={{ width: '80px' }} />{/* SL */}
      <col style={{ width: '80px' }} />{/* TP */}
      <col style={{ width: '100px' }} />{/* Current Price */}
      <col style={{ width: '90px' }} />{/* Status */}
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
          <TableHead>Creation Time</TableHead>
          <TableHead>Order Price</TableHead>
          <TableHead>S/L</TableHead>
          <TableHead>T/P</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Status</TableHead>
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
                <TableCell colSpan={11} style={{ height: `${paddingTop}px`, padding: 0 }} />
              </TableRow>
            )}
            {virtualItems.map((virtualRow: VirtualItem) => {
              const order = orders[virtualRow.index]
              return (
              <TableRow key={order.id}>
                <TableCell className="py-1">{order.id}</TableCell>
                <TableCell className="py-1">{order.symbol}</TableCell>
                  <TableCell className="py-1">{order.type}</TableCell>
                <TableCell className="py-1">{order.volume.toFixed(2)}</TableCell>
                  <TableCell className="py-1">{order.time}</TableCell>
                  <TableCell className="py-1">{order.price.toFixed(5)}</TableCell>
                  <TableCell className="py-1">{order.sl?.toFixed(5) ?? "—"}</TableCell>
                  <TableCell className="py-1">{order.tp?.toFixed(5) ?? "—"}</TableCell>
                  <TableCell className="py-1">{order.currentPrice?.toFixed(5) ?? "—"}</TableCell>
                  <TableCell className="py-1">
                    <Badge variant={order.status === 'pending' ? 'secondary' : order.status === 'triggered' ? 'outline' : 'destructive'} className="text-xs">
                      {order.status ?? '—'}
                    </Badge>
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
                    {order.status === 'pending' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-1"
                              onClick={() => {
                                cancelOrder(order.id)
                                notifySuccess(`Order ${order.id} cancelled`)
                              }}
                            >
                            <X size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cancel</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  </div>
                </TableCell>
              </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <TableRow>
                <TableCell colSpan={11} style={{ height: `${paddingBottom}px`, padding: 0 }} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
} 