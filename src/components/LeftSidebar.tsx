import { useState } from 'react'
import { BarChart2, Shield, Clock, Settings, ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react'

export default function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Charts')
  const [showAccounts, setShowAccounts] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState('Account #123456')

  const accounts = [
    'Account #123456',
    'Account #789012',
    'Account #345678'
  ]

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} border-r dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto transition-all duration-300`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          {!collapsed && (
            <div className="relative w-full">
              <button 
                onClick={() => setShowAccounts(!showAccounts)}
                className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="font-medium dark:text-white">{selectedAccount}</span>
                <ChevronDown size={16} className="dark:text-white" />
              </button>
              
              {showAccounts && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg">
                  {accounts.map(account => (
                    <div 
                      key={account}
                      onClick={() => {
                        setSelectedAccount(account)
                        setShowAccounts(false)
                      }}
                      className={`px-3 py-2 cursor-pointer ${account === selectedAccount ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      <span className="dark:text-white">{account}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="space-y-4">
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
      </div>
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
      className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${active ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      title={collapsed ? title : undefined}
      onClick={onClick}
    >
      <div className="text-blue-500 dark:text-blue-400">{icon}</div>
      {!collapsed && <span className="dark:text-white">{title}</span>}
    </div>
  )
}
