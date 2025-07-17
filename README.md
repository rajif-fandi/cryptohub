# CryptoHub - Aplikasi Pemantau Cryptocurrency

## Deskripsi Proyek
Aplikasi web CryptoHub adalah platform interaktif yang memungkinkan pengguna untuk memantau harga real-time cryptocurrency terkemuka, melacak pergerakan pasar harian, melihat detail koin individual, dan mengelola daftar pantauan (watchlist) pribadi. Aplikasi ini dirancang dengan fokus pada pengalaman pengguna yang intuitif dan visual yang menarik.

## API yang Digunakan
- **CoinGecko API**: Digunakan untuk mengambil data harga harga cryptocurrency secara real-time, detail koin, data pasar (market cap, volume), dan data trending.
  - Endpoint utama yang digunakan:
    - `/coins/markets` (untuk daftar koin di halaman Home/Trending)
    - `/coins/{id}` (untuk detail koin di halaman CoinDetail)

## Fitur-Fitur Utama
- **Dashboard Pasar (Home Page)**: Menampilkan daftar cryptocurrency terkemuka berdasarkan kapitalisasi pasar, beserta harga terkini, perubahan 24 jam, dan data kunci lainnya.
- **Halaman Trending**: Menampilkan daftar koin yang sedang trending atau populer.
- **Halaman Detail Koin**: Menyediakan informasi mendalam tentang setiap cryptocurrency, termasuk statistik pasar, deskripsi, dan tautan ke situs web resmi.
- **Sistem Otentikasi Pengguna**:
    - **Registrasi**: Pengguna dapat membuat akun baru.
    - **Login**: Pengguna dapat masuk ke akun mereka.
    - **Logout**: Pengguna dapat keluar dari sesi mereka.
    - (Catatan: Untuk proyek ini, sistem otentikasi disimulasikan menggunakan `localStorage` untuk kemudahan demonstrasi tanpa memerlukan backend nyata.)
- **Watchlist (Daftar Pantauan)**:
    - Pengguna yang login dapat menambahkan koin favorit mereka ke daftar pantauan pribadi.
    - Melihat semua koin dalam watchlist mereka.
    - Menghapus koin dari watchlist.
    - Menambahkan catatan pribadi dan tag ke setiap item watchlist.
    - (Data watchlist juga disimpan secara lokal menggunakan `localStorage`.)

## Struktur Halaman dan Routing
Aplikasi menggunakan `react-router-dom` untuk navigasi antar halaman:
- `/` (Home): Halaman utama, menampilkan daftar pasar koin.
- `/trending` (Trending): Menampilkan daftar koin yang sedang trending.
- `/watchlist` (Watchlist): Menampilkan daftar koin yang dipantau pengguna (membutuhkan login).
- `/login` (Login): Halaman login pengguna.
- `/register` (Register): Halaman registrasi pengguna.
- `/coin/:id` (Coin Detail): Halaman detail untuk cryptocurrency tertentu, di mana `:id` adalah ID koin (misal: `/coin/bitcoin`).
- `/*` (Not Found): Halaman 404 untuk rute yang tidak ditemukan.

## Cara Menjalankan Secara Lokal
Untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda:

1.  **Klon Repositori:**
    ```bash
    git clone [https://github.com/rajif-fandi/cryptohub.git](https://github.com/rajif-fandi/cryptohub.git) # Ganti dengan URL repo Anda yang benar
    cd cryptohub # Masuk ke direktori proyek
    ```

2.  **Instal Dependensi:**
    ```bash
    npm install # Atau yarn install
    ```

3.  **Konfigurasi Variabel Lingkungan (Jika Ada API Key):**
    Jika CoinGecko API yang Anda gunakan memerlukan kunci API (biasanya untuk rate limit yang lebih tinggi), buat file `.env` di root direktori proyek dan tambahkan:
    ```env
    VITE_COINGECKO_API_KEY=YOUR_API_KEY_HERE
    ```
    (Ganti `YOUR_API_KEY_HERE` dengan kunci API Anda. Jika tidak ada, langkah ini bisa dilewati).

4.  **Jalankan Aplikasi:**
    ```bash
    npm run dev # Atau yarn dev
    ```
    Aplikasi akan berjalan di `http://localhost:XXXX` (biasanya `http://localhost:5173` atau `http://localhost:3000`).

## Link Live Demo Aplikasi
Aplikasi ini di-deploy menggunakan Vercel dan dapat diakses melalui tautan berikut:
[Link Live Demo Anda di Vercel](https://your-vercel-app-url.vercel.app)
(Ganti `https://your-vercel-app-url.vercel.app` dengan URL aplikasi Anda setelah deploy berhasil.)