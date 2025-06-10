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

const mockOrders = [
  {
    id: '754321',
    symbol: 'EURUSD',
    type: 'Buy Limit',
    volume: 0.5,
    orderTime: '2024-03-23 11:30:15',
    orderPrice: 1.0800,
    sl: 1.0750,
    tp: 1.0900,
    currentPrice: 1.0875,
  },
  {
    id: '754322',
    symbol: 'GBPJPY',
    type: 'Sell Stop',
    volume: 0.2,
    orderTime: '2024-03-23 09:15:45',
    orderPrice: 191.00,
    sl: 191.50,
    tp: 190.00,
    currentPrice: 191.20,
  },
];

export default function OrdersTable() {
  return (
    <div className="h-full overflow-auto">
      <Table>
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="py-1">{order.id}</TableCell>
              <TableCell className="py-1">{order.symbol}</TableCell>
              <TableCell className="py-1">
                <Badge variant={order.type.includes('Buy') ? 'default' : 'destructive'}>
                  {order.type}
                </Badge>
              </TableCell>
              <TableCell className="py-1">{order.volume.toFixed(2)}</TableCell>
              <TableCell className="py-1">{order.orderTime}</TableCell>
              <TableCell className="py-1">{order.orderPrice.toFixed(5)}</TableCell>
              <TableCell className="py-1">{order.sl.toFixed(5)}</TableCell>
              <TableCell className="py-1">{order.tp.toFixed(5)}</TableCell>
              <TableCell className="py-1">{order.currentPrice.toFixed(5)}</TableCell>
              <TableCell className="py-1">
                <div className="flex justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="p-2">
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
                        <Button variant="outline" className="p-2">
                          <X size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cancel</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 