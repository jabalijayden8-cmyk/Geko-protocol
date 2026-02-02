import React, { useState } from 'react';
import { WalletData, AssetInfo } from '../types';

interface PortfolioViewProps {
  wallet: (WalletData & { email?: string }) | null;
  assets: AssetInfo[];
  depositAddress: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onUpdateWallet: (wallet: WalletData & { email?: string }) => void;
  onRefreshBalances: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  wallet,
  assets,
  depositAddress,
  onConnect,
  onRefreshBalances,
}) => {
  const [showDepositModal, setShowDepositModal] = useState(false);

  if (!wallet) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-gray-500 mb-6">Connect your wallet to view portfolio</div>
          <button
            onClick={onConnect}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black text-sm uppercase tracking-wider transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const totalValue = wallet.balances.reduce((sum, b) => sum + b.usdValue, 0);
  const protocolValue = wallet.protocolBalances?.reduce(
    (sum, p) => sum + p.positions.reduce((pSum, pos) => pSum + pos.usdValue, 0),
    0
  ) || 0;

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Total Portfolio Value
              </div>
              <div className="text-4xl font-black">
                ${(totalValue + protocolValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(true)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors"
              >
                Deposit
              </button>
              <button
                onClick={onRefreshBalances}
                className="px-6 py-3 bg-[#0B0E11] hover:bg-[#2B3139] border border-[#2B3139] rounded-xl font-bold transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0B0E11] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Wallet Balance</div>
              <div className="text-xl font-black">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-[#0B0E11] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">DeFi Positions</div>
              <div className="text-xl font-black">${protocolValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-6">
          <h3 className="text-sm font-black uppercase tracking-wider mb-4">Wallet Balances</h3>
          <div className="space-y-3">
            {wallet.balances.map((balance, idx) => {
              const assetInfo = assets.find(a => a.symbol === balance.symbol);
              return (
                <div
                  key={idx}
                  className="bg-[#0B0E11] rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600/10 rounded-full flex items-center justify-center font-black text-indigo-400">
                      {balance.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold">{balance.symbol}</div>
                      <div className="text-sm text-gray-400">
                        {balance.amount.toFixed(6)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black">
                      ${balance.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {assetInfo && (
                      <div className={`text-sm ${assetInfo.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {assetInfo.change24h >= 0 ? '+' : ''}{assetInfo.change24h.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {wallet.protocolBalances && wallet.protocolBalances.length > 0 && (
          <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider mb-4">DeFi Positions</h3>
            <div className="space-y-4">
              {wallet.protocolBalances.map((protocol, idx) => (
                <div key={idx} className="bg-[#0B0E11] rounded-xl p-4">
                  <div className="font-bold mb-3">{protocol.protocol}</div>
                  <div className="space-y-2">
                    {protocol.positions.map((pos, pidx) => (
                      <div key={pidx} className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{pos.symbol}</span>
                        <div className="text-right">
                          <div className="font-bold text-sm">${pos.usdValue.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{pos.amount.toFixed(6)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {wallet.history && wallet.history.length > 0 && (
          <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider mb-4">Recent Transactions</h3>
            <div className="space-y-2">
              {wallet.history.slice(0, 10).map((tx, idx) => (
                <div key={idx} className="bg-[#0B0E11] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">{tx.type === 'receive' ? 'Received' : 'Sent'}</div>
                    <div className="text-xs text-gray-500 font-mono">{tx.hash}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${tx.type === 'receive' ? 'text-emerald-400' : 'text-gray-100'}`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.asset}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">Deposit</h2>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Deposit Address
                </div>
                <div className="bg-[#0B0E11] rounded-xl p-4 border border-[#2B3139] font-mono text-sm break-all">
                  {depositAddress || wallet.address}
                </div>
              </div>

              <div className="bg-indigo-600/10 border border-indigo-600/30 rounded-xl p-4 text-sm text-indigo-400">
                Send only supported assets to this address. Sending unsupported assets may result in permanent loss.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
