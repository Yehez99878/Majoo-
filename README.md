# 🎮 Majoo! Bersama Gunadarma

Selamat datang di repositori **Majoo! Bersama Gunadarma**! Proyek ini adalah inovasi game edukasi berbasis *web* yang menggabungkan keseruan mekanik klasik "Pac-Man" dengan konsep pembelajaran interaktif. Dirancang untuk membuat proses belajar menjadi jauh lebih menyenangkan dan adaptif bagi segala usia.

## 🌟 Fitur Utama
* **🕹️ Classic Maze Gameplay:** Telusuri labirin, hindari musuh, dan kumpulkan poin dengan mekanik yang familiar dan seru.
* **🧠 AI Learning Analytics:** Terintegrasi dengan microservice AI yang menganalisis metrik *gameplay* (waktu respons, akurasi kuis, dan tingkat kesalahan arah) untuk memberikan evaluasi belajar secara *real-time*.
* **📊 Adaptive Recommendations:** Memberikan rekomendasi materi yang dipersonalisasi berdasarkan performa siswa di dalam game.
* **☁️ Cloud-Based Real-Time Data:** Penyimpanan dan sinkronisasi skor pengguna secara aman menggunakan arsitektur *backend* yang tangguh.

## 🛠️ Tech Stack
Proyek ini dibangun menggunakan arsitektur *microservice* modern:

**Frontend (Client-Side):**
* **Framework:** React.js + Vite
* **Styling:** Tailwind CSS
* **Game Engine:** Phaser.js / HTML5 Canvas
* **State Management:** Zustand

**AI & Analytics Backend (Microservice):**
* **Language:** Python
* **Framework:** FastAPI
* **Data Processing:** Pandas, NumPy, Scikit-Learn/TensorFlow
* **Database:** Supabase (PostgreSQL-as-a-Service)

## 👥 Tim Pengembang (Team 5)
Di balik pengembangan proyek ini, terdapat kolaborasi dari 3 peran utama:
1.  **Hacker (Lead Engineer):** Yehezkiel Athanasius Manurung
2.  **Hustler (Business & Product):** Cindi Crosscintya
3.  **Hipster (UI/UX & Design):** Dellia Visita Pratiwi

## 🚀 Cara Menjalankan Proyek Secara Lokal

### Prasyarat
Pastikan kamu sudah menginstal **Node.js** (v18+) dan **Python** (v3.10+) di perangkat anda.

### Langkah Instalasi
1.  **Clone Repositori ini:**
    ```bash
    git clone [https://github.com/Yehez99878/Majoo-.git](https://github.com/Yehez99878/Majoo-.git)
    cd Majoo-
    ```

2.  **Install Dependensi Frontend:**
    ```bash
    npm install
    ```

3.  **Jalankan Server Development Frontend:**
    ```bash
    npm run dev
    ```

*(Catatan: Untuk menjalankan microservice AI secara lokal, pastikan untuk mengaktifkan *virtual environment* Python dan menggunakan `uvicorn` pada direktori `ai-service`).*

---
*Dibuat dengan ❤️ untuk merevolusi cara kita belajar sambil bermain.*
