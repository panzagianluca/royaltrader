import React, { useState, useEffect } from 'react'
import { Theme } from '@radix-ui/themes'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import Chart from './Chart'
import TopNav from './TopNav'
import BottomBanner from './BottomBanner'
import { themeConfig } from '../styles/theme'
import '@radix-ui/themes/styles.css'
import '../styles/theme.css'

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)

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
        <div className="flex-1 flex">
          <div className="flex-1">
            {isClient ? <Chart darkMode={darkMode} /> : <div className="flex-1 bg-white dark:bg-gray-900" />}
          </div>
          <RightSidebar 
            collapsed={rightSidebarCollapsed}
            onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          />
        </div>
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
