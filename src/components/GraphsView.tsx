import React, { useEffect, useRef } from 'react';
import { AssetInfo, MarketData } from '../types';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface GraphsViewProps {
  assets: AssetInfo[];
  selectedAsset: AssetInfo;
  marketData: MarketData[];
  setSelectedSymbol: (symbol: string) => void;
}

const GraphsView: React.FC<GraphsViewProps> = ({ assets, selectedAsset, marketData, setSelectedSymbol }) => {
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
      height: chartContainerRef.current.clientHeight,
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
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-[#2B3139]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedAsset.symbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-[#181C25] border border-[#2B3139] rounded-xl px-4 py-2 font-bold text-lg focus:outline-none focus:border-indigo-500"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
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

      <div className="flex-1 p-6 overflow-hidden">
        <div ref={chartContainerRef} className="w-full h-full rounded-2xl overflow-hidden border border-[#2B3139]"></div>
      </div>
    </div>
  );
};

export default GraphsView;
