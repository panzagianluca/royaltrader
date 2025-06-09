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

const mockPositions = [
  {
    id: '654321',
    symbol: 'EURUSD',
    type: 'Buy',
    volume: 1.0,
    openTime: '2024-03-22 10:30:15',
    openPrice: 1.0850,
    sl: 1.0800,
    tp: 1.0950,
    currentPrice: 1.0875,
    commission: -3.50,
    swap: 0,
    pnl: 250.00,
  },
  {
    id: '654322',
    symbol: 'GBPJPY',
    type: 'Sell',
    volume: 0.5,
    openTime: '2024-03-22 08:15:45',
    openPrice: 191.50,
    sl: 192.00,
    tp: 190.50,
    currentPrice: 191.20,
    commission: -2.00,
    swap: -1.50,
    pnl: -150.00,
  },
];

export default function PositionsTable() {
  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Open Time</TableHead>
            <TableHead>Open Price</TableHead>
            <TableHead>S/L</TableHead>
            <TableHead>T/P</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Swap</TableHead>
            <TableHead>PnL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPositions.map((position) => (
            <TableRow key={position.id}>
              <TableCell className="py-1">{position.id}</TableCell>
              <TableCell className="py-1">{position.symbol}</TableCell>
              <TableCell className="py-1">
                <Badge variant={position.type === 'Buy' ? 'default' : 'destructive'}>
                  {position.type}
                </Badge>
              </TableCell>
              <TableCell className="py-1">{position.volume.toFixed(2)}</TableCell>
              <TableCell className="py-1">{position.openTime}</TableCell>
              <TableCell className="py-1">{position.openPrice.toFixed(5)}</TableCell>
              <TableCell className="py-1">{position.sl.toFixed(5)}</TableCell>
              <TableCell className="py-1">{position.tp.toFixed(5)}</TableCell>
              <TableCell className="py-1">{position.currentPrice.toFixed(5)}</TableCell>
              <TableCell className="py-1">{position.commission.toFixed(2)}</TableCell>
              <TableCell className="py-1">{position.swap.toFixed(2)}</TableCell>
              <TableCell className={`py-1 ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {position.pnl.toFixed(2)}
              </TableCell>
              <TableCell className="py-1">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Close</Button>
                  <Button variant="outline" size="sm">Partial Close</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 