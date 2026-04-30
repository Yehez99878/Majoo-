import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ScoreHistory = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from('score_history')
        .select('*')
        .order('dimainkan_pada', { ascending: false });

      if (error) {
        console.error("Gagal mengambil data:", error);
      } else {
        setScores(data);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

  return (
    <div style={{
      width: '100%', minHeight: '100vh', backgroundColor: '#0f0518',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Courier New', monospace", color: '#fff', position: 'relative', padding: '20px',
      background: 'linear-gradient(180deg, #0f0518 0%, #1a0f2e 50%, #0d0d1a 100%)'
    }}>
      
      {/* Bingkai Utama ala Terminal Hacker / Mesin Arcade */}
      <div style={{
        width: '100%', maxWidth: '700px', backgroundColor: 'rgba(26, 15, 46, 0.9)',
        border: '3px solid #ff00ff', borderRadius: '12px', padding: '30px',
        boxShadow: '0 0 30px rgba(255, 0, 255, 0.5), inset 0 0 30px rgba(102, 51, 204, 0.3)',
        position: 'relative'
      }}>
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate('/lobby')}
          style={{
            position: 'absolute', top: '20px', left: '20px',
            background: 'transparent', border: '2px solid #00ffff',
            color: '#00ffff',
            fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', letterSpacing: '2px',
            textShadow: '0 0 10px #00ffff',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)',
            padding: '8px 15px', borderRadius: '5px',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#ffffff';
            e.target.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.8)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#00ffff';
            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
          }}
        >
          {"<"} KEMBALI
        </button>

        <h1 style={{
          textAlign: 'center', fontSize: '38px', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff00ff, #ff66ff, #00ffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255, 0, 255, 0.8)',
          filter: 'drop-shadow(0 0 20px rgba(255, 0, 255, 0.6))',
          letterSpacing: '8px',
          marginTop: '25px', marginBottom: '30px'
        }}>
          HIGH SCORES
        </h1>

        {/* Area Tabel */}
        <div style={{
          backgroundColor: 'rgba(13, 13, 26, 0.8)',
          border: '2px solid #9933ff',
          borderRadius: '8px', padding: '20px', minHeight: '300px',
          boxShadow: 'inset 0 0 30px rgba(153, 51, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2)'
        }}>
          
          {/* Header Tabel */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ff00ff',
            paddingBottom: '12px', marginBottom: '15px', 
            color: '#ff66ff', fontWeight: 'bold',
            letterSpacing: '2px', fontSize: '14px',
            textShadow: '0 0 10px rgba(255, 102, 255, 0.6)'
          }}>
            <div style={{ flex: 1 }}>PLAYER NISN</div>
            <div style={{ flex: 1, textAlign: 'center' }}>MISSION</div>
            <div style={{ flex: 1, textAlign: 'right' }}>SCORE</div>
          </div>

          {/* Isi Data yang ditarik dari Database */}
          {loading ? (
            <div style={{ textAlign: 'center', color: '#00ffff', marginTop: '40px', letterSpacing: '2px', textShadow: '0 0 15px #00ffff' }}>
              MEMUAT DATA DATABASE...
            </div>
          ) : scores.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#ff66ff', marginTop: '40px', textShadow: '0 0 10px rgba(255, 102, 255, 0.5)' }}>
              BELUM ADA DATA SKOR.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {scores.map((item, index) => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  // Juara 1 akan berwarna cyan terang, sisanya pink/ungu neon
                  color: index === 0 ? '#00ffff' : '#ff66ff',
                  fontWeight: index === 0 ? 'bold' : 'normal',
                  textShadow: index === 0 ? '0 0 15px #00ffff' : '0 0 10px rgba(255, 102, 255, 0.6)',
                  fontSize: index === 0 ? '16px' : '14px',
                  padding: '10px',
                  borderRadius: '5px',
                  background: index === 0 ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                  border: index === 0 ? '1px solid rgba(0, 255, 255, 0.3)' : 'none'
                }}>
                  <div style={{ flex: 1 }}>{item.nisn}</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>{item.mata_pelajaran}</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>{item.skor} PTS</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Database */}
        <div style={{
          textAlign: 'center', marginTop: '25px',
          background: 'linear-gradient(90deg, #9933ff, #ff00ff, #00ffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '12px', letterSpacing: '5px', fontWeight: 'bold',
          filter: 'drop-shadow(0 0 8px rgba(255, 0, 255, 0.6))'
        }}>
          MAJOO! DATABASE SYSTEM
        </div>
      </div>
    </div>
  );
};

export default ScoreHistory;