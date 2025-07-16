// src/lib/api.ts
import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Fungsi untuk mendapatkan daftar koin pasar (untuk halaman Home)
export const getCoinMarkets = async (page: number = 1, perPage: number = 100, vsCurrency: string = 'usd') => {
  try {
    const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
      },
    });
    return response.data; // Data adalah array dari objek koin
  } catch (error) {
    console.error('Error fetching coin market data:', error);
    throw error; // Lemparkan error agar bisa ditangani di komponen
  }
};

// Fungsi untuk mendapatkan detail koin berdasarkan ID (untuk halaman CoinDetail)
export const getCoinDetails = async (coinId: string) => {
  try {
    const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data; // Data adalah objek detail koin
  } catch (error) {
    console.error(`Error fetching coin details for ${coinId}:`, error);
    throw error;
  }
};

// Fungsi untuk mendapatkan koin yang sedang trending dan kemudian mengambil data pasarnya
// Ini melakukan dua panggilan: satu untuk ID trending, satu lagi untuk detail pasar lengkap
export const getTrendingCoinsWithMarketData = async () => {
  try {
    // 1. Ambil daftar koin trending (hanya ID dan info dasar)
    const trendingResponse = await axios.get(`${COINGECKO_BASE_URL}/search/trending`);
    const trendingItems = trendingResponse.data.coins.map((coin: any) => coin.item);

    // Dapatkan ID dari koin-koin trending
    const trendingCoinIds = trendingItems.map((item: any) => item.id);

    // Jika tidak ada koin trending, kembalikan array kosong
    if (trendingCoinIds.length === 0) {
      return [];
    }

    // 2. Gunakan ID ini untuk mengambil data pasar yang lengkap
    // Endpoint /coins/markets bisa menerima daftar ID yang dipisahkan koma
    const marketDataResponse = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: trendingCoinIds.join(','), // Kirim daftar ID koin trending
        sparkline: false,
      },
    });

    return marketDataResponse.data; // Ini akan mengembalikan array koin dengan data pasar lengkap
  } catch (error) {
    console.error('Error fetching trending coins with market data:', error);
    throw error;
  }
};