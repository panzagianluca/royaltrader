export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  equity: number;
  dailyPnl: number;
  dailyStopLevel: number;
  type: 'live' | 'demo';
  isVisible: boolean;
  isActive: boolean;
}

export const accountsData: Account[] = [
  {
    id: '1',
    accountNumber: '123456',
    balance: 10000,
    equity: 10500,
    dailyPnl: 500,
    dailyStopLevel: 10000 * 0.05,
    type: 'live',
    isVisible: true,
    isActive: true,
  },
  {
    id: '2',
    accountNumber: '789012',
    balance: 5000,
    equity: 4800,
    dailyPnl: -200,
    dailyStopLevel: 5000 * 0.05,
    type: 'demo',
    isVisible: true,
    isActive: true,
  },
  {
    id: '3',
    accountNumber: '345678',
    balance: 25000,
    equity: 25000,
    dailyPnl: 0,
    dailyStopLevel: 25000 * 0.05,
    type: 'live',
    isVisible: false,
    isActive: true,
  },
  {
    id: '4',
    accountNumber: '901234',
    balance: 2000,
    equity: 2100,
    dailyPnl: 100,
    dailyStopLevel: 2000 * 0.05,
    type: 'demo',
    isVisible: true,
    isActive: false,
  },
]; 