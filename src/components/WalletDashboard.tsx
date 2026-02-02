import React from 'react';
import { WalletData } from '../types';

interface WalletDashboardProps {
  wallet: WalletData & { email?: string };
  onClose: () => void;
  onDisconnect: () => void;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({ wallet, onClose, onDisconnect }) => {
  const totalValue = wallet.balances.reduce((sum, b) => sum + b.usdValue, 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#2B3139] flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight">Wallet Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-[#0B0E11] rounded-xl p-6 border border-[#2B3139]">
            <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
              Total Balance
            </div>
            <div className="text-3xl font-black">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            {wallet.email && (
              <div className="text-sm text-gray-400 mt-2">{wallet.email}</div>
            )}
          </div>

          <div>
            <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Address
            </div>
            <div className="bg-[#0B0E11] rounded-xl p-4 border border-[#2B3139] font-mono text-sm break-all">
              {wallet.address}
            </div>
            <div className="text-xs text-gray-500 mt-2">Source: {wallet.source}</div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Balances
            </div>
            <div className="space-y-2">
              {wallet.balances.map((balance, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B0E11] rounded-xl p-4 border border-[#2B3139] flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold">{balance.symbol}</div>
                    <div className="text-sm text-gray-400">
                      {balance.amount.toFixed(6)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      ${balance.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {wallet.protocolBalances && wallet.protocolBalances.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                DeFi Positions
              </div>
              <div className="space-y-2">
                {wallet.protocolBalances.map((protocol, idx) => (
                  <div key={idx} className="bg-[#0B0E11] rounded-xl p-4 border border-[#2B3139]">
                    <div className="font-bold mb-2">{protocol.protocol}</div>
                    <div className="space-y-1">
                      {protocol.positions.map((pos, pidx) => (
                        <div key={pidx} className="flex justify-between text-sm">
                          <span className="text-gray-400">{pos.symbol}</span>
                          <span className="font-mono">${pos.usdValue.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#2B3139]">
          <button
            onClick={onDisconnect}
            className="w-full py-4 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-600/30 text-rose-400 rounded-xl font-black text-sm uppercase tracking-wider transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
