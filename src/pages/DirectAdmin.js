import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Filter, Calendar, Send, User, MapPin, FileText, Search, X, CheckCircle, Clock, CheckSquare, Edit3, Headset, ChevronDown, Check, Star, Paperclip, Briefcase } from 'lucide-react';
import Dashboard from '../components/Dashboard';

// --- Shared Styles (Matching SuperAdmin) ---
const styles = {
  glassCard: 'bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] relative z-10',
  sunken: 'bg-gray-100/50 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] border border-black/5',
  raised: 'bg-white/40 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.6)] border border-white/50',
  primaryButton: `
    bg-gray-900/40 backdrop-blur-md 
    text-white border border-white/20 
    shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] 
    hover:bg-gray-900/60 hover:shadow-[0_10px_25px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] 
    active:scale-[0.98] active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)]
    transition-all duration-300
  `,
  inputBase: 'w-full bg-gray-100/50 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] border border-black/5 rounded-2xl px-4 py-3 outline-none text-gray-800 placeholder-gray-500 text-sm font-semibold tracking-wide transition-all focus:bg-white/60',
  textLabel: 'text-[11px] font-bold mb-2 ml-2 text-gray-600 tracking-widest uppercase',
};

// --- Custom Dropdown Component ---
const CustomSelect = ({ options, value, onChange, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${styles.sunken} rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all bg-gray-50`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
           {Icon && <Icon size={16} className="text-gray-500" />}
           <span className={`text-xs font-bold ${value && value !== 'All' ? 'text-gray-800' : 'text-gray-500'} truncate`}>
             {value === 'All' ? placeholder : value}
           </span>
        </div>
        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn border border-white/60">
          <div className="max-h-56 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {options.map((option, index) => (
              <div 
                key={index}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-between
                  ${value === option ? 'bg-gray-700 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                {option}
                {value === option && <Check size={14} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Render Stars
const renderStars = (count) => {
    if (!count) return <span className="text-gray-300 text-[10px]">-</span>;
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={10} className={i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
    );
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'Pending': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700">Хүлээгдэж буй</span>;
    case 'Processing': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">Шийдвэрлэгдэж байна</span>;
    case 'Resolved': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Шийдвэрлэсэн</span>;
    default: return status;
  }
};

export default function DirectAdmin({ activeTab, requests, setRequests }) {
  // --- STATE ---
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  // --- FILTERS STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('All');

  // --- ACTIONS ---
  const handleUpdateStatus = (newStatus) => {
    const currentDate = new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString('mn-MN', {hour: '2-digit', minute:'2-digit'});
    
    // Update the requests list
    setRequests(prev => prev.map(r => 
        r.id === selectedRequest.id 
        ? { 
            ...r, 
            status: newStatus, 
            resolution: resolutionText,
            resolved_at: newStatus === 'Resolved' ? currentDate : r.resolved_at,
            assigned_at: newStatus === 'Processing' ? currentDate : r.assigned_at
          } 
        : r
    ));
    
    setSelectedRequest(null);
    setResolutionText('');
  };

  const clearFilters = () => {
    setSearchTerm(''); setFilterDate(''); setFilterType('All');
  };

  // Only show Direct requests
  const myRequests = requests.filter(r => r.isDirect);

  // --- DATA FILTERING ---
  const filterData = (data) => {
    return data.filter(r => {
        if (filterType !== 'All' && r.type !== filterType) return false;
        if (searchTerm) { const lower = searchTerm.toLowerCase(); if (!r.user.toLowerCase().includes(lower) && !r.phone?.includes(searchTerm) && !r.id.toString().includes(searchTerm)) return false; }
        if (filterDate && !r.created_at.includes(filterDate)) return false;
        return true;
    });
  };

  // 1. Inbox (Pending)
  const inboxData = filterData(myRequests.filter(r => r.status === 'Pending'));

  // 2. Sent/Processing (Шийдвэрлэгдэж байна)
  const processingData = filterData(myRequests.filter(r => r.status === 'Processing'));

  // 3. History (Resolved)
  const historyData = filterData(myRequests.filter(r => r.status === 'Resolved'));

  const openModal = (row) => {
      setSelectedRequest(row);
      setResolutionText(row.resolution || '');
  };

  // --- FILTER BAR ---
  const FilterBar = ({ title, count }) => (
    <div className={`flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 ${styles.glassCard} p-6 rounded-3xl mb-4 relative z-30`}>
        <div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-wider uppercase opacity-80">{title}</h2>
            <p className="text-xs text-gray-500 mt-1 font-bold">Нийт: {count}</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
            <div className="w-full md:w-40">
                <input type="text" placeholder="Хайлт..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${styles.inputBase} py-3`} />
            </div>
            <div className="w-36">
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={`${styles.inputBase} py-3 uppercase text-gray-600`} />
            </div>
            <div className="w-40">
                <CustomSelect options={['All', 'Хүсэлт', 'Гомдол', 'Талархал']} value={filterType} onChange={setFilterType} placeholder="Бүх төрөл" icon={Filter} />
            </div>
            {(searchTerm || filterDate || filterType !== 'All') && (
                <button onClick={clearFilters} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors bg-white shadow-sm border border-gray-100"><X size={18} /></button>
            )}
        </div>
    </div>
  );

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      
      {activeTab === 'dashboard' && <Dashboard data={myRequests} />}

      {/* --- INBOX (PENDING) --- */}
      {activeTab === 'inbox' && (
        <div className="flex flex-col gap-4">
          <FilterBar title="Шууд харилцагчийн хүсэлтүүд" count={inboxData.length} />

          <div className={`${styles.glassCard} rounded-3xl overflow-hidden p-2`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>{['ID', 'Огноо', 'Төрөл', 'Хандсан', 'Ажилтан', 'Үнэлгээ', 'Файл', 'Хэрэглэгч', 'Төлөв', 'Үйлдэл'].map(h => <th key={h} className="p-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {inboxData.length === 0 ? (<tr><td colSpan="10" className="p-10 text-center text-gray-400 font-bold">Хүсэлт олдсонгүй</td></tr>) : (
                  inboxData.map(row => (
                    <tr key={row.id} className="hover:bg-white/40 transition-colors group">
                      <td className="p-4 text-xs font-bold text-gray-400">#{row.id}</td>
                      <td className="p-4 text-xs font-bold text-gray-600">{row.created_at.split(',')[0]}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${row.type==='Гомдол'?'bg-red-100 text-red-600': row.type==='Талархал' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{row.type}</span></td>
                      <td className="p-4 text-xs font-bold text-gray-700">{row.targetType === 'Employee' ? 'Хувь хүн' : 'Байгууллага'}</td>
                      <td className="p-4 text-xs text-gray-500 font-medium">{row.employeeName || 'Бичээгүй'}</td>
                      <td className="p-4">{renderStars(row.rating)}</td>
                      <td className="p-4">{row.file ? <span className="text-blue-500 flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:underline"><Paperclip size={10}/> Файл</span> : <span className="text-gray-300 text-[10px]">-</span>}</td>
                      <td className="p-4 text-sm font-bold text-gray-700">
                          {row.user}
                          <div className="text-[10px] text-gray-400 font-normal">{row.phone}</div>
                      </td>
                      <td className="p-4">{getStatusLabel(row.status)}</td>
                      <td className="p-4"><button onClick={() => openModal(row)} className={`py-2 px-4 ${styles.primaryButton} rounded-lg text-[10px] flex items-center gap-2`}>Шийдвэрлэх <ChevronRight size={12} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SENT (PROCESSING) --- */}
      {activeTab === 'sent' && (
        <div className="flex flex-col gap-4">
           <FilterBar title="Шийдвэрлэгдэж буй (Илгээсэн)" count={processingData.length} />
           <div className={`${styles.glassCard} rounded-3xl overflow-hidden p-2`}>
             <table className="w-full text-left">
               <thead>
                 <tr>{['ID', 'Төрөл', 'Хандсан', 'Ажилтан', 'Файл', 'Тэмдэглэл', 'Хэрэглэгч', 'Төлөв', 'Эхэлсэн', 'Үйлдэл'].map(h => <th key={h} className="p-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase">{h}</th>)}</tr>
               </thead>
               <tbody className="divide-y divide-gray-200/50">
                 {processingData.length === 0 ? (
                    <tr><td colSpan="10" className="p-10 text-center text-gray-400 font-bold">Одоогоор шийдвэрлэгдэж буй хүсэлт алга</td></tr>
                 ) : (
                    processingData.map(row => (
                    <tr key={row.id} className="hover:bg-white/40 group">
                        <td className="p-4 text-xs font-bold text-gray-400">#{row.id}</td>
                        <td className="p-4"><span className="text-xs font-bold text-gray-700">{row.type}</span></td>
                        <td className="p-4 text-xs font-bold text-gray-700">{row.targetType === 'Employee' ? 'Хувь хүн' : 'Байгууллага'}</td>
                        <td className="p-4 text-xs text-gray-500 font-medium">{row.employeeName || 'Бичээгүй'}</td>
                        <td className="p-4">{row.file ? <span className="text-blue-500 flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:underline"><Paperclip size={10}/> Файл</span> : <span className="text-gray-300 text-[10px]">-</span>}</td>
                        <td className="p-4 text-xs text-gray-600 max-w-xs truncate italic">{row.resolution || "Тэмдэглэл алга"}</td>
                        <td className="p-4 text-sm font-bold text-gray-700">
                            {row.user}
                            {row.isOperator && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider"><Headset size={12} className="mr-1"/> OP</span>}
                        </td>
                        <td className="p-4">{getStatusLabel(row.status)}</td>
                        <td className="p-4 text-xs text-gray-500 font-bold flex items-center gap-1"><Clock size={12}/> {row.assigned_at || '-'}</td>
                        <td className="p-4">
                            <button onClick={() => openModal(row)} className={`p-2 ${styles.primaryButton} rounded-lg`} title="Засах/Дуусгах"><Edit3 size={14} /></button>
                        </td>
                    </tr>
                    ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* --- HISTORY (RESOLVED) --- */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-4">
           <FilterBar title="Шийдвэрлэсэн түүх" count={historyData.length} />
           <div className={`${styles.glassCard} rounded-3xl overflow-hidden p-2`}>
             <table className="w-full text-left">
               <thead>
                 <tr>{['ID', 'Төрөл', 'Хандсан', 'Ажилтан', 'Үнэлгээ', 'Файл', 'Хэрэглэгч', 'Шийдэл', 'Дууссан', 'Төлөв'].map(h => <th key={h} className="p-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase">{h}</th>)}</tr>
               </thead>
               <tbody className="divide-y divide-gray-200/50">
                 {historyData.length === 0 ? (
                    <tr><td colSpan="10" className="p-10 text-center text-gray-400 font-bold">Түүх одоогоор хоосон байна</td></tr>
                 ) : (
                    historyData.map(row => (
                    <tr key={row.id} className="hover:bg-green-50/20">
                        <td className="p-4 text-xs font-bold text-gray-400">#{row.id}</td>
                        <td className="p-4"><span className="text-xs font-bold text-gray-700">{row.type}</span></td>
                        <td className="p-4 text-xs font-bold text-gray-700">{row.targetType === 'Employee' ? 'Хувь хүн' : 'Байгууллага'}</td>
                        <td className="p-4 text-xs text-gray-500 font-medium">{row.employeeName || 'Бичээгүй'}</td>
                        <td className="p-4">{renderStars(row.rating)}</td>
                        <td className="p-4">{row.file ? <span className="text-blue-500 flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:underline"><Paperclip size={10}/> Файл</span> : <span className="text-gray-300 text-[10px]">-</span>}</td>
                        <td className="p-4 text-sm font-bold text-gray-700">
                            {row.user}
                            {row.isOperator && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider"><Headset size={12} className="mr-1"/> OP</span>}
                        </td>
                        <td className="p-4 text-xs text-gray-700 font-medium max-w-xs truncate" title={row.resolution}>{row.resolution}</td>
                        <td className="p-4 text-xs text-gray-700 font-bold">{row.resolved_at ? <span className="flex items-center gap-1"><CheckSquare size={10} className="text-green-600"/>{row.resolved_at}</span> : '-'}</td>
                        <td className="p-4">{getStatusLabel(row.status)}</td>
                    </tr>
                    ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedRequest(null)}>
           <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-6 relative z-50" onClick={e=>e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                     <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">#{selectedRequest.id} Хүсэлт шийдвэрлэх</h2>
                     <p className="text-xs text-gray-500 mt-1 font-bold flex items-center gap-1"><User size={10} /> Хандсан: <span className="text-gray-800">{selectedRequest.recipient || 'Шууд'}</span></p>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedRequest.type==='Гомдол'?'bg-red-100 text-red-600':'bg-blue-100 text-blue-600'}`}>{selectedRequest.type}</div>
              </div>
              
              <div className="space-y-6">
                 <div className={`flex gap-4 items-start p-4 ${styles.raised} rounded-2xl`}>
                    <div className={`p-3 ${styles.sunken} rounded-full`}><User size={20} className="text-gray-600"/></div>
                    <div>
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            {selectedRequest.user}
                            {selectedRequest.isOperator && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded flex items-center font-bold uppercase"><Headset size={10} className="mr-1"/>OP</span>}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2 font-bold">{selectedRequest.phone}</p>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedRequest.desc}"</p>
                    </div>
                 </div>
                 
                 <div>
                    <label className={styles.textLabel}><FileText size={14} className="inline mr-1"/> Тэмдэглэл / Шийдвэр</label>
                    <textarea rows="6" className={`${styles.inputBase} resize-none`} placeholder="Шийдвэрлэх явц эсвэл хариу..." value={resolutionText} onChange={(e) => setResolutionText(e.target.value)}></textarea>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <button 
                        onClick={() => handleUpdateStatus('Processing')} 
                        disabled={!resolutionText.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-xs tracking-widest flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Briefcase size={16}/> ШИЙДВЭРЛЭГДЭЖ БАЙНА
                    </button>
                    
                    <button 
                        onClick={() => handleUpdateStatus('Resolved')} 
                        disabled={!resolutionText.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-xs tracking-widest flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <CheckCircle size={16}/> ШИЙДВЭРЛЭСЭН
                    </button>
                 </div>
              </div>
              <div className="mt-4 text-center"><button onClick={() => setSelectedRequest(null)} className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider">Хаах</button></div>
           </div>
        </div>
      )}
    </div>
  );
}