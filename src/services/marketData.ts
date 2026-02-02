import { MarketData } from '../types';

interface PriceUpdate {
  price: number;
  change: number;
}

export async function fetchRealPrices(): Promise<Record<string, PriceUpdate>> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polkadot,tether&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();

    return {
      BTC: {
        price: data.bitcoin?.usd || 82929.94,
        change: data.bitcoin?.usd_24h_change || 1.45,
      },
      ETH: {
        price: data.ethereum?.usd || 2950.12,
        change: data.ethereum?.usd_24h_change || 0.85,
      },
      SOL: {
        price: data.solana?.usd || 168.45,
        change: data.solana?.usd_24h_change || 4.12,
      },
      DOT: {
        price: data.polkadot?.usd || 6.80,
        change: data.polkadot?.usd_24h_change || -1.20,
      },
      USDT: {
        price: data.tether?.usd || 1.00,
        change: data.tether?.usd_24h_change || 0.01,
      },
    };
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return {
      BTC: { price: 82929.94, change: 1.45 },
      ETH: { price: 2950.12, change: 0.85 },
      SOL: { price: 168.45, change: 4.12 },
      DOT: { price: 6.80, change: -1.20 },
      USDT: { price: 1.00, change: 0.01 },
    };
  }
}

export async function fetchCandles(symbol: string): Promise<MarketData[]> {
  const coinMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    DOT: 'polkadot',
    USDT: 'tether',
  };

  const coinId = coinMap[symbol] || 'bitcoin';

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=7`
    );
    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map((candle: number[]) => ({
        time: candle[0] / 1000,
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
      }));
    }
  } catch (error) {
    console.error('Failed to fetch candles:', error);
  }

  return generateMockCandles();
}

function generateMockCandles(): MarketData[] {
  const candles: MarketData[] = [];
  const now = Date.now() / 1000;
  let price = 50000;

  for (let i = 100; i >= 0; i--) {
    const time = now - i * 3600;
    const change = (Math.random() - 0.5) * 1000;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;

    candles.push({ time, open, high, low, close });
    price = close;
  }

  return candles;
}
