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
    <div className={`right-sidebar ${collapsed ? 'w-16' : 'w-80'} h-full border-l dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col transition-all duration-300 relative`}>
      <button 
        onClick={onToggleCollapse}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
      >
        {collapsed ? <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" /> : <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />}
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
