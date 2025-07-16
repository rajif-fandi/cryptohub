import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CoinCard from "@/components/CoinCard";
import { Loader2 } from "lucide-react";
import { getCoinMarkets } from "@/lib/api";

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

const Index = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Penting untuk penanganan error API

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true); // Mulai loading
      setError(null); // Reset error
      try {
        // Panggil fungsi API yang sebenarnya
        const data = await getCoinMarkets(); // Ini akan memanggil API CoinGecko
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError("Failed to load market data. Please check your internet connection or try again later.");
      } finally {
        setLoading(false); // Selesai loading, terlepas dari sukses atau gagal
      }
    };

    fetchCoins();
  }, []); // Dependensi kosong berarti efek hanya berjalan sekali setelah render awal

  // Tambahkan kondisi untuk loading dan error di JSX Anda
  if (loading) {
    return (
      <div className="min-h-screen bg-crypto-gradient">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-crypto-accent-blue" />
          <span className="ml-2 text-slate-300">Loading market data...</span>
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
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-crypto-accent-blue to-crypto-accent-purple bg-clip-text text-transparent">
              Cryptocurrency
            </span>
            <br />
            <span className="text-white">Market Overview</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Track real-time prices, market capitalizations, and daily changes of the world's leading cryptocurrencies
          </p>
        </div>

        {/* Market Stats (Ini masih hardcoded, bisa di-update nanti jika ada API untuk ini) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="crypto-card text-center">
            <h3 className="text-slate-400 text-sm mb-2">Total Market Cap</h3>
            <p className="text-2xl font-bold text-white">$1.67T</p>
            <p className="text-crypto-success text-sm">+2.34% (24h)</p>
          </div>
          <div className="crypto-card text-center">
            <h3 className="text-slate-400 text-sm mb-2">24h Trading Volume</h3>
            <p className="text-2xl font-bold text-white">$67.8B</p>
            <p className="text-crypto-success text-sm">+5.67% (24h)</p>
          </div>
          <div className="crypto-card text-center">
            <h3 className="text-slate-400 text-sm mb-2">Bitcoin Dominance</h3>
            <p className="text-2xl font-bold text-white">50.7%</p>
            <p className="text-crypto-danger text-sm">-0.23% (24h)</p>
          </div>
        </div>

        {/* Coins Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-accent-gradient text-white px-3 py-1 rounded-lg mr-3">Top</span>
            Cryptocurrencies by Market Cap
          </h2>
          
          {/* Kondisi loading dan error sudah ditangani di atas */}
          {/* Anda bisa menghapus bagian ternary loading di sini karena sudah ditangani di awal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;