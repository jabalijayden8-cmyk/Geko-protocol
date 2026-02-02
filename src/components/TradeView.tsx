import React, { useState, useEffect, useRef } from 'react';
import { AssetInfo, MarketData, ActiveTrade } from '../types';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface TradeViewProps {
  assets: AssetInfo[];
  selectedAsset: AssetInfo;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  marketData: MarketData[];
  isConnected: boolean;
  onPlaceTrade: (trade: { direction: 'up' | 'down'; amount: string; duration: number }) => void;
  activeTrades: ActiveTrade[];
}

const TradeView: React.FC<TradeViewProps> = ({
  assets,
  selectedAsset,
  selectedSymbol,
  setSelectedSymbol,
  marketData,
  isConnected,
  onPlaceTrade,
  activeTrades,
}) => {
  const [amount, setAmount] = useState('100');
  const [duration, setDuration] = useState(60);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0B0E11' },
        textColor: '#6B7280',
      },
      grid: {
        vertLines: { color: '#1F2937' },
        horzLines: { color: '#1F2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && marketData.length > 0) {
      seriesRef.current.setData(marketData);
    }
  }, [marketData]);

  const handlePlaceTrade = (direction: 'up' | 'down') => {
    if (!isConnected || !amount) return;
    onPlaceTrade({ direction, amount, duration });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-[#2B3139]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-[#181C25] border border-[#2B3139] rounded-xl px-4 py-2 font-bold text-lg focus:outline-none focus:border-indigo-500"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol}
                </option>
              ))}
            </select>
            <div>
              <div className="text-2xl font-black">
                ${selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-bold ${selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-gray-500 text-xs">Market Cap</div>
              <div className="font-bold">${selectedAsset.marketCap}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Volume 24h</div>
              <div className="font-bold">${selectedAsset.volume24h}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-auto">
          <div ref={chartContainerRef} className="rounded-2xl overflow-hidden border border-[#2B3139]"></div>

          <div className="mt-6 bg-[#181C25] rounded-2xl border border-[#2B3139] p-6">
            <h3 className="text-sm font-black uppercase tracking-wider mb-4">Place Trade</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0E11] border border-[#2B3139] rounded-xl text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Duration (seconds)
                </label>
                <div className="flex gap-2">
                  {[30, 60, 120, 300].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                        duration === d
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#0B0E11] text-gray-400 hover:text-white'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handlePlaceTrade('up')}
                  disabled={!isConnected}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-black text-sm uppercase tracking-wider transition-colors"
                >
                  ↑ Long
                </button>
                <button
                  onClick={() => handlePlaceTrade('down')}
                  disabled={!isConnected}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-black text-sm uppercase tracking-wider transition-colors"
                >
                  ↓ Short
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 border-l border-[#2B3139] p-6 overflow-auto">
          <h3 className="text-sm font-black uppercase tracking-wider mb-4">Active Trades</h3>
          <div className="space-y-3">
            {activeTrades.slice(0, 10).map((trade) => {
              const elapsed = (Date.now() - trade.startTime) / 1000;
              const progress = (elapsed / trade.duration) * 100;

              return (
                <div
                  key={trade.id}
                  className={`bg-[#181C25] rounded-xl p-4 border ${
                    trade.status === 'won'
                      ? 'border-emerald-500/30'
                      : trade.status === 'lost'
                      ? 'border-rose-500/30'
                      : 'border-[#2B3139]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold">{trade.symbol}</div>
                    <div className={`text-xs font-bold ${trade.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.direction === 'up' ? '↑' : '↓'} ${trade.amount}
                    </div>
                  </div>

                  {trade.status === 'pending' && (
                    <div className="w-full bg-[#0B0E11] rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-1000"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  )}

                  {trade.status !== 'pending' && (
                    <div className={`text-xs font-bold ${trade.status === 'won' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.status === 'won' ? 'WON' : 'LOST'}
                    </div>
                  )}
                </div>
              );
            })}

            {activeTrades.length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm">
                No active trades
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeView;
