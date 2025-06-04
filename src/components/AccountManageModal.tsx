import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

interface Account {
  id: string
  accountNumber: string
  balance: number
  type: 'demo' | 'live'
  isVisible?: boolean
  isActive?: boolean
}

interface AccountManageModalProps {
  isOpen: boolean
  onClose: () => void
  accounts: Account[]
  onUpdateAccounts: (accounts: Account[]) => void
}

export default function AccountManageModal({ 
  isOpen, 
  onClose, 
  accounts,
  onUpdateAccounts 
}: AccountManageModalProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')

  const toggleAccountVisibility = (accountId: string) => {
    const updatedAccounts = accounts.map(account => 
      account.id === accountId 
        ? { ...account, isVisible: !account.isVisible }
        : account
    )
    onUpdateAccounts(updatedAccounts)
  }

  const activeAccounts = accounts.filter(account => account.isActive !== false)
  const inactiveAccounts = accounts.filter(account => account.isActive === false)
  const displayedAccounts = activeTab === 'active' ? activeAccounts : inactiveAccounts

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background-primary rounded-lg shadow-xl w-[800px] h-[500px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-7">
          <h2 className="text-lg">Manage Accounts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-3 rounded transition-colors"
          >
            <X size={18} className="text-gray-12" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Segmented Control */}
          <div className="p-4 border-b border-gray-7">
            <div className="flex rounded-lg bg-gray-3 p-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                  activeTab === 'active'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-11 hover:text-gray-12'
                }`}
              >
                Active Accounts ({activeAccounts.length})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                  activeTab === 'inactive'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-11 hover:text-gray-12'
                }`}
              >
                Inactive Accounts ({inactiveAccounts.length})
              </button>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-gutter-stable">
            <div className="h-auto">
              <table className="w-full">
                <thead className="bg-background-primary border-b border-gray-7">
                  <tr className="text-xs text-gray-11">
                    <th className="w-1/3 text-center pb-2">Account Number</th>
                    <th className="w-1/3 text-center pb-2">Account Type</th>
                    <th className="w-1/3 text-center pb-2">Balance</th>
                    <th className="w-20 text-center pb-2">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-7">
                  {displayedAccounts.map(account => (
                    <tr key={account.id} className="text-sm">
                      <td className="py-2 text-center">
                        <span className="font-medium">{account.accountNumber}</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          account.type === 'live'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-gray-11/10 text-gray-11'
                        }`}>
                          {account.type === 'live' ? 'Live Account' : 'Demo Account'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="font-medium">${account.balance.toLocaleString()}</span>
                      </td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => toggleAccountVisibility(account.id)}
                          className="p-1 hover:bg-gray-3 rounded transition-colors"
                        >
                          {account.isVisible !== false ? (
                            <Eye size={16} className="text-blue-500" />
                          ) : (
                            <EyeOff size={16} className="text-gray-11 opacity-50" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-7 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm hover:bg-gray-3 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 