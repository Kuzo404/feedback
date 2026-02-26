import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Filter, Send, User, MapPin, FileText, X, CheckCircle, Clock, CheckSquare, Edit3, Headset, ChevronDown, Check, Star, Paperclip, Building, Upload } from 'lucide-react';
import { BRANCHES } from '../data'; 
import Dashboard from '../components/Dashboard';

// --- Styles from App.js ---
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
           <span className={`text-xs font-bold ${value && value !== 'All' && value !== 'Бүгд' ? 'text-gray-800' : 'text-gray-500'} truncate`}>
             {value === 'All' ? placeholder : value}
           </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn border border-white/60">
          <div className="max-h-56 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {options.map((option, index) => (
              <div 
                key={index}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-between
                  ${value === option 
                    ? 'bg-gray-200 text-gray-500 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
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
    case 'Assigned': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">Салбарт илгээсэн</span>;
    case 'Resolved': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Шийдвэрлэсэн</span>;
    case 'Returned': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">Буцаагдсан</span>;
    default: return status;
  }
};

export default function SuperAdmin({ activeTab, requests, setRequests, assignBranch, handleSendRequest }) {
  // --- STATE ---
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedBranchToAssign, setSelectedBranchToAssign] = useState(null); 
  const [resolutionText, setResolutionText] = useState('');

  // --- OPERATOR FORM STATE ---
  const [opTab, setOpTab] = useState('person');
  const [opRating, setOpRating] = useState(0);
  const [opExplodingStar, setOpExplodingStar] = useState(null);
  
  const [opForm, setOpForm] = useState({
      lastName: '', firstName: '', phone: '', branch: '',
      orgName: '', orgInfo: '',
      feedbackType: 'Хүсэлт', recipient: '', desc: '', employeeName: '', file: null,
      isActive: true 
  });

  // --- FILTERS STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOperator, setFilterOperator] = useState('Бүгд'); // Operator filter state

  const recipients = ['Менежер', 'Салбарын захирал', 'Хүний нөөц', 'Маркетинг алба'];

  // --- OPERATOR LOGIC ---
  const handleOpStarClick = (star) => {
    if (star === 1 && opRating === 1) {
      setOpRating(0);
      return;
    }
    setOpRating(star);
    setOpExplodingStar(star);
    setTimeout(() => setOpExplodingStar(null), 800); 
  };

  const handleOperatorSubmit = () => {
    const currentDate = new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString('mn-MN', {hour: '2-digit', minute:'2-digit'});
    
    const userName = opTab === 'person' 
        ? opForm.firstName
        : 'Байгууллага'; 

    const newReq = {
      id: Date.now(), 
      user: userName,
      phone: opForm.phone,
      type: opForm.feedbackType,
      desc: opForm.desc,
      branch: opForm.branch,
      
      status: 'Pending', 
      created_at: currentDate, 
      assigned_at: null,
      isDirect: false,
      isOperator: opForm.isActive,
      resolution: '',
      
      targetType: opTab === 'person' ? 'Employee' : 'Organization',
      employeeName: opForm.employeeName,
      rating: opRating,
      file: opForm.file ? 'file_uploaded' : null,
      recipient: opForm.recipient
    };

    setRequests([newReq, ...requests]);
    alert("Амжилттай илгээгдлээ! (Ирсэн хүсэлтүүд рүү орсон)");
    
    setOpTab('person');
    setOpRating(0);
    setOpForm({
        lastName: '', firstName: '', phone: '', branch: '',
        orgName: '', orgInfo: '',
        feedbackType: 'Хүсэлт', recipient: '', desc: '', employeeName: '', file: null,
        isActive: true
    });
  };

  // --- FINAL RESOLVE/ASSIGN LOGIC ---
  const handleFinalSubmit = () => {
    const currentDate = new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString('mn-MN', {hour: '2-digit', minute:'2-digit'});

    const updatedList = requests.map(req => {
        if (req.id === selectedRequest.id) {
            if (selectedBranchToAssign) {
                return {
                    ...req,
                    branch: selectedBranchToAssign,
                    resolution: resolutionText,
                    status: 'Assigned', 
                    assigned_at: currentDate 
                };
            } 
            else {
                return {
                    ...req,
                    resolution: resolutionText,
                    status: 'Resolved',
                    resolved_at: currentDate,
                    branch: null 
                };
            }
        }
        return req;
    });

    setRequests(updatedList);
    setSelectedRequest(null);
  };

  const clearFilters = () => {
    setSearchTerm(''); setFilterDate(''); setFilterType('All'); setFilterBranch('All'); setFilterStatus('All'); setFilterOperator('Бүгд');
  };

  // --- DATA FILTERING ---
  // inboxData одоо 'Pending' БОЛОН 'Returned' төлөвтэйг харуулна
  const inboxData = requests.filter(r => (r.status === 'Pending' || r.status === 'Returned')).filter(r => {
      if (filterType !== 'All' && r.type !== filterType) return false;
      if (filterBranch !== 'All' && r.branch !== filterBranch) return false;
      if (filterOperator === 'Оператор' && !r.isOperator) return false;
      if (filterOperator === 'Энгийн' && r.isOperator) return false;

      if (searchTerm) { const lower = searchTerm.toLowerCase(); if (!r.user.toLowerCase().includes(lower) && !r.phone?.includes(searchTerm) && !r.id.toString().includes(searchTerm)) return false; }
      if (filterDate && !r.created_at.includes(filterDate)) return false;
      return true;
  });

  const sentData = requests.filter(r => r.status === 'Assigned').filter(r => {
        if (filterType !== 'All' && r.type !== filterType) return false;
        if (filterBranch !== 'All' && r.branch !== filterBranch) return false;
        if (filterOperator === 'Оператор' && !r.isOperator) return false;
        if (filterOperator === 'Энгийн' && r.isOperator) return false;

        if (filterDate && !r.assigned_at?.includes(filterDate)) return false;
        if (searchTerm) { const lower = searchTerm.toLowerCase(); if (!r.user.toLowerCase().includes(lower) && !r.id.toString().includes(searchTerm)) return false; }
        return true;
    });

  const historyData = requests.filter(r => r.status === 'Resolved').filter(r => {
        if (filterType !== 'All' && r.type !== filterType) return false;
        if (filterBranch !== 'All' && r.branch !== filterBranch) return false;
        if (filterOperator === 'Оператор' && !r.isOperator) return false;
        if (filterOperator === 'Энгийн' && r.isOperator) return false;

        if (filterDate && !r.resolved_at?.includes(filterDate)) return false;
        if (searchTerm) { const lower = searchTerm.toLowerCase(); if (!r.user.toLowerCase().includes(lower) && !r.id.toString().includes(searchTerm)) return false; }
        return true;
    });

  const openModal = (row) => {
      setSelectedRequest(row);
      setResolutionText(row.resolution || ''); // Буцаагдсан бол тайлбар нь энд орж ирнэ
      setSelectedBranchToAssign(row.branch || null);
  };

  // --- FILTER BAR ---
  const FilterBar = ({ title, count, showBranch, showStatus, showOperator }) => (
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
            
            {showBranch && (
                <div className="w-40">
                    <CustomSelect options={['All', ...BRANCHES]} value={filterBranch} onChange={setFilterBranch} placeholder="Бүх салбар" icon={MapPin} />
                </div>
            )}

            {showStatus && (
                <div className="w-40">
                    <CustomSelect options={['All', 'Resolved']} value={filterStatus} onChange={setFilterStatus} placeholder="Бүх төлөв" icon={CheckCircle} />
                </div>
            )}

            {showOperator && (
                <div className="w-40">
                    <CustomSelect options={['Бүгд', 'Оператор', 'Энгийн']} value={filterOperator} onChange={setFilterOperator} placeholder="Хэрэглэгч" icon={Headset} />
                </div>
            )}

            {(searchTerm || filterDate || filterType !== 'All' || filterBranch !== 'All' || filterStatus !== 'All' || filterOperator !== 'Бүгд') && (
                <button onClick={clearFilters} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors bg-white shadow-sm border border-gray-100"><X size={18} /></button>
            )}
        </div>
    </div>
  );

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      
      <style>{`
        @keyframes flyOut {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: flyOut 0.8s ease-out forwards;
        }
      `}</style>
      
      {activeTab === 'dashboard' && <Dashboard data={requests} />}

      {/* --- INBOX --- */}
      {activeTab === 'inbox' && (
        <div className="flex flex-col gap-4">
          <FilterBar title="Ирсэн хүсэлтүүд" count={inboxData.length} showBranch={true} showOperator={true} />
          <div className={`${styles.glassCard} rounded-3xl overflow-x-auto p-2`}>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>{['ID', 'Огноо', 'Төрөл', 'Хандсан', 'Ажилтан', 'Үнэлгээ', 'Файл', 'Салбар', 'Хэрэглэгч', 'Төлөв', 'Үйлдэл'].map(h => <th key={h} className="p-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {inboxData.length === 0 ? (<tr><td colSpan="11" className="p-10 text-center text-gray-400 font-bold">Хүсэлт олдсонгүй</td></tr>) : (
                  inboxData.map(row => (
                    <tr key={row.id} className="hover:bg-white/40 transition-colors group">
                      <td className="p-4 text-xs font-bold text-gray-400 whitespace-nowrap">#{row.id}</td>
                      <td className="p-4 text-xs font-bold text-gray-600 whitespace-nowrap">{row.created_at.split(',')[0]}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${row.type==='Гомдол'?'bg-red-100 text-red-600': row.type==='Талархал' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{row.type}</span></td>
                      <td className="p-4 text-xs font-bold text-gray-700 whitespace-nowrap">{row.targetType === 'Employee' ? 'Хувь хүн' : 'Байгууллага'}</td>
                      <td className="p-4 text-xs text-gray-500 font-medium whitespace-nowrap">{row.employeeName || 'Бичээгүй'}</td>
                      <td className="p-4">{renderStars(row.rating)}</td>
                      <td className="p-4">{row.file ? <span className="text-blue-500 flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:underline whitespace-nowrap"><Paperclip size={10}/> Файл</span> : <span className="text-gray-300 text-[10px]">-</span>}</td>
                      <td className="p-4"><span className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100/80 px-2 py-1 rounded-lg w-max shadow-sm whitespace-nowrap"><MapPin size={12} className="text-gray-400"/> {row.branch || 'Сонгоогүй'}</span></td>
                      <td className="p-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                          {row.user}
                          {row.isOperator && <span title="Оператор бүртгэсэн" className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider"><Headset size={12} className="mr-1"/> OP</span>}
                          <div className="text-[10px] text-gray-400 font-normal">{row.phone}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">{getStatusLabel(row.status)}</td>
                      <td className="p-4 whitespace-nowrap"><button onClick={() => openModal(row)} className={`py-2 px-4 ${styles.primaryButton} rounded-lg text-[10px] flex items-center gap-2`}>Шийдвэрлэх <ChevronRight size={12} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SENT TAB --- */}
      {activeTab === 'sent' && (
        <div className="flex flex-col gap-4">
           <FilterBar title="Илгээсэн жагсаалт" count={sentData.length} showBranch={true} showOperator={true} />
           <div className={`${styles.glassCard} rounded-3xl overflow-x-auto p-2`}>
             <table className="w-full text-left min-w-[800px]">
               <thead>
                 <tr>{['ID', 'Төрөл', 'Хандсан', 'Ажилтан', 'Файл', 'Хэрэглэгч', 'Салбар', 'Тэмдэглэл', 'Төлөв', 'Огноо', 'Үйлдэл'].map(h => <th key={h} className="p-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase whitespace-nowrap">{h}</th>)}</tr>
               </thead>
               <tbody className="divide-y divide-gray-200/50">
                 {sentData.length === 0 ? (
                    <tr><td colSpan="11" className="p-10 text-center text-gray-400 font-bold">Илгээсэн хүсэлт одоогоор алга</td></tr>
                 ) : (
                    sentData.map(row => (
                    <tr key={row.id} className="hover:bg-white/40 group">
                        <td className="p-4 text-xs font-bold text-gray-400 whitespace-nowrap">#{row.id}</td>
                        <td className="p-4"><span className="text-xs font-bold text-gray-700">{row.type}</span></td>
                        <td className="p-4 text-xs font-bold text-gray-700 whitespace-nowrap">{row.targetType === 'Employee' ? 'Хувь хүн' : 'Байгууллага'}</td>
                        <td className="p-4 text-xs text-gray-500 font-medium whitespace-nowrap">{row.employeeName || 'Бичээгүй'}</td>
                        <td className="p-4">{row.file ? <span className="text-blue-500 flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:underline whitespace-nowrap"><Paperclip size={10}/> Файл</span> : <span className="text-gray-300 text-[10px]">-</span>}</td>
                        <td className="p-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                            {row.user}
                            {row.isOperator && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider"><Headset size={12} className="mr-1"/> OP</span>}
                        </td>
                        <td className="p-4"><span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg w-max shadow-sm whitespace-nowrap"><MapPin size={12}/> {row.branch}</span></td>
                        <td className="p-4 text-xs text-gray-600 max-w-xs truncate italic">{row.resolution || "Чиглэл бичээгүй"}</td>
                        <td className="p-4 whitespace-nowrap">{getStatusLabel(row.status)}</td>
                        <td className="p-4 text-xs text-gray-500 font-bold flex items-center gap-1 whitespace-nowrap"><Clock size={12}/> {row.assigned_at}</td>
                        <td className="p-4 whitespace-nowrap"><button onClick={() => openModal(row)} className={`p-2 ${styles.primaryButton} rounded-lg`} title="Засах"><Edit3 size={14} /></button></td>
                    </tr>
                    ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* --- HISTORY TAB --- */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-4">
           <FilterBar title="Шийдвэрлэсэн түүх" count={historyData.length} showBranch={true} showOperator={true} />
           <div className={`${styles.glassCard} rounded-3xl overflow-x-auto p-2`}>
             <table className="w-full text-left min-w-[800px]">
               <thead>
                 <tr>{['ID', 'Төрөл', 'Хандсан', 'Ажилтан', 'Үнэлгээ', 'Файл', 'Хэрэглэгч', 'Салбар', 'Хуваарилсан', 'Шийдвэрлэсэн', 'Шийдэл', 'Төлөв'].map(h => <th key={h} className="p-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase whitespace-nowrap">{h}</th>)}</tr>
               </thead>
               <tbody className="divide-y divide-gray-200/50">
                 {historyData.length === 0 ? (
                    <tr><td colSpan="12" className="p-10 text-center text-gray-400 font-bold">Түүх одоогоор хоосон байна</td></tr>
                 ) : (
                    historyData.map(row => (
                    <tr key={row.id} className="hover:bg-green-50/20">
                        <td className="p-4 text-xs font-bold text-gray-400 whitespace-nowrap">#{row.id}</td>
                        <td className="p-4"><span className="text-xs font-bold text-gray-700">{row.type}</span></td>
                        <td className="p-4 text-xs font-bold text-gray-700 whitespace-nowrap">{row.targetType === 'Employee' ? 'Хувь хүн' : 'Байгууллага'}</td>
                        <td className="p-4 text-xs text-gray-500 font-medium whitespace-nowrap">{row.employeeName || 'Бичээгүй'}</td>
                        <td className="p-4">{renderStars(row.rating)}</td>
                        <td className="p-4">{row.file ? <span className="text-blue-500 flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:underline whitespace-nowrap"><Paperclip size={10}/> Файл</span> : <span className="text-gray-300 text-[10px]">-</span>}</td>
                        <td className="p-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                            {row.user}
                            {row.isOperator && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider"><Headset size={12} className="mr-1"/> OP</span>}
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-600 whitespace-nowrap">{row.branch || '-'}</td>
                        <td className="p-4 text-xs text-gray-500 font-bold whitespace-nowrap">{row.assigned_at ? <span className="flex items-center gap-1"><Clock size={10}/>{row.assigned_at}</span> : '-'}</td>
                        <td className="p-4 text-xs text-gray-700 font-bold whitespace-nowrap">{row.resolved_at ? <span className="flex items-center gap-1"><CheckSquare size={10} className="text-green-600"/>{row.resolved_at}</span> : '-'}</td>
                        <td className="p-4 text-xs text-gray-700 font-medium max-w-xs truncate" title={row.resolution}>{row.resolution}</td>
                        <td className="p-4 whitespace-nowrap">{getStatusLabel(row.status)}</td>
                    </tr>
                    ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* --- OPERATOR TAB (Unified) --- */}
      {activeTab === 'operator' && (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className={`w-full max-w-5xl ${styles.glassCard} rounded-[2rem] p-6 md:p-8 transition-all duration-500 animate-fadeIn`}>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT SIDE: REQUEST FORM */}
                <div className="space-y-6">
                    <div className="relative flex items-center justify-center mb-6 w-full h-10 border-b border-gray-200/50 pb-4">
                        <h2 className="text-xl font-extrabold text-gray-800 tracking-wider uppercase text-center drop-shadow-sm opacity-80 whitespace-nowrap z-10">Хүсэлтийн хуудас</h2>
                    </div>

                    {/* Active/Inactive Toggle */}
                    <div className={`w-full h-12 rounded-xl p-1 mb-4 flex items-center ${styles.sunken}`}>
                      <button onClick={() => setOpForm({...opForm, isActive: true})} className={`flex-1 h-full rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all duration-300 ${opForm.isActive ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}>
                        <Headset size={14} /> ОПЕРАТОР
                      </button>
                      <button onClick={() => setOpForm({...opForm, isActive: false})} className={`flex-1 h-full rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all duration-300 ${!opForm.isActive ? 'bg-gray-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}>
                        <User size={14} /> ХЭРЭГЛЭГЧ
                      </button>
                    </div>

                    {/* Instruction Text */}
                    <p className="text-xs font-bold text-gray-500 text-center mb-2">
                        Та Ажилтанд хандах уу, Байгууллагад хандах уу? Доороос сонгоно уу.
                    </p>

                    {/* Tabs */}
                    <div className={`w-full h-14 rounded-2xl p-1.5 mb-4 flex items-center ${styles.sunken}`}>
                      <button onClick={() => setOpTab('person')} className={`flex-1 h-full rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${opTab === 'person' ? styles.primaryButton : 'text-gray-500 hover:text-gray-800'}`}>
                        <User size={16} /> АЖИЛТАН
                      </button>
                      <button onClick={() => setOpTab('org')} className={`flex-1 h-full rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${opTab === 'org' ? styles.primaryButton : 'text-gray-500 hover:text-gray-800'}`}>
                        <Building size={16} /> БАЙГУУЛЛАГА
                      </button>
                    </div>

                    {opTab === 'person' ? (
                        <div className="space-y-4">
                          {/* Овог хасагдсан */}
                          <div><label className={styles.textLabel}>Нэр <span className="text-red-500">*</span></label><input type="text" value={opForm.firstName} onChange={e=>setOpForm({...opForm, firstName: e.target.value})} placeholder="Болд" className={styles.inputBase} /></div>
                          <div><label className={styles.textLabel}>Утас <span className="text-red-500">*</span></label><input type="tel" value={opForm.phone} onChange={e=>setOpForm({...opForm, phone: e.target.value})} placeholder="9911xxxx" className={styles.inputBase} /></div>
                          <div className="relative z-20"><label className={styles.textLabel}>Салбар <span className="text-red-500">*</span></label><CustomSelect options={BRANCHES} value={opForm.branch} onChange={(val)=>setOpForm({...opForm, branch: val})} placeholder="Салбараа сонгоно уу" icon={MapPin} /></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Байгууллагын нэр хасагдсан */}
                          <div><label className={styles.textLabel}>Мэдээлэл <span className="text-red-500">*</span></label><textarea rows="6" value={opForm.orgInfo} onChange={e=>setOpForm({...opForm, orgInfo: e.target.value})} placeholder="Үйл ажиллагааны чиглэл..." className={`${styles.inputBase} resize-none`}></textarea></div>
                          <div><label className={styles.textLabel}>Файл</label><div className={`w-full h-24 ${styles.sunken} rounded-2xl flex flex-col items-center justify-center hover:bg-white/40 transition-colors cursor-pointer border-dashed border-2 border-transparent hover:border-gray-300`}><Upload size={20} className="text-gray-500 mb-2" /><p className="text-[10px] text-gray-500 font-bold uppercase">Файл оруулах</p></div></div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: FEEDBACK FORM */}
                <div className="space-y-6">
                    <div className="relative flex items-center justify-center mb-6 w-full h-10 border-b border-gray-200/50 pb-4">
                      <h2 className="text-xl font-extrabold text-gray-800 tracking-wider uppercase text-center drop-shadow-sm opacity-80 whitespace-nowrap z-10">Санал хүсэлт</h2>
                    </div>

                    <div>
                        <label className={`${styles.textLabel} text-center block mb-2`}>Төрөл сонгох <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Гомдол', 'Хүсэлт', 'Талархал'].map((type) => (
                              <button key={type} onClick={() => setOpForm({...opForm, feedbackType: type})} className={`py-3 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wide ${opForm.feedbackType === type ? styles.primaryButton : `${styles.raised} text-gray-500 hover:text-gray-800`}`}>{type}</button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative z-20"><label className={styles.textLabel}>Хэнд илгээх <span className="text-red-500">*</span></label><CustomSelect options={recipients} value={opForm.recipient} onChange={(val)=>setOpForm({...opForm, recipient: val})} placeholder="Албан тушаалтан..." /></div>
                    
                    <div><label className={styles.textLabel}>Дэлгэрэнгүй <span className="text-red-500">*</span></label><textarea rows="4" value={opForm.desc} onChange={e=>setOpForm({...opForm, desc: e.target.value})} placeholder="Санал хүсэлтээ энд бичнэ үү..." className={`${styles.inputBase} resize-none`}></textarea></div>
                    
                    {/* RATING SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`${styles.textLabel} text-center block`}>Үнэлгээ</label>
                          <div className={`flex gap-2 p-3 rounded-2xl justify-center items-center h-[52px] ${styles.sunken}`}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => handleOpStarClick(star)} className="relative focus:outline-none transition-transform active:scale-90 hover:scale-110">
                                <Star size={24} className={`${star <= opRating ? 'fill-yellow-400 stroke-yellow-300 stroke-[2px] drop-shadow-[0_0_10px_rgba(253,224,71,0.9)] filter' : 'text-gray-300'}`} />
                                {opExplodingStar === star && (
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {[...Array(8)].map((_, i) => {
                                      const angle = (i * 45) * (Math.PI / 180);
                                      const distance = 30 + Math.random() * 15;
                                      const tx = Math.cos(angle) * distance + 'px';
                                      const ty = Math.sin(angle) * distance + 'px';
                                      const color = ['#FFD700', '#FFA500', '#FF4500'][Math.floor(Math.random() * 3)];
                                      return (<div key={i} className="particle" style={{ '--tx': tx, '--ty': ty, backgroundColor: color }}></div>);
                                    })}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Ажилтны нэр (Заавал биш) */}
                        <div><label className={styles.textLabel}>Ажилтны нэр</label><input type="text" value={opForm.employeeName} onChange={e=>setOpForm({...opForm, employeeName: e.target.value})} placeholder="Ажилтны нэр..." className={styles.inputBase} /></div>
                    </div>
                </div>
             </div>

             {/* SUBMIT BUTTON */}
             <div className="mt-8 pt-4 border-t border-gray-200/50">
                <button onClick={handleOperatorSubmit} className={`w-full py-4 ${styles.primaryButton} rounded-xl font-bold text-sm tracking-widest flex items-center justify-center gap-2 transform transition-all hover:scale-[1.01] active:scale-[0.99]`}>
                  <Send size={18} /> ИЛГЭЭХ
                </button>
             </div>

          </div>
        </div>
      )}

      {/* MODAL (SOLID BACKGROUND) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedRequest(null)}>
           <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-6 relative z-50" onClick={e=>e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                     <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">#{selectedRequest.id} Хүсэлт</h2>
                     <p className="text-xs text-gray-500 mt-1 font-bold flex items-center gap-1"><MapPin size={10} /> Анхны сонголт: <span className="text-gray-800">{selectedRequest.branch || 'Сонгоогүй'}</span></p>
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
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className={styles.textLabel}><FileText size={14} className="inline mr-1"/> Тэмдэглэл / Хариу</label>
                       <textarea rows="6" className={`${styles.inputBase} resize-none`} placeholder="Хариу бичих..." value={resolutionText} onChange={(e) => setResolutionText(e.target.value)}></textarea>
                    </div>
                    <div className="flex flex-col h-full">
                       <label className={styles.textLabel}><MapPin size={14} className="inline mr-1"/> Салбар сонгох</label>
                       <div className={`flex-1 ${styles.sunken} rounded-2xl overflow-y-auto max-h-[160px] p-2 custom-scrollbar`}>
                          {BRANCHES.map(branch => (
                            <div key={branch} onClick={() => setSelectedBranchToAssign(selectedBranchToAssign === branch ? null : branch)} className={`p-3 text-xs rounded-xl cursor-pointer font-bold text-left transition-all flex justify-between items-center mb-1 ${selectedBranchToAssign === branch ? styles.primaryButton : 'text-gray-500 hover:bg-white/50'}`}>
                              {branch}{selectedBranchToAssign === branch && <Check size={14} className="text-white"/>}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <button disabled={!resolutionText.trim() && !selectedBranchToAssign} onClick={handleFinalSubmit} className={`w-full py-4 ${styles.primaryButton} rounded-xl font-bold text-sm tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}>
                    <Send size={16}/> {selectedBranchToAssign ? 'САЛБАРТ ИЛГЭЭХ' : 'ХАРИУ ИЛГЭЭХ'}
                 </button>
              </div>
              <div className="mt-4 text-center"><button onClick={() => setSelectedRequest(null)} className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider">Хаах</button></div>
           </div>
        </div>
      )}
    </div>
  );
}