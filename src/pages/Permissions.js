import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, X, Shield, MapPin, User, Mail, Lock, Check, ChevronDown, Filter } from 'lucide-react';
import { ROLES, BRANCHES } from '../data'; // Таны data файлаас авна

// --- Shared Styles (Бусад файлуудтай ижил) ---
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

// --- Custom Select Component (SuperAdmin.js-ээс хуулбарлав) ---
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
                    ? 'bg-gray-700 text-white shadow-md' 
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

export default function Permissions() {
  // --- MOCK DATA ---
  const [users, setUsers] = useState([
    { id: 1, name: 'Б.Болд', email: 'bold@bichil.mn', role: ROLES.SUPER_ADMIN, branch: 'Төв салбар', status: 'Active' },
    { id: 2, name: 'Г.Саран', email: 'saran@bichil.mn', role: ROLES.BRANCH_ADMIN, branch: 'Салбар 1', status: 'Active' },
    { id: 3, name: 'Э.Тулга', email: 'tulga@bichil.mn', role: ROLES.DIRECT_ADMIN, branch: 'Салбар 2', status: 'Inactive' },
  ]);

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', role: '', branch: '', password: ''
  });

  // --- HANDLERS ---
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        branch: user.branch,
        password: '' // Don't show password on edit
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Та энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?')) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: '', branch: '', password: '' });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (editingUser) {
        // Update existing
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData, password: '***' } : u));
    } else {
        // Add new
        const newUser = {
            id: Date.now(),
            ...formData,
            status: 'Active'
        };
        setUsers([newUser, ...users]);
    }
    setIsModalOpen(false);
  };

  // --- FILTERING ---
  const filteredUsers = users.filter(user => {
      if (filterRole !== 'All' && user.role !== filterRole) return false;
      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          return user.name.toLowerCase().includes(lower) || user.email.toLowerCase().includes(lower);
      }
      return true;
  });

  const roleOptions = [ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN, ROLES.DIRECT_ADMIN];

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      
      {/* HEADER & FILTER BAR */}
      <div className={`flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 ${styles.glassCard} p-6 rounded-3xl mb-4 relative z-30`}>
          <div>
              <h2 className="text-xl font-extrabold text-gray-800 tracking-wider uppercase opacity-80">Эрх тохиргоо</h2>
              <p className="text-xs text-gray-500 mt-1 font-bold">Нийт хэрэглэгч: {users.length}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
              <div className="w-full md:w-64">
                  <input 
                    type="text" 
                    placeholder="Нэр, Имэйлээр хайх..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className={`${styles.inputBase} py-3`} 
                  />
              </div>
              
              <div className="w-48">
                  <CustomSelect 
                      options={['All', ...roleOptions]} 
                      value={filterRole} 
                      onChange={setFilterRole} 
                      placeholder="Бүх эрх" 
                      icon={Filter}
                  />
              </div>

              <button 
                onClick={handleAddNew}
                className={`py-3 px-6 rounded-2xl font-bold text-xs uppercase tracking-wide flex items-center gap-2 ${styles.primaryButton}`}
              >
                  <Plus size={18} /> Бүртгэх
              </button>
          </div>
      </div>

      {/* USERS TABLE */}
      <div className={`${styles.glassCard} rounded-3xl overflow-hidden p-2`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {['Хэрэглэгч', 'Эрх', 'Салбар', 'Төлөв', 'Үйлдэл'].map(h => (
                <th key={h} className="p-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {filteredUsers.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold">Хэрэглэгч олдсонгүй</td></tr>
            ) : (
                filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/40 transition-colors group">
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-white shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-800">{user.name}</div>
                                <div className="text-[10px] font-bold text-gray-500">{user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide 
                            ${user.role === ROLES.SUPER_ADMIN ? 'bg-purple-100 text-purple-700' : 
                              user.role === ROLES.BRANCH_ADMIN ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.role.replace('_', ' ')}
                        </span>
                    </td>
                    <td className="p-4">
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100/80 px-2 py-1 rounded-lg w-max shadow-sm">
                            <MapPin size={12} className="text-gray-400"/> {user.branch}
                        </span>
                    </td>
                    <td className="p-4">
                        <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${user.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                            <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {user.status}
                        </span>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(user)} className={`p-2 ${styles.primaryButton} rounded-lg bg-gray-100 text-gray-600 border-none hover:bg-gray-200`} title="Засах">
                                <Edit3 size={14} className="text-gray-700" />
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors shadow-sm" title="Устгах">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsModalOpen(false)}>
           <div className={`w-full max-w-lg ${styles.glassCard} bg-white/95 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl relative`} onClick={e=>e.stopPropagation()}>
              
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-extrabold text-gray-800 tracking-wider uppercase flex items-center gap-2">
                    {editingUser ? <Edit3 size={20} /> : <Plus size={20} />}
                    {editingUser ? 'Мэдээлэл засах' : 'Хэрэглэгч бүртгэх'}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors">
                    <X size={24} />
                 </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={styles.textLabel}>Нэр <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-3.5 text-gray-400" />
                            <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className={`${styles.inputBase} pl-10`} placeholder="Нэр" />
                        </div>
                    </div>
                    <div>
                        <label className={styles.textLabel}>Имэйл <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-3.5 text-gray-400" />
                            <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className={`${styles.inputBase} pl-10`} placeholder="mail@bichil.mn" />
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="relative z-20">
                        <label className={styles.textLabel}>Эрх <span className="text-red-500">*</span></label>
                        <CustomSelect 
                            options={roleOptions} 
                            value={formData.role} 
                            onChange={(val) => setFormData({...formData, role: val})} 
                            placeholder="Эрх сонгох" 
                            icon={Shield} 
                        />
                    </div>
                    <div className="relative z-10">
                        <label className={styles.textLabel}>Салбар <span className="text-red-500">*</span></label>
                        <CustomSelect 
                            options={BRANCHES} 
                            value={formData.branch} 
                            onChange={(val) => setFormData({...formData, branch: val})} 
                            placeholder="Салбар сонгох" 
                            icon={MapPin} 
                        />
                    </div>
                 </div>

                 <div>
                    <label className={styles.textLabel}>
                        {editingUser ? 'Шинэ нууц үг (Хоосон үлдээж болно)' : 'Нууц үг'} 
                        {!editingUser && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="password" 
                            value={formData.password} 
                            onChange={e=>setFormData({...formData, password: e.target.value})} 
                            required={!editingUser}
                            className={`${styles.inputBase} pl-10`} 
                            placeholder="••••••••" 
                        />
                    </div>
                 </div>

                 <div className="pt-4">
                    <button type="submit" className={`w-full py-4 ${styles.primaryButton} rounded-xl font-bold text-sm tracking-widest flex items-center justify-center gap-2`}>
                        {editingUser ? 'ХАДГАЛАХ' : 'БҮРТГЭХ'}
                    </button>
                 </div>

              </form>
           </div>
        </div>
      )}
    </div>
  );
}