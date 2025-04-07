import { useState } from 'react'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import Navbar from './components/Navbar'
import Chart from './components/Chart'

function App() {
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <LeftSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 flex">
          <div className="flex-1">
            <Chart />
          </div>
          <RightSidebar 
            collapsed={rightSidebarCollapsed}
            onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
