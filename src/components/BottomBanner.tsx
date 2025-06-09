import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react';

interface BottomBannerProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

type Tab = 'Positions' | 'Orders' | 'History' | 'Alerts';

export default function BottomBanner({ isExpanded, onToggleExpand }: BottomBannerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Positions');

  const tabs: Tab[] = ['Positions', 'Orders', 'History', 'Alerts'];

  return (
    <div className={`transition-all duration-500 ease-in-out bg-background rounded-md ${isExpanded ? 'h-full' : 'h-[40px]'}`}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-[40px] px-4">
          <div className="flex items-center">
            {isExpanded && tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors duration-300 ease-in-out rounded-t-md ${
                  activeTab === tab 
                    ? 'bg-background-alpha text-primary' 
                    : 'text-muted-foreground hover:bg-background-alpha/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button 
            onClick={onToggleExpand}
            className="p-1 hover:bg-background-alpha rounded transition-all duration-300 ease-in-out"
          >
            {isExpanded ? 
              <ChevronDown size={18} className="text-primary transition-transform duration-500 ease-in-out" /> : 
              <ChevronUp size={18} className="text-primary transition-transform duration-500 ease-in-out" />
            }
          </button>
        </div>
        <div className={`flex-1 transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded && (
            <div className="p-4 h-full">
              {activeTab === 'Positions' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-background-alpha/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Open Positions</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="bg-background-alpha/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Pending Orders</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="bg-background-alpha/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Account Balance</h3>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                </div>
              )}
              {activeTab === 'Orders' && <div>Orders Content</div>}
              {activeTab === 'History' && <div>History Content</div>}
              {activeTab === 'Alerts' && <div>Alerts Content</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
