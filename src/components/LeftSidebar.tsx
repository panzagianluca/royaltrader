import { useState, useCallback, useEffect } from 'react'
import { BarChart2, Shield, Clock, Settings, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import AccountSelector from './AccountSelector'

export default function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Charts')
  const [accountSectionHeight, setAccountSectionHeight] = useState('50%')
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsResizing(false)
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const sidebar = document.querySelector('.left-sidebar')
        if (!sidebar) return
        
        const rect = sidebar.getBoundingClientRect()
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100
        
        // Limit the height between 30% and 70% of the sidebar
        const clampedHeight = Math.min(Math.max(newHeight, 30), 70)
        setAccountSectionHeight(`${clampedHeight}%`)
      }
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('mousemove', handleGlobalMouseMove)

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [isResizing])

  return (
    <div className={`left-sidebar ${collapsed ? 'w-16' : 'w-64'} border-r dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col transition-all duration-300`}>
      <div style={{ height: accountSectionHeight }} className="min-h-[200px]">
        {!collapsed && <AccountSelector />}
      </div>

      <div 
        className="h-1 bg-gray-200 dark:bg-gray-700 cursor-row-resize hover:bg-gray-300 dark:hover:bg-gray-600"
        onMouseDown={handleMouseDown}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? <ChevronRight size={18} className="dark:text-white" /> : <ChevronLeft size={18} className="dark:text-white" />}
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
