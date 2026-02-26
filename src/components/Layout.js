import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Inbox, PhoneCall, Bell, LogOut, Send, History, Shield, Camera, X, ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCcw, Menu } from 'lucide-react';
import { ROLES } from '../data';

// --- Shared Styles ---
const styles = {
  glassPanel: 'bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
  sunken: 'bg-gray-100/50 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] border border-black/5',
  raised: 'bg-white/40 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.6)] border border-white/50',
  activeBtn: 'bg-gray-500 text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] border border-gray-600',
  toggleActive: 'bg-green-500 shadow-inner',
  toggleInactive: 'bg-gray-300 shadow-inner',
};

// notifications props-ийг нэмж хүлээж авдаг болгосон
export default function Layout({ children, currentRole, setCurrentRole, activeTab, setActiveTab, pendingCount, notifications = [], onLogout }) {
  
  // --- States ---
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [userName, setUserName] = useState("Админ");
  const [userAvatar] = useState("https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop");
  
  const prevPendingCountRef = useRef(pendingCount);

  // --- Audio Effect ---
  useEffect(() => {
    if (pendingCount > prevPendingCountRef.current && soundEnabled) {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
    prevPendingCountRef.current = pendingCount;
  }, [pendingCount, soundEnabled]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (e) => {
        if (!e.target.closest('.notification-container')) {
            setIsNotifOpen(false);
        }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
  };

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Хяналтын самбар';
      case 'inbox': return 'Хүсэлтүүд';
      case 'sent': return 'Илгээсэн (Хүлээгдэж буй)';
      case 'history': return 'Шийдвэрлэсэн түүх';
      case 'operator': return 'Оператор бүртгэл';
      case 'permissions': return 'Эрх тохиргоо';
      default: return 'Хяналтын самбар';
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Хяналт' },
    { id: 'inbox', icon: Inbox, label: 'Хүсэлтүүд', count: pendingCount },
    { id: 'sent', icon: Send, label: 'Илгээсэн' },
    { id: 'history', icon: History, label: 'Түүх' },
    ...(currentRole === ROLES.SUPER_ADMIN ? [{ id: 'operator', icon: PhoneCall, label: 'Оператор' }] : []),
    { id: 'permissions', icon: Shield, label: 'Эрх' }
  ];

  return (
    <div className="flex h-screen w-screen bg-[#f3f4f6] font-sans overflow-hidden">
        
      {/* Global Styles for Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}</style>
      
      {/* SIDEBAR - DESKTOP (Hidden on mobile, shown on lg screens) */}
      <div 
        className={`hidden lg:flex ${isCollapsed ? 'w-24' : 'w-72'} h-full flex-col ${styles.glassPanel} z-[100] relative transition-all duration-300 ease-in-out`}
      >
        {/* Collapse Button */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-10 w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 z-50 transition-transform active:scale-95 ${styles.raised}`}
        >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* LOGO */}
        <div className={`flex justify-center transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-6'}`}>
            <div className={`relative w-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl shadow-[0_5px_0_rgb(209,213,219),0_10px_10px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white/60 transform transition-all group ${isCollapsed ? 'h-20' : 'h-28'}`}>
                <img 
                    src={isCollapsed ? "/1bichil-logo-white.png" : "/bichil-logo-white.png"} 
                    alt="Logo" 
                    className={`object-contain transition-all duration-300 ${isCollapsed ? 'h-12 w-12' : 'h-20 w-auto'}`}
                    onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}} 
                />
                <span className="hidden text-gray-400 font-black text-xs">LOGO</span>
            </div>
        </div>

        {/* MENU */}
        <nav className={`flex-1 px-4 space-y-3 mt-2 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto custom-scrollbar'}`}>
          {menuItems.map((item) => (
             <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`
                  relative w-full flex items-center 
                  ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} 
                  py-3.5 rounded-2xl transition-all duration-300 
                  font-bold text-xs uppercase tracking-wide group 
                  ${activeTab === item.id ? styles.activeBtn : styles.raised}
                  ${activeTab !== item.id ? 'text-gray-600 hover:text-gray-900' : ''}
                `}
             >
                <div className="flex items-center gap-3">
                    <item.icon size={20} className={isCollapsed && activeTab !== item.id ? "text-gray-500" : ""} />
                    {!isCollapsed && <span>{item.label}</span>}
                </div>
                
                {!isCollapsed && activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                
                {/* Badge (Collapsed) */}
                {isCollapsed && item.count > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm"></span>
                )}
                {/* Badge (Expanded) */}
                {!isCollapsed && item.count > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">{item.count}</span>
                )}

                {/* --- MESSENGER STYLE TOOLTIP --- */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 z-[999] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-x-2 group-hover:translate-x-0 w-max">
                    <div className="relative bg-gray-500 text-white text-[11px] font-bold py-2 px-4 rounded-2xl shadow-xl whitespace-nowrap">
                      {item.label}
                      {/* Left Arrow (Tail) */}
                      <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-gray-500"></div>
                    </div>
                  </div>
                )}
             </button>
          ))}
        </nav>

        {/* PROFILE */}
        <div className={`p-4 transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            <div className={`p-3 rounded-3xl ${styles.raised} w-full`}>
                {!isCollapsed && (
                    <>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-2 block">Эрх (Demo)</label>
                        <select value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} className={`w-full ${styles.sunken} text-xs font-bold bg-transparent border-none rounded-xl px-2 py-2 outline-none cursor-pointer mb-3`}>
                            <option value={ROLES.SUPER_ADMIN}>1. Төв Админ</option>
                            <option value={ROLES.BRANCH_ADMIN}>2. Салбар</option>
                            <option value={ROLES.DIRECT_ADMIN}>3. Шууд</option>
                        </select>
                    </>
                )}

                <div 
                    onClick={() => setIsProfileModalOpen(true)}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-1.5 rounded-2xl hover:bg-gray-100/50 cursor-pointer transition-colors group relative`}
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
                            <img src={userAvatar} alt="admin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{userName}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{currentRole.replace('_', ' ')}</p>
                            </div>
                            
                            {/* LOGOUT BUTTON WITH CONFIRMATION */}
                            <LogOut 
                                size={16} 
                                className="text-gray-400 hover:text-red-500 transition-colors z-10" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if(window.confirm("Та системээс гарахдаа итгэлтэй байна уу?")) {
                                        if (onLogout) onLogout();
                                    }
                                }} 
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY - Shows on mobile, hidden on lg screens */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-[90] lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Mobile Sidebar Drawer */}
          <div 
            className={`fixed left-0 top-0 h-screen w-72 ${styles.glassPanel} z-[95] flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
          >
            {/* Close Button - Hidden, backdrop click closes instead */}

            {/* LOGO */}
            <div className="flex justify-center p-6">
              <div className="relative w-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl shadow-[0_5px_0_rgb(209,213,219),0_10px_10px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white/60 transform transition-all group h-28">
                <img 
                  src="/bichil-logo-white.png" 
                  alt="Logo" 
                  className="object-contain h-20 w-auto transition-all duration-300"
                  onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}} 
                />
                <span className="hidden text-gray-400 font-black text-xs">LOGO</span>
              </div>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-4 space-y-3 mt-2 overflow-y-auto custom-scrollbar">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => { 
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }} 
                  className={`
                    relative w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 
                    font-bold text-xs uppercase tracking-wide group 
                    ${activeTab === item.id ? styles.activeBtn : styles.raised}
                    ${activeTab !== item.id ? 'text-gray-600 hover:text-gray-900' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  
                  {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                  
                  {item.count > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">{item.count}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* PROFILE */}
            <div className="p-4">
              <div className={`p-3 rounded-3xl ${styles.raised} w-full`}>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-2 block">Эрх (Demo)</label>
                <select value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} className={`w-full ${styles.sunken} text-xs font-bold bg-transparent border-none rounded-xl px-2 py-2 outline-none cursor-pointer mb-3`}>
                  <option value={ROLES.SUPER_ADMIN}>1. Төв Админ</option>
                  <option value={ROLES.BRANCH_ADMIN}>2. Салбар</option>
                  <option value={ROLES.DIRECT_ADMIN}>3. Шууд</option>
                </select>

                <div 
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-100/50 cursor-pointer transition-colors group relative"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
                      <img src={userAvatar} alt="admin" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{userName}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{currentRole.replace('_', ' ')}</p>
                  </div>
                  
                  <LogOut 
                    size={16} 
                    className="text-gray-400 hover:text-red-500 transition-colors z-10" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(window.confirm("Та системээс гарахдаа итгэлтэй байна уу?")) {
                        if (onLogout) onLogout();
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* HEADER */}
        <header className="h-24 px-4 sm:px-10 flex items-center justify-between z-40 shrink-0 relative">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight drop-shadow-sm">{getPageTitle()}</h1>
            <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest opacity-70">
               {new Date().toLocaleDateString('mn-MN')} • Систем
            </p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
             {/* Notification Bell */}
             <div className="relative notification-container">
                 <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${styles.raised} relative hover:scale-105 transition-transform active:scale-95 group ${isNotifOpen ? 'bg-white shadow-inner' : ''}`}
                 >
                    <Bell size={20} className={`transition-colors ${isNotifOpen ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-800'}`} />
                    
                    {/* NUMBER BADGE */}
                    {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white shadow-sm z-20 animate-bounce-slow">
                            {pendingCount}
                        </span>
                    )}
                 </button>

                 {/* Notification Dropdown - Responsive positioning */}
                 {isNotifOpen && (
                    <div className={`absolute right-0 top-14 w-80 sm:w-96 max-w-[calc(100vw-2rem)] ${styles.glassPanel} bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-4 animate-scaleIn z-[100] border border-gray-100`}>
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 text-sm">Мэдэгдэл</h3>
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{pendingCount} шинэ</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                            {pendingCount > 0 ? (
                                // Use the passed notifications prop to render
                                (notifications.length > 0 ? notifications : [...Array(pendingCount)]).map((item, i) => {
                                    // Logic to determine text based on status
                                    const isReturned = item && item.status === 'Returned';
                                    const title = isReturned ? "Буцаалт ирлээ!" : "Шинэ хүсэлт ирлээ!";
                                    const desc = isReturned 
                                        ? "Салбараас буцаагдсан. Шалгана уу." 
                                        : "Дөнгөж сая • Хүсэлтүүд цэс рүү орж шалгана уу.";
                                    const iconColor = isReturned ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600";

                                    return (
                                        <div 
                                          key={i} 
                                          className="flex gap-3 items-start p-3 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-100" 
                                          onClick={() => { 
                                              setActiveTab('inbox'); 
                                              setIsNotifOpen(false); 
                                          }}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${iconColor}`}>
                                                {isReturned ? <RotateCcw size={14} /> : <Inbox size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{title}</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-xs text-gray-400 py-4">Шинэ мэдэгдэл алга.</p>
                            )}
                        </div>
                    </div>
                 )}
             </div>

             {/* Mobile Menu Button - Shows only on mobile */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center ${styles.raised} hover:scale-105 transition-transform active:scale-95`}
             >
               <Menu size={20} className="text-gray-600" />
             </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pb-10 z-0 custom-scrollbar relative">
          {children}
        </main>
      </div>

      {/* --- PROFILE MODAL --- */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsProfileModalOpen(false)}>
            <div className={`w-full max-w-sm ${styles.glassPanel} bg-white/90 rounded-[2rem] p-6 shadow-2xl relative`} onClick={e => e.stopPropagation()}>
                <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"><X size={20}/></button>
                
                <h3 className="text-lg font-extrabold text-gray-800 text-center mb-6 uppercase tracking-wider">Профайл засах</h3>
                
                <form onSubmit={handleSaveProfile} className="flex flex-col items-center space-y-6">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>

                    <div className="w-full space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-1 block">Нэр</label>
                            <input 
                                type="text" 
                                value={userName} 
                                onChange={(e) => setUserName(e.target.value)} 
                                className={`${styles.sunken} w-full rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:bg-white`}
                            />
                        </div>
                        
                        <div className={`flex items-center justify-between p-3 rounded-xl ${styles.raised}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                    {soundEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}
                                </div>
                                <span className="text-xs font-bold text-gray-700">Мэдэгдлийн дуу</span>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${soundEnabled ? styles.toggleActive : styles.toggleInactive}`}
                            >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${soundEnabled ? 'left-5' : 'left-0.5'}`}></span>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={`w-full py-3.5 rounded-xl font-bold text-sm text-white ${styles.activeBtn} tracking-widest hover:bg-gray-900 transition-colors`}>
                        ХАДГАЛАХ
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}