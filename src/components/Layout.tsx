import { useState, useEffect } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import ChartArea from './ChartArea'
import TopNav from './TopNav'
import BottomBanner from './BottomBanner'

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`flex flex-col h-screen relative ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <TopNav darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        {isClient ? <ChartArea darkMode={darkMode} /> : <div className="flex-1 bg-white dark:bg-gray-900" />}
      </div>
      <BottomBanner />
      
      {/* LeftSidebar positioned absolutely to overlap */}
      <div className="absolute top-0 left-0 h-full z-10">
        <LeftSidebar />
      </div>
      
      {/* RightSidebar positioned absolutely to overlap */}
      <div className="absolute top-0 right-0 h-full z-10">
        <RightSidebar />
      </div>
    </div>
  )
}
