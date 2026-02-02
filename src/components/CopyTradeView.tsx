import React, { useState } from 'react';

interface CopyTradeViewProps {
  onMirror: (traderId: string) => void;
}

interface Trader {
  id: string;
  name: string;
  roi: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  avatar: string;
}

const mockTraders: Trader[] = [
  {
    id: '1',
    name: 'CryptoWhale_91',
    roi: 234.5,
    winRate: 78,
    totalTrades: 1243,
    followers: 15420,
    avatar: 'W',
  },
  {
    id: '2',
    name: 'DiamondHands',
    roi: 189.2,
    winRate: 72,
    totalTrades: 892,
    followers: 9832,
    avatar: 'D',
  },
  {
    id: '3',
    name: 'AlphaSeeker',
    roi: 156.7,
    winRate: 69,
    totalTrades: 756,
    followers: 7651,
    avatar: 'A',
  },
  {
    id: '4',
    name: 'BTCMaximalist',
    roi: 142.3,
    winRate: 65,
    totalTrades: 623,
    followers: 5443,
    avatar: 'B',
  },
];

export const CopyTradeView: React.FC<CopyTradeViewProps> = ({ onMirror }) => {
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Copy Trading</h1>
          <p className="text-gray-400">Mirror top traders and automate your trading strategy</p>
        </div>

        <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0B0E11] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Total Traders</div>
              <div className="text-2xl font-black">8,432</div>
            </div>
            <div className="bg-[#0B0E11] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Avg ROI</div>
              <div className="text-2xl font-black text-emerald-400">+127%</div>
            </div>
            <div className="bg-[#0B0E11] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Active Copies</div>
              <div className="text-2xl font-black">42,891</div>
            </div>
            <div className="bg-[#0B0E11] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Success Rate</div>
              <div className="text-2xl font-black">73%</div>
            </div>
          </div>
        </div>

        <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-6">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Top Traders</h2>

          <div className="space-y-4">
            {mockTraders.map((trader) => (
              <div
                key={trader.id}
                className={`bg-[#0B0E11] rounded-xl p-6 border transition-all ${
                  selectedTrader === trader.id
                    ? 'border-indigo-500'
                    : 'border-[#2B3139] hover:border-[#3B4149]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-black text-xl">
                      {trader.avatar}
                    </div>
                    <div>
                      <div className="font-black text-lg">{trader.name}</div>
                      <div className="text-sm text-gray-500">
                        {trader.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">ROI</div>
                      <div className="text-lg font-black text-emerald-400">+{trader.roi}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                      <div className="text-lg font-black">{trader.winRate}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Trades</div>
                      <div className="text-lg font-black">{trader.totalTrades}</div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTrader(trader.id);
                        onMirror(trader.id);
                      }}
                      className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                        selectedTrader === trader.id
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {selectedTrader === trader.id ? 'Mirroring' : 'Mirror'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-indigo-600/10 border border-indigo-600/30 rounded-2xl p-6">
          <h3 className="font-black mb-2">How Copy Trading Works</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Select a top trader to mirror their positions automatically</li>
            <li>• Set your investment amount and risk parameters</li>
            <li>• Trades are executed in real-time as the trader makes moves</li>
            <li>• Stop mirroring anytime to take full control</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
