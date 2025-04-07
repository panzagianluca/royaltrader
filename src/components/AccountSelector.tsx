import { ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { useState } from 'react';

interface Account {
  id: string;
  number: string;
  userName: string;
}

interface AccountCategory {
  id: string;
  name: string;
  accounts: Account[];
}

const mockAccountData: AccountCategory[] = [
  {
    id: '1',
    name: 'Royal Pro Challenge',
    accounts: [
      { id: '1-1', number: '92561234', userName: 'Gianluca Panza' },
      { id: '1-2', number: '81774321', userName: 'Gianluca Panza' },
    ],
  },
  {
    id: '2',
    name: 'Royal Pro Funded',
    accounts: [
      { id: '2-1', number: '12345678', userName: 'Gianluca Panza' },
    ],
  },
  {
    id: '3',
    name: 'Dragon Funded',
    accounts: [
      { id: '3-1', number: '87654321', userName: 'Gianluca Panza' },
    ],
  },
];

export default function AccountSelector() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [activeAccount, setActiveAccount] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAccountClick = (accountId: string) => {
    setActiveAccount(accountId);
    // TODO: Implement account switching logic
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold dark:text-white">Accounts</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {mockAccountData.map((category) => (
          <div key={category.id} className="mb-2">
            <div
              className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => toggleCategory(category.id)}
            >
              {expandedCategories.has(category.id) ? (
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
              )}
              <span className="dark:text-white truncate">{category.name}</span>
            </div>
            
            {expandedCategories.has(category.id) && (
              <div className="ml-4 space-y-1">
                {category.accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      activeAccount === account.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <span className="text-sm dark:text-gray-300 truncate">
                      {account.number}: {account.userName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <button
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => {
            // TODO: Implement manage accounts modal
          }}
        >
          <Settings size={16} />
          <span>Manage Accounts</span>
        </button>
      </div>
    </div>
  );
}
