// src/pages/CoinDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, TrendingUp, TrendingDown, Globe, ExternalLink, Heart, HeartOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCoinDetails } from "@/lib/api"; // Import fungsi API

// --- Interface untuk data mentah yang datang dari CoinGecko API (endpoint /coins/{id}) ---
// Kita perlu interface ini untuk memberi tahu TypeScript struktur data 'data' yang diterima dari API
// agar tidak ada error 'Property 'x' does not exist on type 'unknown''.
interface RawCoinApiDetail {
  id: string;
  symbol: string;
  name: string;
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  market_data?: {
    current_price?: { usd?: number };
    price_change_percentage_24h_in_currency?: { usd?: number };
    price_change_percentage_7d_in_currency?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
  };
  market_cap_rank?: number;
  description?: { en?: string };
  links?: {
    homepage?: string[];
  };
  // Tambahkan properti lain yang mungkin ada dari API yang ingin Anda gunakan
}

interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  image: string; // Ini sudah divalidasi ke string URL di mapping
  market_cap_rank: number;
  description: string;
  homepage: string;
}

const CoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoin = async () => {
      if (!id) {
        setError("Coin ID not provided in URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Menggunakan RawCoinApiDetail untuk memberi tahu TypeScript struktur data yang diharapkan
        const data: RawCoinApiDetail = await getCoinDetails(id);
        
        // Log data mentah dari API untuk debugging
        console.log("CoinDetail: Raw data from API for", id, ":", data);

        // Memetakan respons API ke interface CoinDetail Anda
        setCoin({
          id: data.id,
          name: data.name,
          symbol: data.symbol,
          current_price: data.market_data?.current_price?.usd || 0,
          price_change_percentage_24h: data.market_data?.price_change_percentage_24h_in_currency?.usd || 0,
          price_change_percentage_7d: data.market_data?.price_change_percentage_7d_in_currency?.usd || 0,
          market_cap: data.market_data?.market_cap?.usd || 0,
          total_volume: data.market_data?.total_volume?.usd || 0,
          circulating_supply: data.market_data?.circulating_supply || 0,
          total_supply: data.market_data?.total_supply || 0,
          max_supply: data.market_data?.max_supply || 0,
          // Pastikan Anda memilih ukuran gambar yang paling sesuai (large, small, atau thumb)
          image: data.image?.large || data.image?.small || data.image?.thumb || "/placeholder.svg",
          market_cap_rank: data.market_cap_rank || 0,
          // Membersihkan HTML dari deskripsi jika ada, dan menyediakan fallback
          description: data.description?.en ? removeHtmlTags(data.description.en) : "No description available.",
          homepage: data.links?.homepage?.[0] || "#"
        });
      } catch (err) {
        console.error(`CoinDetail: Error fetching details for ${id}:`, err);
        setError(`Failed to load details for "${id}". The coin might not exist or there's a network issue.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  // Helper function untuk menghapus tag HTML dari string
  const removeHtmlTags = (htmlString: string): string => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  };


  const handleWatchlistToggle = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add coins to your watchlist",
        variant: "destructive",
      });
      return;
    }

    if (!coin) return; // Pastikan coin sudah ada datanya

    if (isInWatchlist(coin.id)) {
      removeFromWatchlist(coin.id);
      toast({
        title: "Removed from watchlist",
        description: `${coin.name} has been removed from your watchlist`,
      });
    } else {
      // Perbaiki objek yang diteruskan ke addToWatchlist
      // Hapus 'coinId' karena AuthContext.tsx tidak mengharapkannya di objek 'coin'
      // Pastikan properti nama, simbol, dan gambar yang benar dari 'coin' saat ini.
      addToWatchlist({
        id: coin.id,
        name: coin.name,        // Menggunakan coin.name dari state CoinDetail
        symbol: coin.symbol,    // Menggunakan coin.symbol dari state CoinDetail
        image: coin.image,      // Menggunakan coin.image dari state CoinDetail
        current_price: coin.current_price, // Menggunakan coin.current_price dari state CoinDetail
      });
      toast({
        title: "Added to watchlist",
        description: `${coin.name} has been added to your watchlist`,
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatLargeNumber = (num: number) => {
    if (num === null || num === undefined) return 'N/A'; // Handle null/undefined numbers
    if (num >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`;
    }
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-crypto-gradient">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-crypto-accent-blue" />
          <span className="ml-2 text-slate-300">Loading coin details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-crypto-gradient">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Coin</h1>
            <p className="text-slate-300 mb-4">{error}</p>
            <Link to="/" className="text-crypto-accent-blue hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!coin) { // Jika tidak ada error tapi coin null (misal ID tidak valid)
    return (
      <div className="min-h-screen bg-crypto-gradient">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Coin Not Found</h1>
            <p className="text-slate-300 mb-4">The cryptocurrency you are looking for does not exist or the ID is incorrect.</p>
            <Link to="/" className="text-crypto-accent-blue hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPositive24h = coin.price_change_percentage_24h > 0;
  const isPositive7d = coin.price_change_percentage_7d > 0;
  const inWatchlist = isInWatchlist(coin.id);

  return (
    <div className="min-h-screen bg-crypto-gradient">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market Overview
        </Link>

        {/* Coin Header */}
        <div className="crypto-card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-16 h-16 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{coin.name}</h1>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 text-lg uppercase">{coin.symbol}</span>
                  <span className="crypto-badge">Rank #{coin.market_cap_rank}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleWatchlistToggle}
                variant={inWatchlist ? "default" : "outline"}
                className={cn(
                  "transition-colors",
                  inWatchlist 
                    ? "bg-crypto-accent-blue hover:bg-crypto-accent-blue/80 text-white" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-800"
                )}
              >
                {inWatchlist ? (
                  <>
                    <HeartOff className="w-4 h-4 mr-2" />
                    Remove from Watchlist
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
              
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-2">
                  {formatPrice(coin.current_price)}
                </div>
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "flex items-center space-x-1",
                    isPositive24h ? "text-crypto-success" : "text-crypto-danger"
                  )}>
                    {isPositive24h ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">
                      {isPositive24h ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}% (24h)
                    </span>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-1",
                    isPositive7d ? "text-crypto-success" : "text-crypto-danger"
                  )}>
                    {isPositive7d ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">
                      {isPositive7d ? "+" : ""}{coin.price_change_percentage_7d.toFixed(2)}% (7d)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a
            href={coin.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-crypto-accent-blue hover:text-crypto-accent-purple transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" />
            Official Website
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Statistics */}
          <div className="lg:col-span-2">
            <div className="crypto-card">
              <h2 className="text-xl font-bold text-white mb-6">Market Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Market Cap</span>
                    <span className="text-white font-medium">${formatLargeNumber(coin.market_cap)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">24h Trading Volume</span>
                    <span className="text-white font-medium">${formatLargeNumber(coin.total_volume)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Circulating Supply</span>
                    <span className="text-white font-medium">{formatLargeNumber(coin.circulating_supply)} {coin.symbol}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Total Supply</span>
                    <span className="text-white font-medium">
                      {coin.total_supply > 0 ? `${formatLargeNumber(coin.total_supply)} ${coin.symbol}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Max Supply</span>
                    <span className="text-white font-medium">
                      {coin.max_supply > 0 ? `${formatLargeNumber(coin.max_supply)} ${coin.symbol}` : 'No Limit'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Market Cap Rank</span>
                    <span className="text-white font-medium">#{coin.market_cap_rank}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart Placeholder */}
          <div className="crypto-card">
            <h2 className="text-xl font-bold text-white mb-6">Price Chart</h2>
            <div className="bg-slate-800/50 rounded-lg p-8 text-center">
              <TrendingUp className="w-16 h-16 text-crypto-accent-blue mx-auto mb-4" />
              <p className="text-slate-400">Price chart visualization</p>
              <p className="text-sm text-slate-500 mt-2">Chart integration coming soon</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="crypto-card mt-8">
          <h2 className="text-xl font-bold text-white mb-6">About {coin.name}</h2>
          <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: coin.description }}></p>
        </div>
      </main>
    </div>
  );
};

export default CoinDetail;