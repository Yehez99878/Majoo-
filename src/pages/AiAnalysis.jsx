import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AiAnalysis = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const studentId = "00000000-0000-0000-0000-000000000000"; 
        const response = await fetch(`http://127.0.0.1:8000/analyze/${studentId}`, {
          method: 'POST',
        });
        const result = await response.json();
        setAnalysis(result);
      } catch (err) {
        console.error("Gagal mengambil data AI:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center p-6 font-mono"
      style={{ backgroundImage: "url('/assets/arcade-bg.jpg')" }} // Sesuaikan path background arcade kamu
    >
      {/* Overlay Gelap agar teks terbaca */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"></div>

      {/* Header Dashboard */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10 z-10">
        <button 
          onClick={() => navigate('/lobby')}
          className="text-cyan-400 hover:text-white border border-cyan-400 px-6 py-2 rounded-lg bg-cyan-400/10 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
          {"<"} KEMBALI
        </button>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
          AI LEARNING DASHBOARD
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-cyan-300 animate-pulse">
          <div className="text-5xl mb-4">⚙️</div>
          <p className="tracking-[0.3em] text-xl">MENGOLAH DATA METRIK...</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
          
          {/* KARTU 1: LEARNING ANALYSIS (Evaluasi, Analisis, Rekomendasi) */}
          <div className="bg-black/70 border-2 border-pink-500 rounded-2xl p-6 shadow-[0_0_20px_rgba(236,72,153,0.3)] flex flex-col gap-6 backdrop-blur-md">
            <h2 className="text-pink-400 font-bold border-b border-pink-500/30 pb-2 tracking-widest text-lg">LEARNING ANALYSIS</h2>
            
            <div>
              <p className="text-xs text-pink-300/60 mb-1 tracking-tighter">EVALUASI SINGKAT</p>
              <p className="text-white text-lg leading-tight">{analysis?.evaluasi_singkat || "Sangat Bagus!"}</p>
            </div>

            <div>
              <p className="text-xs text-pink-300/60 mb-1 tracking-tighter">ANALISIS DETAIL</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {analysis?.analisis_detail || "Pemain menunjukkan pemahaman yang kuat pada konsep dasar namun perlu meningkatkan kecepatan respon di area maze yang kompleks."}
              </p>
            </div>

            <div className="mt-auto">
              <p className="text-xs text-pink-300/60 mb-1 tracking-tighter">REKOMENDASI AI</p>
              <p className="text-sm text-cyan-300 italic">
                "{analysis?.rekomendasi || "Pelajari kembali materi Fotosintesis fokus pada reaksi terang."}"
              </p>
            </div>
          </div>

          {/* KARTU 2: CONCEPT MASTERY (Progress Bars) */}
          <div className="bg-black/70 border-2 border-cyan-400 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md">
            <h2 className="text-cyan-400 font-bold border-b border-cyan-400/30 pb-2 tracking-widest text-lg mb-6">CONCEPT MASTERY</h2>
            <div className="space-y-6">
              {[
                { name: "Fotosintesis", val: "85%" },
                { name: "Respirasi Sel", val: "60%" },
                { name: "Ekosistem", val: "90%" },
                { name: "Genetika", val: "45%" }
              ].map((concept, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1 text-cyan-200">
                    <span>{concept.name}</span>
                    <span>{concept.val}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                      style={{ width: concept.val }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KARTU 3: QUIZ ACCURACY (Beserta Score) */}
          <div className="bg-black/70 border-2 border-yellow-400 rounded-2xl p-6 shadow-[0_0_20px_rgba(250,204,21,0.3)] flex flex-col items-center justify-center text-center backdrop-blur-md">
            <h2 className="text-yellow-400 font-bold border-b border-yellow-400/30 pb-2 tracking-widest text-lg mb-8 w-full">QUIZ ACCURACY</h2>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              {/* Lingkaran Luar Neon */}
              <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-yellow-400 rounded-full animate-spin"></div>
              
              <div className="flex flex-col">
                <span className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
                  {Math.round((analysis?.quiz_accuracy || 0.8) * 100)}%
                </span>
                <span className="text-xs text-yellow-500 font-bold tracking-widest mt-2">ACCURACY RATE</span>
              </div>
            </div>

            <div className="w-full bg-yellow-400/10 border border-yellow-400/30 py-4 rounded-xl">
              <p className="text-xs text-yellow-500 mb-1">TOTAL GAME SCORE</p>
              <p className="text-3xl font-bold text-white tracking-tighter">840 PTS</p>
            </div>
          </div>

        </div>
      )}

      {/* Footer System Status */}
      <div className="mt-12 text-[10px] text-gray-500 tracking-[0.5em] uppercase">
        Majoo Learning Engine v2.0 // Neural Analysis Active
      </div>
    </div>
  );
};

export default AiAnalysis;