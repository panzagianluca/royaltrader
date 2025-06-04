import { useState, useEffect } from 'react'
import { BarChart2, Shield, Clock, Settings, ChevronLeft, ChevronRight, Calendar, Crown, PanelLeftClose, PanelLeft } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AccountManageModal from './AccountManageModal'

interface Account {
  id: string
  accountNumber: string
  balance: number
  type: 'demo' | 'live'
  isVisible?: boolean
  isActive?: boolean
}

const initialAccounts: Account[] = [
  {
    id: '1',
    accountNumber: '5192834',
    balance: 100000,
    type: 'demo',
    isVisible: true,
    isActive: true
  },
  {
    id: '2',
    accountNumber: '1613423',
    balance: 150000,
    type: 'demo',
    isVisible: true,
    isActive: true
  },
  {
    id: '3',
    accountNumber: '7654321',
    balance: 500000,
    type: 'live',
    isVisible: true,
    isActive: true
  },
  {
    id: '4',
    accountNumber: '8901234',
    balance: 750000,
    type: 'live',
    isVisible: false,
    isActive: false
  }
]

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
}

function SidebarItem({ icon, title, active = false, collapsed = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        active ? 'bg-gray-3 text-gray-12' : 'hover:bg-gray-3 text-gray-11'
      }`}
    >
      {icon}
      {!collapsed && <span className="text-sm">{title}</span>}
    </button>
  )
}

interface LeftSidebarProps {
  selectedAccount?: Account
  onAccountSelect: (account: Account) => void
}

export default function LeftSidebar({ selectedAccount, onAccountSelect }: LeftSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Charts')
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)

  const demoAccounts = accounts.filter(acc => acc.type === 'demo')
  const liveAccounts = accounts.filter(acc => acc.type === 'live')

  useEffect(() => {
    // Set initial selected account
    if (!selectedAccount && accounts.length > 0) {
      onAccountSelect(accounts[0])
    }
  }, [])

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(balance)
  }

  const handleAccountClick = (account: Account) => {
    onAccountSelect(account)
  }

  const handleUpdateAccounts = (updatedAccounts: Account[]) => {
    setAccounts(updatedAccounts)
  }

  return (
    <div className={`left-sidebar ${collapsed ? 'w-16' : 'w-64'} h-full border-r border-gray-7 bg-background-primary flex flex-col transition-all duration-500 ease-in-out`}>
      {/* Logo Section */}
      <div className="h-[53px] px-4 border-b border-gray-7 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown size={24} className="text-blue-500" />
          {!collapsed && <span className="text-lg font-semibold">Royal Trader</span>}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-3 transition-colors"
        >
          {collapsed ? 
            <PanelLeft size={18} className="text-gray-12" /> : 
            <PanelLeftClose size={18} className="text-gray-12" />
          }
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg">Accounts</h2>
              <button 
                onClick={() => setIsManageModalOpen(true)} 
                className="p-1 rounded hover:bg-gray-3"
              >
                <Settings size={18} className="text-gray-12" />
              </button>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="demo">
                <AccordionTrigger className="text-sm font-normal">Demo Accounts</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {demoAccounts.map(account => (
                      <button
                        key={account.id}
                        onClick={() => handleAccountClick(account)}
                        className={`w-full flex justify-between items-center text-sm p-2 hover:bg-gray-3 rounded transition-colors ${
                          selectedAccount?.id === account.id ? 'bg-gray-3 text-gray-12' : 'text-gray-11'
                        }`}
                      >
                        <span>{account.accountNumber}</span>
                        <span>{formatBalance(account.balance)}</span>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="live">
                <AccordionTrigger className="text-sm font-normal">Live Accounts</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {liveAccounts.map(account => (
                      <button
                        key={account.id}
                        onClick={() => handleAccountClick(account)}
                        className={`w-full flex justify-between items-center text-sm p-2 hover:bg-gray-3 rounded transition-colors ${
                          selectedAccount?.id === account.id ? 'bg-gray-3 text-gray-12' : 'text-gray-11'
                        }`}
                      >
                        <span>{account.accountNumber}</span>
                        <span>{formatBalance(account.balance)}</span>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        <div className="space-y-1 p-2">
          <SidebarItem
            icon={<BarChart2 size={18} />}
            title="Charts"
            active={activeItem === 'Charts'}
            collapsed={collapsed}
            onClick={() => setActiveItem('Charts')}
          />
          <SidebarItem
            icon={<Shield size={18} />}
            title="Risk Management"
            active={activeItem === 'Risk'}
            collapsed={collapsed}
            onClick={() => setActiveItem('Risk')}
          />
          <SidebarItem
            icon={<Clock size={18} />}
            title="Trading Hours"
            active={activeItem === 'Hours'}
            collapsed={collapsed}
            onClick={() => setActiveItem('Hours')}
          />
          <SidebarItem
            icon={<Calendar size={18} />}
            title="Economic Calendar"
            active={activeItem === 'Calendar'}
            collapsed={collapsed}
            onClick={() => setActiveItem('Calendar')}
          />
          <SidebarItem
            icon={<Crown size={18} />}
            title="Leaderboard"
            active={activeItem === 'Leaderboard'}
            collapsed={collapsed}
            onClick={() => setActiveItem('Leaderboard')}
          />
        </div>
      </div>

      {/* Account Management Modal */}
      <AccountManageModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        accounts={accounts}
        onUpdateAccounts={handleUpdateAccounts}
      />
    </div>
  )
}
