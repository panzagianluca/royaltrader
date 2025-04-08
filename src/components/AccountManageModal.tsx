import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

interface Account {
  id: string
  type: 'challenge' | 'funded'
  program: 'Royal Pro' | 'Dragon' | 'Knight'
  accountNumber: string
  balance: number
  isActive: boolean
  isVisible: boolean
  phase: 'Phase 1' | 'Phase 2' | 'Funded'
}

interface AccountGroup {
  type: 'challenge' | 'funded'
  label: string
  programs: {
    name: string
    accounts: Account[]
  }[]
}

interface AccountManageModalProps {
  isOpen: boolean
  onClose: () => void
  accounts: AccountGroup[]
  onUpdateAccounts: (accounts: AccountGroup[]) => void
}

export default function AccountManageModal({ 
  isOpen, 
  onClose, 
  accounts,
  onUpdateAccounts 
}: AccountManageModalProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')

  const toggleAccountVisibility = (accountId: string) => {
    const updatedAccounts = accounts.map(group => ({
      ...group,
      programs: group.programs.map(program => ({
        ...program,
        accounts: program.accounts.map(account => 
          account.id === accountId 
            ? { ...account, isVisible: !account.isVisible }
            : account
        )
      }))
    }))
    onUpdateAccounts(updatedAccounts)
  }

  const allAccounts = accounts
    .flatMap(group => group.programs)
    .flatMap(program => program.accounts)

  const activeAccounts = allAccounts.filter(account => account.isActive)
  const inactiveAccounts = allAccounts.filter(account => !account.isActive)

  const displayedAccounts = activeTab === 'active' ? activeAccounts : inactiveAccounts

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background-primary rounded-lg shadow-xl w-[800px] h-[500px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-background-alpha">
          <h2 className="text-lg font-semibold">Manage Accounts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background-alpha rounded transition-colors"
          >
            <X size={18} className="text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Segmented Control */}
          <div className="p-4 border-b border-background-alpha">
            <div className="flex rounded-lg bg-background-alpha/50 p-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                  activeTab === 'active'
                    ? 'bg-accent-blue text-white'
                    : 'text-gray-11 hover:text-primary'
                }`}
              >
                Active Accounts ({activeAccounts.length})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                  activeTab === 'inactive'
                    ? 'bg-accent-blue text-white'
                    : 'text-gray-11 hover:text-primary'
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
                <thead className="bg-background-primary border-b border-background-alpha">
                  <tr className="text-xs text-gray-11">
                    <th className="w-1/4 text-center pb-2">Account Number</th>
                    <th className="w-1/4 text-center pb-2">Account Type</th>
                    <th className="w-1/4 text-center pb-2">Phase</th>
                    <th className="w-1/4 text-center pb-2">Balance</th>
                    <th className="w-20 text-center pb-2">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background-alpha">
                  {displayedAccounts.map(account => (
                    <tr key={account.id} className="text-sm">
                      <td className="py-2 text-center">
                        <span className="font-medium">{account.accountNumber}</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          account.program === 'Royal Pro'
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : account.program === 'Dragon'
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {account.program}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          account.phase === 'Funded'
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : 'bg-gray-11/10 text-gray-11'
                        }`}>
                          {account.phase}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="font-medium">${account.balance.toLocaleString()}</span>
                      </td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => toggleAccountVisibility(account.id)}
                          className="p-1 hover:bg-background-alpha rounded transition-colors"
                        >
                          {account.isVisible ? (
                            <Eye size={16} className="text-accent-blue" />
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

        <div className="p-4 border-t border-background-alpha flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm hover:bg-background-alpha transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 