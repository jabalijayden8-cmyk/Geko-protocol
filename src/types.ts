export interface AssetInfo {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
}

export interface MarketData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Balance {
  symbol: string;
  amount: number;
  usdValue: number;
}

export interface ProtocolBalance {
  protocol: string;
  positions: Array<{
    symbol: string;
    amount: number;
    usdValue: number;
  }>;
}

export interface Transaction {
  hash: string;
  type: 'send' | 'receive';
  asset: string;
  amount: number;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface WalletData {
  address: string;
  source: string;
  chainType: 'evm' | 'svm';
  balances: Balance[];
  history: Transaction[];
  protocolBalances: ProtocolBalance[];
}

export interface ActiveTrade {
  id: string;
  symbol: string;
  userName: string;
  direction: 'up' | 'down';
  amount: string;
  entryPrice: number;
  startTime: number;
  duration: number;
  status: 'pending' | 'won' | 'lost';
  isBot: boolean;
  forceOutcome?: 'win' | 'loss';
}

export interface LiveTx {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
}
