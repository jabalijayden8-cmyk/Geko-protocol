import React, { useState } from 'react';
import { WalletData } from '../types';

interface LandingPageProps {
  onLoginSuccess: (wallet: WalletData & { email?: string }) => void;
  onConnectWalletClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess, onConnectWalletClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const mockWallet: WalletData = {
      address: '0x' + Math.random().toString(36).substring(2, 15),
      source: 'Email Login',
      chainType: 'evm',
      balances: [
        { symbol: 'ETH', amount: 2.5, usdValue: 7375 },
        { symbol: 'USDT', amount: 10000, usdValue: 10000 },
      ],
      history: [],
      protocolBalances: [],
    };

    onLoginSuccess({ ...mockWallet, email });
  };

  return (
    <div className="fixed inset-0 bg-[#0B0E11] flex items-center justify-center p-6 overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-purple-900/10"></div>

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-12">
          <div className="inline-block w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
            <span className="font-black italic text-3xl text-white">G</span>
          </div>
          <h1 className="text-4xl font-black italic mb-3 uppercase tracking-tight">Geko Protocols</h1>
          <p className="text-gray-400 text-sm">Institutional Digital Asset Terminal</p>
        </div>

        <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0E11] border border-[#2B3139] rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0E11] border border-[#2B3139] rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black text-sm uppercase tracking-wider transition-colors shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2B3139]">
            <button
              onClick={onConnectWalletClick}
              className="w-full py-4 bg-[#0B0E11] hover:bg-[#181C25] border-2 border-[#2B3139] hover:border-indigo-500 rounded-xl font-black text-sm uppercase tracking-wider transition-all"
            >
              Connect Wallet
            </button>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-400 transition-colors">
              Don't have an account? Sign up
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};
