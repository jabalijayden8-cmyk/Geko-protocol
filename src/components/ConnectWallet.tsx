import React, { useState } from 'react';
import { WalletData } from '../types';

export type ConnectMode = 'wallet' | 'manual';

interface ConnectWalletProps {
  onConnect: (data: WalletData | string, email?: string) => void;
  onClose: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect, onClose }) => {
  const [mode, setMode] = useState<ConnectMode>('wallet');
  const [manualAddress, setManualAddress] = useState('');

  const handleWalletConnect = async (walletType: string) => {
    const mockWallet: WalletData = {
      address: '0x' + Math.random().toString(36).substring(2, 42).padEnd(40, '0'),
      source: walletType,
      chainType: 'evm',
      balances: [
        { symbol: 'ETH', amount: 1.5, usdValue: 4425 },
        { symbol: 'USDT', amount: 5000, usdValue: 5000 },
      ],
      history: [],
      protocolBalances: [],
    };

    onConnect(mockWallet);
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualAddress) {
      onConnect(manualAddress);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-[#2B3139] flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('wallet')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                mode === 'wallet'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#0B0E11] text-gray-400 hover:text-white'
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                mode === 'manual'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#0B0E11] text-gray-400 hover:text-white'
              }`}
            >
              Manual
            </button>
          </div>

          {mode === 'wallet' ? (
            <div className="space-y-3">
              {['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Phantom'].map((wallet) => (
                <button
                  key={wallet}
                  onClick={() => handleWalletConnect(wallet)}
                  className="w-full p-4 bg-[#0B0E11] hover:bg-[#2B3139] border border-[#2B3139] rounded-xl text-left font-bold transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>{wallet}</span>
                    <span className="text-gray-600 group-hover:text-indigo-400 transition-colors">→</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleManualConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0E11] border border-[#2B3139] rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                  placeholder="0x... or Solana address"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black text-sm uppercase tracking-wider transition-colors"
              >
                Connect
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
