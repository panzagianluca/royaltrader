import { Sun, Moon, Ruler, CandlestickChart, LineChart, Settings, Bell, User } from 'lucide-react'

export default function TopNav({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (mode: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-2 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 mr-8">
          Royal Trader
        </h1>

        {/* Chart Tools */}
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <CandlestickChart size={18} className="dark:text-white" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <LineChart size={18} className="dark:text-white" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Ruler size={18} className="dark:text-white" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Controls */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={18} className="dark:text-white" /> : <Moon size={18} />}
          </button>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} className="dark:text-white" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell size={18} className="dark:text-white" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <User size={18} className="dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
