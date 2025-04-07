import { TrendingUp, TrendingDown, Calculator, Calendar, Newspaper } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import AccountSelector from './AccountSelector'

export default function RightSidebar() {
  const [accountSectionHeight, setAccountSectionHeight] = useState('50%')
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isResizing) return
    
    const sidebar = e.currentTarget.parentElement
    if (!sidebar) return
    
    const rect = sidebar.getBoundingClientRect()
    const newHeight = ((e.clientY - rect.top) / rect.height) * 100
    
    // Limit the height between 30% and 70% of the sidebar
    const clampedHeight = Math.min(Math.max(newHeight, 30), 70)
    setAccountSectionHeight(`${clampedHeight}%`)
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Change useState to useEffect for event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsResizing(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const sidebar = document.querySelector('.right-sidebar');
        if (!sidebar) return;
        
        const rect = sidebar.getBoundingClientRect();
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        
        const clampedHeight = Math.min(Math.max(newHeight, 30), 70);
        setAccountSectionHeight(`${clampedHeight}%`);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isResizing]);

  return (
    <div 
      className="right-sidebar w-64 border-l dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto flex flex-col"
    >
      <div style={{ height: accountSectionHeight, minHeight: '200px' }}>
        <AccountSelector />
      </div>

      <div 
        className="h-1 bg-gray-200 dark:bg-gray-700 cursor-row-resize hover:bg-gray-300 dark:hover:bg-gray-600"
        onMouseDown={handleMouseDown}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Order Entry</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex space-x-2">
            <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
              Buy
            </button>
            <button className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Sell
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0.1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Take Profit</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="1.0850"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Stop Loss</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="1.0750"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SidebarItem icon={<Calculator size={18} />} title="Position Calculator" />
          <SidebarItem icon={<TrendingUp size={18} />} title="Risk/Reward" />
          <SidebarItem icon={<Newspaper size={18} />} title="News Feed" />
          <SidebarItem icon={<Calendar size={18} />} title="Economic Calendar" />
        </div>
      </div>
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
