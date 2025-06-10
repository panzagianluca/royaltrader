import { Sun, Moon, Bell, Maximize, ZoomIn, ZoomOut } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from 'react'
import { Account } from '@/data/accounts'
import { useZoom } from '@/contexts/ZoomContext'

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'TRADE_OPEN',
    message: 'Trade Open: #123456, EURUSD, Buy, 1.0 Lots',
    date: '2024-03-20 10:30:15'
  },
  {
    id: 2,
    type: 'TRADE_CLOSE',
    message: 'Trade Close: #123455, GBPUSD, Sell, 0.5 Lots, +$150.25',
    date: '2024-03-20 10:28:00'
  },
  {
    id: 3,
    type: 'SL_MODIFIED',
    message: 'Stop Loss Modified: #123454, USDJPY, New SL: 151.500',
    date: '2024-03-20 10:25:30'
  },
  {
    id: 4,
    type: 'TP_MODIFIED',
    message: 'Take Profit Modified: #123454, USDJPY, New TP: 152.750',
    date: '2024-03-20 10:25:15'
  },
  {
    id: 5,
    type: 'PENDING_ORDER',
    message: 'Pending Order Created: #123457, EURUSD, Buy Limit @ 1.0850, 0.5 Lots',
    date: '2024-03-20 10:20:00'
  },
  {
    id: 6,
    type: 'TRADE_OPEN',
    message: 'Trade Open: #123453, GBPJPY, Sell, 0.75 Lots',
    date: '2024-03-20 10:15:45'
  },
  {
    id: 7,
    type: 'MARGIN_CALL',
    message: 'Margin Call Warning: Account margin level at 125%',
    date: '2024-03-20 10:10:30'
  },
  {
    id: 8,
    type: 'PENDING_CANCELLED',
    message: 'Pending Order Cancelled: #123452, EURUSD, Buy Stop',
    date: '2024-03-20 10:05:15'
  },
  {
    id: 9,
    type: 'TRADE_CLOSE',
    message: 'Trade Close: #123451, USDCAD, Buy, 0.3 Lots, -$45.75',
    date: '2024-03-20 10:00:00'
  },
  {
    id: 10,
    type: 'ACCOUNT_FUNDING',
    message: 'Account Funded: +$10,000 via Bank Transfer',
    date: '2024-03-20 09:55:30'
  }
]

interface TopNavProps {
  darkMode: boolean
  setDarkMode: (mode: boolean) => void
  selectedAccount?: Account | null
}

export default function TopNav({ darkMode, setDarkMode, selectedAccount }: TopNavProps) {
  const [isLocked, setIsLocked] = useState(false)
  const [timeoutString, setTimeoutString] = useState("")
  const [lockCountdown, setLockCountdown] = useState("")
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [showBadge, setShowBadge] = useState(true)
  const { zoomIn, zoomOut } = useZoom();

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(balance)
  }

  const calculateLockCountdown = () => {
    const now = new Date()
    const target = new Date()
    target.setHours(17, 0, 0)
    if (now > target) {
      target.setDate(target.getDate() + 1)
    }
    const diff = target.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    let countdown = ""
    if (hours > 0) {
      countdown += `${hours} hour${hours > 1 ? 's' : ''}`
    }
    if (minutes > 0) {
      if (countdown) countdown += " and "
      countdown += `${minutes} minute${minutes > 1 ? 's' : ''}`
    }
    
    setLockCountdown(countdown || "the rest of the trading day");
  }

  useEffect(() => {
    if (!isLocked) return;

    const updateTimeout = () => {
      const now = new Date()
      const target = new Date()
      target.setHours(17, 0, 0)
      if (now > target) {
        target.setDate(target.getDate() + 1)
      }
      const diff = target.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeoutString(`${hours}h ${minutes}m ${seconds}s`)
    }
    
    updateTimeout()
    const interval = setInterval(updateTimeout, 1000)
    return () => clearInterval(interval)
  }, [isLocked])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const clearNotifications = () => {
    setNotifications([])
    setShowBadge(false)
  }

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-4">
        <div className="flex space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="cursor-default">
                  Account: {selectedAccount ? selectedAccount.accountNumber : 'N/A'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your account number</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="cursor-default">
                  Balance: {selectedAccount ? formatBalance(selectedAccount.balance) : '$0'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your total account balance</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="cursor-default">
                  Equity: {selectedAccount ? formatBalance(selectedAccount.equity) : '$0'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current balance including unrealized P&L</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="cursor-default">
                  Daily PnL: {selectedAccount ? formatBalance(selectedAccount.dailyPnl) : '$0'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profit/Loss for the current trading day</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="cursor-default">
                  Daily Stop Level: {selectedAccount ? formatBalance(selectedAccount.balance * 0.95) : '$0'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Trading will be stopped if account drops below this level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isLocked} variant="destructive" onClick={calculateLockCountdown}>
              {isLocked ? `Account Locked, Time Left ${timeoutString}` : 'Lock Account for the day'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Account Lock</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  <p>
                    Locking your account will disable all trading for the next {lockCountdown}. This decision is final and cannot be reversed during this period.
                  </p>
                  <div>
                    <h3 className="font-semibold">What this means:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-500">
                      <li>You will not be able to open any new trades.</li>
                      <li>Your account will automatically unlock after {lockCountdown}.</li>
                    </ul>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsLocked(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={() => setIsLocked(true)} variant="destructive">Yes, Lock Account</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-center space-x-2">
        <AlertDialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    {showBadge && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />}
                    <Bell size={16} />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Notifications</AlertDialogTitle>
              <AlertDialogDescription>
                Here are your latest account activities and alerts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ScrollArea className="h-72 w-full">
              <div className="p-4 space-y-4">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Bell size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction onClick={clearNotifications}>Clear Notifications</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Separator orientation="vertical" className="h-6" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                <Maximize size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fullscreen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={zoomIn}>
                <ZoomIn size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={zoomOut}>
                <ZoomOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator orientation="vertical" className="h-6" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{darkMode ? 'Light mode' : 'Dark mode'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
