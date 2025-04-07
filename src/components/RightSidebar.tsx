import { TrendingUp, TrendingDown, Calculator, Calendar, Newspaper } from 'lucide-react'

export default function RightSidebar() {
  return (
    <div className="w-64 border-l dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
      <div className="p-4">
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
