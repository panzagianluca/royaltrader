import { ChevronUp, ChevronDown } from 'lucide-react'
import { usePersistedState } from "@/hooks/usePersistedState";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button";
import PositionsTable from './PositionsTable';
import OrdersTable from './OrdersTable';
import HistoryTable from './HistoryTable';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { notifySuccess } from "@/components/ui/notifications";
import { useTradingStore } from "@/store/trading";

interface BottomBannerProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

type Tab = 'Positions' | 'Orders' | 'History' | 'Alerts';

const usePositionsLive = () => useTradingStore((s) => s.positions);
const useOrdersLive = () => useTradingStore((s) => s.orders);

export default function BottomBanner({ isExpanded, onToggleExpand }: BottomBannerProps) {
  const [activeTab, setActiveTab] = usePersistedState<Tab>('ui.bottomBannerTab', 'Positions');
  const positionsLive = usePositionsLive();
  const ordersLive = useOrdersLive();

  const totalPnL = positionsLive.reduce((sum, p) => sum + p.pnl, 0);
  const profitableTrades = positionsLive.filter((p) => p.pnl > 0);
  const losingTrades = positionsLive.filter((p) => p.pnl < 0);

  const positionsCountMock = positionsLive.length;
  const ordersCountMock = ordersLive.length;

  const tabs: Tab[] = ['Positions', 'Orders', 'History', 'Alerts'];

  return (
    <div className={`transition-all duration-500 ease-in-out bg-background rounded-md ${isExpanded ? 'h-full' : 'h-[40px]'}`}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-[40px] px-4 gap-2">
          <div className="flex items-center">
            {isExpanded ? (
              <ToggleGroup type="single" value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
                {tabs.map(tab => (
                  <ToggleGroupItem
                    key={tab}
                    value={tab}
                    aria-label={`Select ${tab}`}
                    className="text-sm font-normal px-3 py-1 rounded-md transition-colors hover:bg-muted hover:text-primary data-[state=on]:bg-muted data-[state=on]:text-primary data-[state=on]:font-medium"
                  >
                    {tab}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <div className="flex items-center gap-4 text-sm">
                <span>Open Positions: {positionsCountMock}</span>
                <span>Open Orders: {ordersCountMock}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isExpanded && (
              <div className="flex gap-1">
                {/* Close All */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="px-2 py-0.5 h-6 text-xs">Close All</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Close All Trades</AlertDialogTitle>
                      <AlertDialogDescription>
                        Close all positions/orders for a total PnL of ${totalPnL.toFixed(2)}.<br/>
                        Total trades to be closed: {positionsLive.length}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => notifySuccess("All trades closed")}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* Close Profits */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="px-2 py-0.5 h-6 text-xs">Close Profits</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Close Profitable Trades</AlertDialogTitle>
                      <AlertDialogDescription>
                        Close all profitable positions for a total PnL of ${profitableTrades.reduce((s,p)=>s+p.pnl,0).toFixed(2)}.<br/>
                        Total trades to be closed: {profitableTrades.length}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => notifySuccess("Profitable trades closed")}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* Cancel Pending */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="px-2 py-0.5 h-6 text-xs">Cancel Orders</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel All Pending Orders</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel all pending orders ({ordersLive.filter(o=>o.status === 'pending').length}).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { useTradingStore.getState().cancelAllPending(); notifySuccess('All pending orders cancelled') }}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* Close Losses */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="px-2 py-0.5 h-6 text-xs">Close Losses</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Close Losing Trades</AlertDialogTitle>
                      <AlertDialogDescription>
                        Close all losing positions for a total PnL of ${losingTrades.reduce((s,p)=>s+p.pnl,0).toFixed(2)}.<br/>
                        Total trades to be closed: {losingTrades.length}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => notifySuccess("Losing trades closed")}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          <button 
            onClick={onToggleExpand}
            className="p-1 hover:bg-background-alpha rounded transition-all duration-300 ease-in-out"
          >
            {isExpanded ? 
              <ChevronDown size={18} className="text-primary transition-transform duration-500 ease-in-out" /> : 
              <ChevronUp size={18} className="text-primary transition-transform duration-500 ease-in-out" />
            }
          </button>
          </div>
        </div>
        <div className={`flex-1 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded && (
            <div className="p-4 h-full">
              {activeTab === 'Positions' && <PositionsTable />}
              {activeTab === 'Orders' && <OrdersTable />}
              {activeTab === 'History' && <HistoryTable />}
              {activeTab === 'Alerts' && <div>Alerts Content</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
