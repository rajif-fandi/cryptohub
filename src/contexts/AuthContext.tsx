import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Tipe Data ---
interface User {
  id: string;
  username: string;
  email: string;
}

interface WatchlistItem {
  id: string; // ID unik untuk item watchlist, bukan coinId
  coinId: string; // ID koin dari CoinGecko
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  coinPrice: number;
  note?: string;
  tags?: string[];
  addedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  watchlist: WatchlistItem[];
  addToWatchlist: (coin: {id: string; name: string; symbol: string; image: string; current_price: number;}) => void;
  removeFromWatchlist: (coinId: string) => void;
  updateWatchlistItem: (coinId: string, note: string, tags: string[]) => void;
  isInWatchlist: (coinId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Effect untuk memuat user dan watchlist dari localStorage saat komponen dimuat
  useEffect(() => {
    console.log("AuthContext: Running useEffect for initial load.");
    const savedUser = localStorage.getItem('user');
    const savedWatchlist = localStorage.getItem('watchlist');
    const savedToken = localStorage.getItem('token');

    console.log("AuthContext: localStorage 'user' raw:", savedUser);
    console.log("AuthContext: localStorage 'token' raw:", savedToken);
    console.log("AuthContext: localStorage 'watchlist' raw:", savedWatchlist);

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log("AuthContext: Parsed user from localStorage:", parsedUser);
      } catch (e) {
        console.error("AuthContext: Failed to parse user from localStorage:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    if (savedWatchlist) {
      try {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        // Tambahkan validasi dasar untuk memastikan parsedWatchlist adalah array
        if (Array.isArray(parsedWatchlist)) {
          setWatchlist(parsedWatchlist);
          console.log("AuthContext: Parsed watchlist from localStorage:", parsedWatchlist);
        } else {
          console.warn("AuthContext: Invalid watchlist data in localStorage, clearing it.");
          localStorage.removeItem('watchlist');
          setWatchlist([]);
        }
      } catch (e) {
        console.error("AuthContext: Failed to parse watchlist from localStorage:", e);
        localStorage.removeItem('watchlist'); // Hapus data yang rusak
        setWatchlist([]);
      }
    }
  }, []); // [] agar hanya berjalan sekali saat mount

  // --- Fungsi Otentikasi (Simulasi) ---
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulasi login: cek kredensial sederhana
    if (email === "demo@example.com" && password === "password") {
      const userData: User = {
        id: "1",
        username: "Demo User",
        email: email
      };
      setUser(userData);
      try {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'simulated_token_123'); // Simulasikan token
        console.log("login: User and token successfully saved to localStorage.");
      } catch (e) {
        console.error("login: Error saving user/token to localStorage:", e);
      }
      console.log("Simulated login successful for:", email);
      return true;
    }
    console.warn("Simulated login failed: Invalid credentials for", email);
    return false; // Login gagal jika kredensial tidak cocok
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulasi registrasi: asumsikan selalu berhasil
    const userData: User = {
      id: Date.now().toString(), // ID unik berdasarkan timestamp
      username: username,
      email: email
    };
    setUser(userData);
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'simulated_token_for_' + userData.id); // Simulasikan token
      console.log("register: User and token successfully saved to localStorage.");
    } catch (e) {
      console.error("register: Error saving user/token to localStorage:", e);
    }
    // Di aplikasi nyata, Anda akan menyimpan user ini ke database
    console.log("Simulated registration successful for:", email);
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Hapus token simulasi
      localStorage.removeItem('watchlist'); // Hapus juga dari localStorage
      console.log("logout: User, token, and watchlist successfully cleared from localStorage.");
    } catch (e) {
      console.error("logout: Error clearing localStorage:", e);
    }
    setWatchlist([]); // Bersihkan watchlist saat logout
    console.log("User logged out.");
  };

  // --- Fungsi Watchlist ---
  const addToWatchlist = (coin: {id: string; name: string; symbol: string; image: string; current_price: number;}) => {
    if (!user) {
      console.warn("addToWatchlist: User is not logged in. Cannot add to watchlist.");
      // Anda mungkin ingin menampilkan notifikasi kepada user di sini (misal: toast)
      return;
    }

    // Periksa apakah koin sudah ada di watchlist
    if (watchlist.some(item => item.coinId === coin.id)) {
      console.log(`${coin.name} is already in watchlist.`);
      // Anda mungkin ingin menampilkan notifikasi kepada user di sini
      return;
    }

    // PENTING: Validasi dan default value untuk coin.current_price
    const priceToAdd = typeof coin.current_price === 'number' && !isNaN(coin.current_price)
                            ? coin.current_price
                            : 0; // Default ke 0 jika tidak valid

    const newItem: WatchlistItem = {
      id: Date.now().toString(), // ID unik untuk item watchlist
      coinId: coin.id, // ID koin dari CoinGecko
      coinName: coin.name,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      coinPrice: priceToAdd, // Gunakan nilai yang sudah divalidasi
      note: '', // Catatan awal kosong
      tags: [], // Tag awal kosong
      addedAt: new Date().toISOString()
    };

    const updatedWatchlist = [...watchlist, newItem];
    setWatchlist(updatedWatchlist);
    console.log("addToWatchlist: New item added to state:", newItem); // Log state
    console.log("addToWatchlist: Updated watchlist array (state):", updatedWatchlist); // Log state array

    try {
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      console.log("addToWatchlist: Watchlist successfully saved to localStorage. String:", JSON.stringify(updatedWatchlist)); // Log string yang disimpan
    } catch (e) {
      console.error("addToWatchlist: Error saving to localStorage:", e); // Cek error di sini!
    }
  };

  const removeFromWatchlist = (coinId: string) => {
    if (!user) {
        console.warn("removeFromWatchlist: User not logged in.");
        return;
    }
    const updatedWatchlist = watchlist.filter(item => item.coinId !== coinId);
    setWatchlist(updatedWatchlist);
    console.log("removeFromWatchlist: Item removed from state with coinId:", coinId);
    console.log("removeFromWatchlist: Updated watchlist array (state):", updatedWatchlist);

    try {
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      console.log("removeFromWatchlist: Watchlist successfully saved to localStorage. String:", JSON.stringify(updatedWatchlist));
    } catch (e) {
      console.error("removeFromWatchlist: Error saving to localStorage:", e); // Cek error di sini!
    }
  };

  const updateWatchlistItem = (coinId: string, note: string, tags: string[]) => {
    if (!user) {
        console.warn("updateWatchlistItem: User not logged in.");
        return;
    }
    const updatedWatchlist = watchlist.map(item =>
      item.coinId === coinId ? { ...item, note, tags } : item
    );
    setWatchlist(updatedWatchlist);
    console.log("updateWatchlistItem: Item updated in state for coinId:", coinId);
    console.log("updateWatchlistItem: Updated watchlist array (state):", updatedWatchlist);

    try {
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      console.log("updateWatchlistItem: Watchlist successfully saved to localStorage. String:", JSON.stringify(updatedWatchlist));
    } catch (e) {
      console.error("updateWatchlistItem: Error saving to localStorage:", e); // Cek error di sini!
    }
  };

  const isInWatchlist = (coinId: string): boolean => {
    return watchlist.some(item => item.coinId === coinId);
  };

  // --- Nilai Context ---
  const value = {
    user,
    login,
    register,
    logout,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    isInWatchlist
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook untuk Menggunakan Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};