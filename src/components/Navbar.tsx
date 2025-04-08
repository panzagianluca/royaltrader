import { Bell, User, Sun, Moon } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="h-16 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Royal Trader</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
        </button>
        
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <User size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
