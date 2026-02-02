import React, { useState } from 'react';
import { AssetInfo } from '../types';

interface SwapViewProps {
  assets: AssetInfo[];
  isConnected: boolean;
  onConnect: () => void;
  onSignUp: () => void;
  onConfirm: (input: string, callback: () => void) => void;
  onSwap: () => void;
  onDeposit: () => void;
}

const SwapView: React.FC<SwapViewProps> = ({
  assets,
  isConnected,
  onConnect,
  onSwap,
}) => {
  const [fromAsset, setFromAsset] = useState(assets[0]?.symbol || 'BTC');
  const [toAsset, setToAsset] = useState(assets[1]?.symbol || 'ETH');
  const [fromAmount, setFromAmount] = useState('');

  const fromAssetInfo = assets.find(a => a.symbol === fromAsset);
  const toAssetInfo = assets.find(a => a.symbol === toAsset);

  const toAmount = fromAmount && fromAssetInfo && toAssetInfo
    ? ((parseFloat(fromAmount) * fromAssetInfo.price) / toAssetInfo.price).toFixed(6)
    : '';

  const handleSwap = () => {
    if (!fromAmount || !isConnected) return;
    onSwap();
  };

  const handleFlip = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setFromAmount(toAmount);
  };

  return (
    <div className="h-full flex items-center justify-center p-6 overflow-auto">
      <div className="w-full max-w-md">
        <div className="bg-[#181C25] border border-[#2B3139] rounded-2xl p-6">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Swap</h2>

          <div className="space-y-4">
            <div className="bg-[#0B0E11] rounded-xl p-4 border border-[#2B3139]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">From</label>
                <div className="text-xs text-gray-500">Balance: 0.00</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-bold focus:outline-none"
                  placeholder="0.0"
                />
                <select
                  value={fromAsset}
                  onChange={(e) => setFromAsset(e.target.value)}
                  className="bg-[#181C25] border border-[#2B3139] rounded-xl px-3 py-2 font-bold focus:outline-none"
                >
                  {assets.map((asset) => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleFlip}
                className="w-10 h-10 bg-[#0B0E11] hover:bg-[#2B3139] border border-[#2B3139] rounded-xl flex items-center justify-center transition-colors"
              >
                <span className="text-xl">↕</span>
              </button>
            </div>

            <div className="bg-[#0B0E11] rounded-xl p-4 border border-[#2B3139]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">To</label>
                <div className="text-xs text-gray-500">Balance: 0.00</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="flex-1 bg-transparent text-2xl font-bold focus:outline-none"
                  placeholder="0.0"
                />
                <select
                  value={toAsset}
                  onChange={(e) => setToAsset(e.target.value)}
                  className="bg-[#181C25] border border-[#2B3139] rounded-xl px-3 py-2 font-bold focus:outline-none"
                >
                  {assets.map((asset) => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {fromAmount && (
              <div className="bg-[#0B0E11] rounded-xl p-4 border border-[#2B3139] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate</span>
                  <span className="font-bold">
                    1 {fromAsset} = {toAssetInfo && fromAssetInfo ? (fromAssetInfo.price / toAssetInfo.price).toFixed(6) : '0'} {toAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span className="font-bold">0.3%</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSwap}
              disabled={!isConnected || !fromAmount}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-black text-sm uppercase tracking-wider transition-colors"
            >
              {isConnected ? 'Swap' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapView;
