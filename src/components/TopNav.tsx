import { Sun, Moon, Bell, User, UserCircle2, Laptop2, LogOut, Languages } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

interface Account {
  id: string
  accountNumber: string
  balance: number
  type: 'demo' | 'live'
  isVisible?: boolean
  isActive?: boolean
}

interface TopNavProps {
  darkMode: boolean
  setDarkMode: (mode: boolean) => void
  selectedAccount?: Account
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
]

export default function TopNav({ darkMode, setDarkMode, selectedAccount }: TopNavProps) {
  const [isLocked, setIsLocked] = useState(false)
  const [timeoutString, setTimeoutString] = useState("")
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [showBadge, setShowBadge] = useState(true)
  const [activeProfileTab, setActiveProfileTab] = useState('User')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(balance)
  }

  useEffect(() => {
    if (!isLocked) return;

    const updateTimeout = () => {
      const now = new Date()
      const target = new Date()
      target.setHours(17, 0, 0) // 5:00 PM
      if (now > target) {
        target.setDate(target.getDate() + 1)
      }
      const diff = target.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeoutString(`${hours}h ${minutes}m ${seconds}s Left`)
    }
    
    updateTimeout()
    const interval = setInterval(updateTimeout, 1000) // Update every second
    return () => clearInterval(interval)
  }, [isLocked])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    // Update document class for Tailwind dark mode
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

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...')
  }

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    // Here you would typically implement the language change logic
    console.log('Language changed to:', value)
  }

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-7 bg-background-primary">
      <div className="flex items-center space-x-4">
        
        {/* Chart Tools */}
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
                  Equity: {selectedAccount ? formatBalance(selectedAccount.balance) : '$0'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current balance including unrealized P&L</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="cursor-default">
                  Daily PnL: $0
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

            {!isLocked ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                  >
                    Lock Account for the day
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will disable trading for the rest of the day.
                      This action cannot be undone.
                      This means your account will be locked until the end of the trading day.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => setIsLocked(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Badge 
                variant="destructive" 
                className="h-8 px-4 flex items-center text-xs my-auto"
              >
                Account Locked - {timeoutString}
              </Badge>
            )}
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Controls */}
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleTheme}
                  className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center"
                >
                  {darkMode ? <Sun size={18} className="text-gray-12" /> : <Moon size={18} className="text-gray-12" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
                  <Bell size={18} className="text-gray-12" />
                </button>
                {showBadge && notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background dark:bg-[#0A0A0A] border-gray-7">
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium leading-none">Notifications</h4>
                  <Badge variant="destructive" className="text-xs">
                    {notifications.length} New
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearNotifications}
                  className="text-xs hover:bg-gray-3"
                >
                  Clear all
                </Button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="text-sm border-b border-gray-7 last:border-0 pb-2 last:pb-0"
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-11 mt-1">{notification.date}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-sm text-gray-11 text-center py-4">
                      No new notifications
                    </div>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Dialog>
            <DialogTrigger asChild>
              <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
                <User size={18} className="text-gray-12" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-gray-2 border-gray-7">
              <div className="border-b border-gray-7 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-12">User Settings</h2>
              </div>
              <div className="flex h-[500px]">
                {/* Side Menu */}
                <div className="w-48 border-r border-gray-7 p-4 flex flex-col bg-gray-2">
                  <div className="flex-1 space-y-1">
                    <button
                      onClick={() => setActiveProfileTab('User')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        activeProfileTab === 'User' ? 'bg-gray-4 text-gray-12' : 'hover:bg-gray-3 text-gray-11'
                      }`}
                    >
                      <UserCircle2 size={18} />
                      <span>User</span>
                    </button>
                    <button
                      onClick={() => setActiveProfileTab('Devices')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        activeProfileTab === 'Devices' ? 'bg-gray-4 text-gray-12' : 'hover:bg-gray-3 text-gray-11'
                      }`}
                    >
                      <Laptop2 size={18} />
                      <span>Devices</span>
                    </button>
                    <button
                      onClick={() => setActiveProfileTab('Language')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        activeProfileTab === 'Language' ? 'bg-gray-4 text-gray-12' : 'hover:bg-gray-3 text-gray-11'
                      }`}
                    >
                      <Languages size={18} />
                      <span>Language</span>
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 bg-gray-2">
                  {activeProfileTab === 'User' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-12">User Profile</h2>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-gray-7 bg-gray-3">
                          <h3 className="text-sm font-medium text-gray-12 mb-2">Personal Information</h3>
                          <div className="space-y-2 text-sm text-gray-11">
                            <div>Email: user@example.com</div>
                            <div>Name: John Doe</div>
                            <div>Location: New York, USA</div>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-7 bg-gray-3">
                          <h3 className="text-sm font-medium text-gray-12 mb-2">Preferences</h3>
                          <div className="space-y-2 text-sm text-gray-11">
                            <div>Language: English</div>
                            <div>Time Zone: EST (UTC-5)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeProfileTab === 'Devices' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-12">Connected Devices</h2>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-gray-7 bg-gray-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-12">Current Device</h3>
                            <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Active</span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-11">
                            <div>Windows 10 - Chrome</div>
                            <div>Last active: Now</div>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-7 bg-gray-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-12">Other Devices</h3>
                            <span className="text-xs bg-gray-500/10 text-gray-11 px-2 py-1 rounded">Inactive</span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-11">
                            <div>iPhone 13 - Safari</div>
                            <div>Last active: 2 hours ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeProfileTab === 'Language' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-12">Language Settings</h2>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-gray-7 bg-gray-3">
                          <h3 className="text-sm font-medium text-gray-12 mb-4">Select Your Language</h3>
                          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-full bg-gray-2 border-gray-7 ring-offset-gray-2 focus:ring-gray-7 [&>span]:text-gray-12 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                              <SelectValue>
                                {AVAILABLE_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag}{' '}
                                {AVAILABLE_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-2 border-gray-7">
                              {AVAILABLE_LANGUAGES.map((language) => (
                                <SelectItem 
                                  key={language.code} 
                                  value={language.code}
                                  className="flex items-center gap-2 text-gray-12 focus:bg-gray-4 focus:text-gray-12"
                                >
                                  <span className="mr-2">{language.flag}</span>
                                  {language.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="mt-4 text-sm text-gray-11">
                            Select your preferred language. This will change the language of the entire application.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
