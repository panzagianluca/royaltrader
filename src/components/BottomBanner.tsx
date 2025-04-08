import { ChevronUp, ChevronDown } from 'lucide-react'

interface BottomBannerProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

export default function BottomBanner({ isExpanded, onToggleExpand }: BottomBannerProps) {
  return (
    <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'h-[200px]' : 'h-[40px]'}`}>
      <div className="h-full bg-background-primary border-t border-background-alpha">
        <div className="flex items-center justify-between h-[40px] px-4">
          <h2 className="text-sm font-medium">Trading Terminal</h2>
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
        <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {isExpanded && (
            <div className="p-4">
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
