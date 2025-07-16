// src/components/CoinCard.tsx
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Heart } from "lucide-react"; // Tambahkan Heart
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Pastikan ini diimpor
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { useToast } from "@/hooks/use-toast"; // Import useToast
// Anda tidak mengimpor Card dan CardContent di sini, mungkin karena itu adalah komponen dasar Anda
// Jika Anda ingin menggunakannya, pastikan diimpor dari tempat yang benar (misal: @/components/ui/card)

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

interface CoinCardProps {
  coin: Coin;
}

const CoinCard = ({ coin }: CoinCardProps) => {
  const { user, addToWatchlist, isInWatchlist } = useAuth(); // Ambil dari AuthContext
  const { toast } = useToast();

  const isPositive = coin.price_change_percentage_24h > 0;

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  // Fungsi untuk menangani penambahan ke watchlist
  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah event klik menyebar ke Link di sekitarnya
    e.stopPropagation(); // Mencegah event klik menyebar ke Link di sekitarnya

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add coins to your watchlist.",
        variant: "destructive",
      });
      return;
    }

    const coinDataForWatchlist = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
    };

    console.log("Adding to watchlist:", coinDataForWatchlist);
    addToWatchlist(coinDataForWatchlist);
    toast({
      title: "Added to Watchlist",
      description: `${coin.name} has been added to your watchlist.`,
    });
  };

  return (
    // Tetap bungkus seluruh kartu dengan Link
    <Link
      to={`/coin/${coin.id}`}
      className="crypto-card hover:scale-105 transition-transform duration-200 block"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <span className="absolute -top-1 -right-1 bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded-full">
              #{coin.market_cap_rank}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{coin.name}</h3>
            <p className="text-sm text-slate-400 uppercase">{coin.symbol}</p>
          </div>
        </div>

        {/* Tombol Add to Watchlist: Ditempatkan secara terpisah di sebelah kanan */}
        {user && ( // Tampilkan tombol hanya jika user login
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-slate-400",
              isInWatchlist(coin.id)
                ? "text-red-500 hover:text-red-600"
                : "hover:text-crypto-accent-blue"
            )}
            onClick={handleAddToWatchlist} // Panggil fungsi baru ini
            disabled={isInWatchlist(coin.id)} // Nonaktifkan jika sudah di watchlist
          >
            <Heart className={cn("w-5 h-5", isInWatchlist(coin.id) ? "fill-current" : "")} />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Current Price</span>
          <span className="text-xl font-bold text-white">
            {formatPrice(coin.current_price)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">24h Change</span>
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            isPositive ? "text-crypto-success" : "text-crypto-danger"
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Market Cap</span>
          <span className="text-white font-medium">
            {formatMarketCap(coin.market_cap)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;