import { useState } from 'react'
import { BarChart2, Shield, Clock, Settings, ChevronLeft, ChevronRight, Calendar, Crown } from 'lucide-react'
import AccountTree from './AccountTree'
import AccountManageModal from './AccountManageModal'

interface Account {
  id: string
  type: 'challenge' | 'funded'
  program: 'Royal Pro' | 'Dragon' | 'Knight'
  accountNumber: string
  balance: number
  isActive: boolean
  isVisible: boolean
  phase: 'Phase 1' | 'Phase 2' | 'Funded'
}

interface AccountGroup {
  type: 'challenge' | 'funded'
  label: string
  programs: {
    name: string
    accounts: Account[]
  }[]
}

const initialAccounts: AccountGroup[] = [
  {
    type: 'challenge',
    label: 'Challenge Accounts',
    programs: [
      {
        name: 'Royal Pro',
        accounts: [
          {
            id: '1',
            type: 'challenge',
            program: 'Royal Pro',
            accountNumber: '5192834',
            balance: 100000,
            isActive: true,
            isVisible: true,
            phase: 'Phase 1'
          },
          {
            id: '2',
            type: 'challenge',
            program: 'Royal Pro',
            accountNumber: '1613423',
            balance: 150000,
            isActive: true,
            isVisible: true,
            phase: 'Phase 2'
          },
          {
            id: '3',
            type: 'challenge',
            program: 'Royal Pro',
            accountNumber: '8723456',
            balance: 200000,
            isActive: false,
            isVisible: false,
            phase: 'Phase 1'
          }
        ]
      },
      {
        name: 'Dragon',
        accounts: [
          {
            id: '4',
            type: 'challenge',
            program: 'Dragon',
            accountNumber: '9345678',
            balance: 100000,
            isActive: true,
            isVisible: true,
            phase: 'Phase 1'
          },
          {
            id: '5',
            type: 'challenge',
            program: 'Dragon',
            accountNumber: '4567890',
            balance: 150000,
            isActive: false,
            isVisible: false,
            phase: 'Phase 2'
          },
          {
            id: '6',
            type: 'challenge',
            program: 'Dragon',
            accountNumber: '1234567',
            balance: 200000,
            isActive: false,
            isVisible: false,
            phase: 'Phase 1'
          }
        ]
      }
    ]
  },
  {
    type: 'funded',
    label: 'Funded Accounts',
    programs: [
      {
        name: 'Royal Pro',
        accounts: [
          {
            id: '7',
            type: 'funded',
            program: 'Royal Pro',
            accountNumber: '7654321',
            balance: 500000,
            isActive: true,
            isVisible: true,
            phase: 'Funded'
          },
          {
            id: '8',
            type: 'funded',
            program: 'Royal Pro',
            accountNumber: '8901234',
            balance: 750000,
            isActive: false,
            isVisible: false,
            phase: 'Funded'
          },
          {
            id: '9',
            type: 'funded',
            program: 'Royal Pro',
            accountNumber: '2345678',
            balance: 1000000,
            isActive: false,
            isVisible: false,
            phase: 'Funded'
          }
        ]
      },
      {
        name: 'Knight',
        accounts: [
          {
            id: '10',
            type: 'funded',
            program: 'Knight',
            accountNumber: '3456789',
            balance: 500000,
            isActive: true,
            isVisible: true,
            phase: 'Funded'
          },
          {
            id: '11',
            type: 'funded',
            program: 'Knight',
            accountNumber: '6789012',
            balance: 750000,
            isActive: false,
            isVisible: false,
            phase: 'Funded'
          },
          {
            id: '12',
            type: 'funded',
            program: 'Knight',
            accountNumber: '9012345',
            balance: 1000000,
            isActive: false,
            isVisible: false,
            phase: 'Funded'
          }
        ]
      }
    ]
  }
]

export default function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Charts')
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [accounts, setAccounts] = useState<AccountGroup[]>(initialAccounts)

  const handleUpdateAccounts = (updatedAccounts: AccountGroup[]) => {
    setAccounts(updatedAccounts)
  }

  return (
    <div className={`left-sidebar ${collapsed ? 'w-16' : 'w-64'} h-full border-r border-background-alpha bg-background-primary flex flex-col transition-all duration-500 ease-in-out relative`}>
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background-primary border border-background-alpha rounded-full flex items-center justify-center shadow-md hover:bg-background-alpha transition-all duration-300 ease-in-out z-10"
      >
        {collapsed ? 
          <ChevronRight size={18} className="text-primary" /> : 
          <ChevronLeft size={18} className="text-primary" />
        }
      </button>

      {/* Logo Section */}
      <div className="p-4 border-b border-background-alpha">
        <div className="flex items-center gap-2">
          <Crown size={24} className="text-accent-blue" />
          {!collapsed && <span className="text-lg font-semibold">Royal Trader</span>}
        </div>
      </div>

      {/* Account Tree */}
      <AccountTree 
        collapsed={collapsed}
        onManageAccounts={() => setIsManageModalOpen(true)}
        accounts={accounts}
      />

      {/* Navigation Items */}
      <div className="flex-1 space-y-1 p-4">
        <SidebarItem 
          icon={<BarChart2 size={18} />} 
          title="Charts" 
          active={activeItem === 'Charts'}
          onClick={() => setActiveItem('Charts')}
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<Shield size={18} />} 
          title="Risk Management" 
          active={activeItem === 'Risk Management'}
          onClick={() => setActiveItem('Risk Management')}
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<Calendar size={18} />} 
          title="Economic Calendar" 
          active={activeItem === 'Economic Calendar'}
          onClick={() => setActiveItem('Economic Calendar')}
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<Clock size={18} />} 
          title="Trading History & Report" 
          active={activeItem === 'Trading History & Report'}
          onClick={() => setActiveItem('Trading History & Report')}
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<Settings size={18} />} 
          title="Settings" 
          active={activeItem === 'Settings'}
          onClick={() => setActiveItem('Settings')}
          collapsed={collapsed}
        />
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

function SidebarItem({ 
  icon, 
  title, 
  active = false,
  collapsed = false,
  onClick
}: { 
  icon: React.ReactNode, 
  title: string, 
  active?: boolean,
  collapsed?: boolean,
  onClick?: () => void
}) {
  return (
    <div 
      className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
        active 
          ? 'bg-accent-blue/10 text-accent-blue' 
          : 'hover:bg-background-alpha text-primary'
      }`}
      title={collapsed ? title : undefined}
      onClick={onClick}
    >
      <div className={active ? 'text-accent-blue' : 'text-primary'}>{icon}</div>
      {!collapsed && <span>{title}</span>}
    </div>
  )
}
