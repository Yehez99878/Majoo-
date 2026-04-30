import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Mengecek kecocokan data ke tabel users di Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('nisn', nisn)
      .eq('password', password)
      .single();

    if (data) {
      // Jika berhasil, pindah ke halaman Lobby
      navigate('/lobby');
    } else {
      alert('Akses Ditolak: NISN atau Password salah!');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {/* Kotak Login bergaya Arcade */}
      <div className="border-4 border-pink-500 bg-black/80 p-8 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.8)] w-96 text-white">
        <h2 className="text-3xl text-center mb-8 font-bold text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,1)] tracking-widest">MAJOO!</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-cyan-400 font-bold">{">"} ENTER NISN_</label>
            <input 
              type="text" 
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              className="w-full bg-transparent border-b-2 border-pink-500 p-2 outline-none focus:border-cyan-400 transition-colors text-white"
              placeholder="51425313"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-cyan-400 font-bold">{">"} PASSWORD_</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-pink-500 p-2 outline-none focus:border-cyan-400 transition-colors text-white"
              placeholder="********"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-3 mt-4 rounded hover:bg-yellow-300 transform active:scale-95 transition-all shadow-[4px_4px_0px_#b45309]"
          >
            START GAME
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;