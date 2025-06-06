import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import OrderEntry from './OrderEntry'
import Watchlist from './Watchlist'

interface RightSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function RightSidebar({ collapsed, onToggleCollapse }: RightSidebarProps) {
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
        const sidebar = document.querySelector('.right-sidebar')
        if (!sidebar) return
        
        const rect = sidebar.getBoundingClientRect()
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100
        
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
    <div className={`right-sidebar ${collapsed ? 'w-0' : 'w-96'} h-full border-l border-gray-7 bg-background flex flex-col transition-all duration-500 ease-in-out relative`}>
      <button 
        onClick={onToggleCollapse}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background border border-gray-7 rounded-full flex items-center justify-center shadow-md hover:bg-gray-3 transition-all duration-300 ease-in-out z-10"
      >
        {collapsed ? 
          <ChevronLeft size={18} className="text-gray-12" /> : 
          <ChevronRight size={18} className="text-gray-12" />
        }
      </button>
      
      {!collapsed && (
        <>
          <div className="flex-1 overflow-hidden" style={{ height: accountSectionHeight }}>
            <Watchlist />
          </div>
          
          <div 
            className="h-1 bg-gray-200 dark:bg-gray-700 cursor-row-resize hover:bg-gray-300 dark:hover:bg-gray-600"
            onMouseDown={handleMouseDown}
          />
          
          <div className="flex-1 overflow-y-auto">
            <OrderEntry />
          </div>
        </>
      )}
    </div>
  )
}
