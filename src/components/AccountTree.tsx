import { useState } from 'react'
import { ChevronRight, ChevronDown, Settings, Crown } from 'lucide-react'

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

interface AccountTreeProps {
  collapsed?: boolean
  onManageAccounts: () => void
  accounts: AccountGroup[]
}

export default function AccountTree({ collapsed = false, onManageAccounts, accounts }: AccountTreeProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['challenge', 'funded'])
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>(['Royal Pro', 'Knight', 'Dragon'])
  const [activeAccount, setActiveAccount] = useState<string>('1') // Default to first account

  const toggleGroup = (type: string) => {
    setExpandedGroups(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleProgram = (program: string) => {
    setExpandedPrograms(prev => 
      prev.includes(program) 
        ? prev.filter(p => p !== program)
        : [...prev, program]
    )
  }

  if (collapsed) {
    const activeAccountData = accounts
      .flatMap(group => group.programs)
      .flatMap(program => program.accounts)
      .find(account => account.id === activeAccount)

    return (
      <div className="p-2">
        <div className="bg-accent-blue/10 rounded-lg p-2">
          <Crown size={18} className="text-accent-blue mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Accounts</h2>
        <button
          onClick={onManageAccounts}
          className="p-1 hover:bg-background-alpha rounded transition-colors"
          title="Manage Accounts"
        >
          <Settings size={16} className="text-primary" />
        </button>
      </div>

      <div className="space-y-2">
        {accounts.map(group => (
          <div key={group.type} className="space-y-1">
            <button
              onClick={() => toggleGroup(group.type)}
              className="flex items-center gap-1 w-full hover:bg-background-alpha/50 rounded p-1 transition-colors"
            >
              {expandedGroups.includes(group.type) ? (
                <ChevronDown size={14} className="text-primary" />
              ) : (
                <ChevronRight size={14} className="text-primary" />
              )}
              <span className="text-xs font-medium">{group.label}</span>
            </button>

            {expandedGroups.includes(group.type) && (
              <div className="ml-2 space-y-1">
                {group.programs.map(program => (
                  <div key={program.name}>
                    <button
                      onClick={() => toggleProgram(program.name)}
                      className="flex items-center gap-1 w-full hover:bg-background-alpha/50 rounded p-1 transition-colors"
                    >
                      {expandedPrograms.includes(program.name) ? (
                        <ChevronDown size={14} className="text-primary" />
                      ) : (
                        <ChevronRight size={14} className="text-primary" />
                      )}
                      <span className="text-xs">{program.name}</span>
                    </button>

                    {expandedPrograms.includes(program.name) && (
                      <div className="ml-4 space-y-1">
                        {program.accounts
                          .filter(account => account.isVisible)
                          .map(account => (
                            <button
                              key={account.id}
                              onClick={() => setActiveAccount(account.id)}
                              className={`flex items-center justify-between w-full p-2 rounded text-xs transition-colors ${
                                activeAccount === account.id
                                  ? 'bg-accent-blue/10 text-accent-blue font-medium shadow-sm border border-accent-blue/20'
                                  : 'hover:bg-background-alpha/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{account.accountNumber}</span>
                                <span className="text-gray-11">${account.balance.toLocaleString()}</span>
                              </div>
                              {account.isActive && (
                                <span className="text-xs text-accent-blue font-medium px-2 py-0.5 bg-accent-blue/10 rounded-full">Active</span>
                              )}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 