import React, { useState } from 'react';
import { User, Lock, ArrowRight, Activity } from 'lucide-react';
import { ROLES } from '../data';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Өөрчлөлт: Ашиглагдаагүй error state-ийг хассан

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Нэвтрэх процессийг дууриах (Simulate API call)
    setTimeout(() => {
      // Логик: Нэвтрэх нэрээс хамаарч эрхийг тодорхойлох (Демо зорилгоор)
      let detectedRole = ROLES.SUPER_ADMIN; // Default

      const lowerUser = username.toLowerCase().trim();

      if (lowerUser.includes('branch')) {
        detectedRole = ROLES.BRANCH_ADMIN;
      } else if (lowerUser.includes('direct')) {
        detectedRole = ROLES.DIRECT_ADMIN;
      } else {
        detectedRole = ROLES.SUPER_ADMIN; // 'admin' гэж бичвэл энд орно
      }

      onLogin(detectedRole);
      setLoading(false);
    }, 1500);
  };

  const styles = {
    glassCard: 'bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
    inputBase: 'w-full bg-gray-50/50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] border border-gray-200/50 rounded-xl px-10 py-3.5 outline-none text-gray-700 placeholder-gray-400 text-sm font-semibold transition-all focus:bg-white/80 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.02)]',
    primaryButton: `
      w-full bg-gray-900/80 backdrop-blur-md text-white border border-white/10 
      shadow-[0_10px_20px_rgba(0,0,0,0.2)] rounded-xl py-4
      font-bold tracking-widest text-xs uppercase
      hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]
      transition-all duration-300 flex items-center justify-center gap-2
    `
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#eef2f6]">
      
      {/* --- Background Abstract Shapes --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-indigo-300/20 rounded-full blur-[80px]" />

      {/* --- Main Login Card --- */}
      <div className={`relative z-10 w-full max-w-md p-8 m-4 rounded-3xl ${styles.glassCard} animate-fadeIn`}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/80 to-white/20 shadow-lg mb-4 text-gray-800">
            <Activity size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight mb-1 uppercase">КУБ САНАЛ ХҮСЭЛТ</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Системд нэвтрэх</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username */}
          <div className="relative group">
            <User size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-gray-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Нэвтрэх нэр (admin, branch, direct)" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.inputBase}
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-gray-800 transition-colors" />
            <input 
              type="password" 
              placeholder="Нууц үг" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputBase}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Уншиж байна...
              </>
            ) : (
              <>
                НЭВТРЭХ <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Бичил Глобус ББСБ © 2024
            </p>
        </div>
      </div>
    </div>
  );
}