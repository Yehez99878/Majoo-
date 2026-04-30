import React from 'react';
import { useNavigate } from 'react-router-dom';

const Subjects = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col items-center relative font-mono">
      
      {/* Tombol Back ke Lobby */}
      <button 
        onClick={() => navigate('/lobby')}
        className="absolute top-6 left-10 text-cyan-400 font-bold hover:text-white transition-all text-lg"
      >
        {"<"} KEMBALI KE LOBBY
      </button>

      {/* Konten Utama Container */}
      <div className="flex flex-col items-center w-full max-w-4xl mt-12">
        
        {/* SPACER: Penahan posisi agar tidak menabrak logo background (Sesuaikan h-40 ini jika perlu) */}
        <div className="h-40 w-full"></div>

        {/* Judul Halaman */}
        <div className="mb-12 border-2 border-pink-500 bg-black/80 px-8 py-3 rounded-md shadow-[0_0_15px_#ec4899]">
          <h2 className="text-xl font-bold tracking-[0.2em] text-white">
            {">"} PILIH MATA PELAJARAN_
          </h2>
        </div>

        {/* Daftar Folder Pelajaran */}
        <div className="flex gap-10 flex-wrap justify-center px-10">
          
          {/* Folder IPA (Prioritas Utama) */}
          <button 
            onClick={() => navigate('/mapel/ipa')}
            className="group flex flex-col items-center transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-[200px] h-[220px] border-[3px] border-cyan-400 bg-black/90 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_#22d3ee] flex flex-col items-center p-4">
              {/* Gunakan gambar folder biru kamu di sini */}
              <div className="w-24 h-24 mb-4">
                <img src="/assets/IPA.png" alt="IPA" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-center text-sm leading-tight mt-2">
                Ilmu Pengetahuan Alam
              </span>
            </div>
          </button>

          {/* Folder Pelajaran Lain (Placeholder) */}
          <div className="w-[200px] h-[220px] border-[3px] border-gray-600 bg-black/40 rounded-2xl flex items-center justify-center grayscale opacity-50">
            <span className="text-gray-500 font-bold text-center px-4 italic">
              Misi Belum Tersedia
            </span>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 right-10 text-cyan-500/50 text-xs tracking-widest italic">
        MAJOO! EDUCATION SYSTEM V.1.0
      </div>

    </div>
  );
};

export default Subjects;