import { Sun, Moon, Ruler, CandlestickChart, LineChart, Settings, Bell, User } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export default function TopNav({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (mode: boolean) => void }) {
  const toggleTheme = () => {
    setDarkMode(!darkMode)
    // Update document class for Tailwind dark mode
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-7 bg-background-primary">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-9 mr-8">
          Royal Trader
        </h1>

        {/* Chart Tools */}
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
            <CandlestickChart size={18} className="text-gray-12" />
          </button>
          <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
            <LineChart size={18} className="text-gray-12" />
          </button>
          <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
            <Ruler size={18} className="text-gray-12" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Controls */}
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleTheme}
                  className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center"
                >
                  {darkMode ? <Sun size={18} className="text-gray-12" /> : <Moon size={18} className="text-gray-12" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
            <Settings size={18} className="text-gray-12" />
          </button>
          <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
            <Bell size={18} className="text-gray-12" />
          </button>
          <button className="p-1 rounded hover:bg-gray-3 h-8 w-8 flex items-center justify-center">
            <User size={18} className="text-gray-12" />
          </button>
        </div>
      </div>
    </div>
  )
}
