import { ChevronLeft, ChevronRight } from 'lucide-react'
import OrderEntry from './OrderEntry'
import Watchlist from './Watchlist'

interface RightSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function RightSidebar({ collapsed, onToggleCollapse }: RightSidebarProps) {
  return (
    <div className={`right-sidebar ${collapsed ? 'w-16' : 'w-[400px]'} h-full border-l border-background-alpha bg-background-primary flex flex-col transition-all duration-500 ease-in-out relative`}>
      <button 
        onClick={onToggleCollapse}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background-primary border border-background-alpha rounded-full flex items-center justify-center shadow-md hover:bg-background-alpha transition-all duration-300 ease-in-out z-10"
      >
        {collapsed ? 
          <ChevronLeft size={18} className="text-primary transition-transform duration-500 ease-in-out" /> : 
          <ChevronRight size={18} className="text-primary transition-transform duration-500 ease-in-out" />
        }
      </button>
      {!collapsed && (
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0">
            <Watchlist />
          </div>
          <div className="border-t border-background-alpha">
            <OrderEntry />
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="text-blue-500 dark:text-blue-400">{icon}</div>
      <span className="dark:text-white">{title}</span>
    </div>
  )
}
