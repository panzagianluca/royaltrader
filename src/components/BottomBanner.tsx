import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import PositionsTable from './PositionsTable';

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
            {isExpanded && (
              <ToggleGroup type="single" value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
                {tabs.map(tab => (
                  <ToggleGroupItem key={tab} value={tab} aria-label={`Select ${tab}`} className="data-[state=on]:bg-transparent data-[state=on]:border-b-2 data-[state=on]:border-primary data-[state=on]:text-primary rounded-none">
                    {tab}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
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
        <div className={`flex-1 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded && (
            <div className="p-4 h-full">
              {activeTab === 'Positions' && <PositionsTable />}
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
