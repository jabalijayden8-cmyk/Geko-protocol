import { Balance, Transaction, ProtocolBalance } from '../types';

class UniversalWallet {
  async fetchAddressBalance(address: string): Promise<Balance[]> {
    const isEVM = address.startsWith('0x');

    if (isEVM) {
      return this.fetchEVMBalance(address);
    } else {
      return this.fetchSolanaBalance(address);
    }
  }

  private async fetchEVMBalance(address: string): Promise<Balance[]> {
    try {
      const response = await fetch(
        `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
      );
      const data = await response.json();

      const balances: Balance[] = [];

      if (data.ETH?.balance) {
        balances.push({
          symbol: 'ETH',
          amount: data.ETH.balance,
          usdValue: data.ETH.balance * (data.ETH.price?.rate || 0),
        });
      }

      if (data.tokens && Array.isArray(data.tokens)) {
        data.tokens.forEach((token: any) => {
          const amount = token.balance / Math.pow(10, token.tokenInfo.decimals);
          balances.push({
            symbol: token.tokenInfo.symbol,
            amount,
            usdValue: amount * (token.tokenInfo.price?.rate || 0),
          });
        });
      }

      return balances.length > 0 ? balances : this.getMockBalances();
    } catch (error) {
      console.error('Failed to fetch EVM balance:', error);
      return this.getMockBalances();
    }
  }

  private async fetchSolanaBalance(address: string): Promise<Balance[]> {
    return this.getMockBalances();
  }

  private getMockBalances(): Balance[] {
    return [
      { symbol: 'ETH', amount: 1.5, usdValue: 4425 },
      { symbol: 'USDT', amount: 5000, usdValue: 5000 },
      { symbol: 'BTC', amount: 0.1, usdValue: 8293 },
    ];
  }

  async fetchTransactionHistory(address: string): Promise<Transaction[]> {
    return [
      {
        hash: '0x123...abc',
        type: 'receive',
        asset: 'ETH',
        amount: 0.5,
        timestamp: Date.now() - 3600000,
        status: 'confirmed',
      },
      {
        hash: '0x456...def',
        type: 'send',
        asset: 'USDT',
        amount: 1000,
        timestamp: Date.now() - 7200000,
        status: 'confirmed',
      },
    ];
  }

  async fetchProtocolBalances(address: string): Promise<ProtocolBalance[]> {
    return [
      {
        protocol: 'Uniswap',
        positions: [
          { symbol: 'ETH-USDT LP', amount: 1.2, usdValue: 3540 },
        ],
      },
      {
        protocol: 'Aave',
        positions: [
          { symbol: 'aUSDT', amount: 2000, usdValue: 2000 },
        ],
      },
    ];
  }
}

export const universalWallet = new UniversalWallet();
