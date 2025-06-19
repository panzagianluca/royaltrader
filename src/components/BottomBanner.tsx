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
import AlertsTable from './AlertsTable';
import { useAccountStore } from "@/store/accountStore";

interface BottomBannerProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

type Tab = 'Positions' | 'Orders' | 'History' | 'Alerts';

const usePositionsLive = () => {
  const { positions, selectedAccountId } = useAccountStore()
  return selectedAccountId ? positions[selectedAccountId] ?? [] : []
}
const useOrdersLive = () => {
  const { orders, selectedAccountId } = useAccountStore()
  return selectedAccountId ? orders[selectedAccountId] ?? [] : []
}
const useAlertsCount = () => useTradingStore((s)=>s.alerts.length)

export default function BottomBanner({ isExpanded, onToggleExpand }: BottomBannerProps) {
  const [activeTab, setActiveTab] = usePersistedState<Tab>('ui.bottomBannerTab', 'Positions');
  const positionsLive = usePositionsLive();
  const ordersLive = useOrdersLive();
  const alertsCount = useAlertsCount();

  const totalPnL = positionsLive.reduce((sum, p) => sum + (p.pnl ?? 0), 0);
  const profitableTrades = positionsLive.filter((p) => (p.pnl ?? 0) > 0);
  const losingTrades = positionsLive.filter((p) => (p.pnl ?? 0) < 0);

  const positionsCountMock = positionsLive.length;
  const ordersCountMock = ordersLive.length;

  const tabs: Tab[] = ['Positions', 'Orders', 'History', 'Alerts'];

  const displayLabel = (tab: Tab) => {
    switch (tab) {
      case 'Positions':
        return `Positions (${positionsCountMock})`
      case 'Orders':
        return `Orders (${ordersCountMock})`
      case 'Alerts':
        return `Alerts (${alertsCount})`
      default:
        return tab
    }
  }

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
                    className="text-sm font-normal px-3 py-1 border-b-2 border-transparent rounded-none bg-transparent hover:bg-transparent hover:text-primary/80 transition-colors data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-current data-[state=on]:font-medium"
                  >
                    {displayLabel(tab)}
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
                    <AlertDialogAction onClick={() => { useTradingStore.getState().closeAllPositions(); notifySuccess("All positions closed") }}>Confirm</AlertDialogAction>
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
                      Close all profitable positions for a total PnL of ${profitableTrades.reduce((s,p)=>s+(p.pnl ?? 0),0).toFixed(2)}.<br/>
                      Total trades to be closed: {profitableTrades.length}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { useTradingStore.getState().closeProfitablePositions(); notifySuccess("Profitable positions closed") }}>Confirm</AlertDialogAction>
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
                      Close all losing positions for a total PnL of ${losingTrades.reduce((s,p)=>s+(p.pnl ?? 0),0).toFixed(2)}.<br/>
                      Total trades to be closed: {losingTrades.length}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { useTradingStore.getState().closeLosingPositions(); notifySuccess("Losing positions closed") }}>Confirm</AlertDialogAction>
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
              {/* Clear Alerts */}
              {activeTab === 'Alerts' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="px-2 py-0.5 h-6 text-xs">Clear Alerts</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Alerts</AlertDialogTitle>
                      <AlertDialogDescription>This will remove all alerts from the list.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { useTradingStore.getState().clearAlerts(); }}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
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
            <div className="p-1 h-full">
              {activeTab === 'Positions' && <PositionsTable />}
              {activeTab === 'Orders' && <OrdersTable />}
              {activeTab === 'History' && <HistoryTable />}
              {activeTab === 'Alerts' && <AlertsTable />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
