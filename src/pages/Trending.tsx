// src/pages/Trending.tsx
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CoinCard from "@/components/CoinCard";
import { Loader2, TrendingUp, Flame } from "lucide-react";
// Impor fungsi API yang baru diubah
import { getTrendingCoinsWithMarketData } from "@/lib/api"; 

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  market_cap_rank: number;
}

const Trending = () => {
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        // Panggil fungsi API yang baru
        const data = await getTrendingCoinsWithMarketData();
        setTrendingCoins(data);
      } catch (err) {
        console.error("Error fetching trending coins:", err);
        setError("Failed to load trending data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-crypto-gradient">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-crypto-warning" />
          <span className="ml-2 text-slate-300">Loading trending data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-crypto-gradient">
        <Header />
        <div className="flex items-center justify-center py-20 text-red-500">
          <span className="ml-2 text-slate-300">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-gradient">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-12 h-12 text-crypto-warning mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-crypto-warning to-crypto-danger bg-clip-text text-transparent">
                Trending
              </span>
              <br />
              <span className="text-white">Cryptocurrencies</span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discover the hottest cryptocurrencies with the highest price movements and market activity in the last 24 hours
          </p>
        </div>

        {/* Trending Stats (Hardcoded untuk saat ini, Anda bisa ambil data dari API jika ada endpoint yang cocok) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="crypto-card text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-crypto-success mr-2" />
              <h3 className="text-slate-400 text-sm">Top Gainer (24h)</h3>
              <p className="text-xl font-bold text-crypto-success">SUI +15.67%</p> {/* Hardcoded */}
            </div>
          </div>
          <div className="crypto-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-6 h-6 text-crypto-warning mr-2" />
              <h3 className="text-slate-400 text-sm">Most Searched</h3>
              <p className="text-xl font-bold text-white">Avalanche</p> {/* Hardcoded */}
            </div>
          </div>
          <div className="crypto-card text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-crypto-accent-blue mr-2" />
              <h3 className="text-slate-400 text-sm">Trending Volume</h3>
              <p className="text-xl font-bold text-white">$12.4B</p> {/* Hardcoded */}
            </div>
          </div>
        </div>

        {/* Trending Coins Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-crypto-warning to-crypto-danger text-white px-3 py-1 rounded-lg mr-3 flex items-center">
              <Flame className="w-4 h-4 mr-1" />
              Hot
            </span>
            Trending Cryptocurrencies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="crypto-card mt-12">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-crypto-accent-blue" />
            What Makes a Cryptocurrency Trending?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Price Movement</h4>
              <p className="text-sm">Cryptocurrencies with significant price changes (both positive and negative) in the last 24 hours.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Trading Volume</h4>
              <p className="text-sm">High trading activity indicates increased interest and market participation.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Social Mentions</h4>
              <p className="text-sm">Coins frequently discussed on social media and crypto communities.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Market Events</h4>
              <p className="text-sm">Recent announcements, partnerships, or technical developments driving interest.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Trending;