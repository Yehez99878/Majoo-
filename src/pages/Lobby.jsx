import React from 'react';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col items-center relative text-white font-mono overflow-hidden">
      
      {/* --- BAGIAN ATAS: Profil Player --- */}
      {/* <div className="absolute top-6 left-8"> ... </div> */} 

      {/* --- KONTEN UTAMA --- */}
      <div className="mt-24 flex flex-col items-center w-full max-w-5xl px-4">
        
        {/* Spacer transparan pengganti logo untuk menahan posisi menu */}
        <div className="h-32 mb-6"></div>

        {/* Subtitle */}
        <div className="bg-black/60 px-8 py-2 rounded-full mb-10 shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-500/50 backdrop-blur-md">
          <h2 className="font-bold tracking-widest text-lg text-pink-300">
            {">"} Pilih Misi Kamu_
          </h2>
        </div>

        {/* --- 3 KARTU MENU --- */}
        <div className="flex gap-8 justify-center w-full">
          
          {/* Kartu 1: Mapel */}
          <button 
            onClick={() => navigate('/mapel')} 
            className="group flex flex-col items-center transform transition-all duration-300 hover:-translate-y-4 hover:scale-105 outline-none"
          >
            <div className="w-[260px] h-[280px] border-[4px] border-cyan-400 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_40px_rgba(34,211,238,1)] bg-black/40 backdrop-blur-md transition-all flex flex-col items-center p-6 justify-center">
              <img src="/assets/menu-mapel.png" alt="Mata Pelajaran" className="w-40 h-40 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]" />
              <span className="mt-6 font-bold text-lg text-cyan-200 tracking-wider">Mata Pelajaran</span>
            </div>
          </button>

          {/* Kartu 2: Skor */}
          <button 
            onClick={() => navigate('/score-history')} 
            className="group flex flex-col items-center transform transition-all duration-300 hover:-translate-y-4 hover:scale-105 outline-none"
          >
            <div className="w-[260px] h-[280px] border-[4px] border-green-400 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(74,222,128,0.4)] group-hover:shadow-[0_0_40px_rgba(74,222,128,1)] bg-black/40 backdrop-blur-md transition-all flex flex-col items-center p-6 justify-center">
              <img src="/assets/menu-skor.png" alt="Riwayat Skor" className="w-40 h-40 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]" />
              <span className="mt-6 font-bold text-lg text-green-200 tracking-wider">Riwayat Skor</span>
            </div>
          </button>

          {/* Kartu 3: Analisis AI (Navigasi sudah disambungkan!) */}
          <button 
            onClick={() => navigate('/analysis')}
            className="group flex flex-col items-center transform transition-all duration-300 hover:-translate-y-4 hover:scale-105 outline-none"
          >
            <div className="w-[260px] h-[280px] border-[4px] border-yellow-400 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.4)] group-hover:shadow-[0_0_40px_rgba(250,204,21,1)] bg-black/40 backdrop-blur-md transition-all flex flex-col items-center p-6 justify-center">
              <img src="/assets/menu-ai.png" alt="Analisis AI" className="w-40 h-40 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]" />
              <span className="mt-6 font-bold text-lg text-yellow-200 tracking-wider text-center leading-tight">Analisis AI</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};

export default Lobby;