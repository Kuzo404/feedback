import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Inbox, Clock, CheckCircle, AlertCircle, Heart, FileText, TrendingUp, Activity } from 'lucide-react';
import { STYLES } from '../data';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Жижиг карт компонент
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`${STYLES.glassCard} p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center justify-between hover:scale-[1.02] transition-transform shadow-sm gap-3 sm:gap-0`}>
    <div className="w-full sm:flex-1 text-center sm:text-left">
      <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`p-2 sm:p-3 rounded-full ${color} bg-opacity-20 flex-shrink-0`}>
      <Icon size={20} className={`sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

export default function Dashboard({ data }) {
  // --- 1. Өгөгдөл боловсруулах хэсэг ---
  const complaintCount = data.filter(d => d.type === 'Гомдол').length;
  const requestCount = data.filter(d => d.type === 'Хүсэлт').length;
  const thanksCount = data.filter(d => d.type === 'Талархал').length;

  // Долоо хоногийн өгөгдөл (7 өдөр)
  const chartData = [
    { name: 'Дав', amt: data.length > 0 ? Math.floor(data.length * 0.4) : 0 },
    { name: 'Мяг', amt: data.length > 0 ? Math.floor(data.length * 0.2) : 0 },
    { name: 'Лха', amt: data.length > 0 ? Math.floor(data.length * 0.6) : 0 },
    { name: 'Пүр', amt: data.length > 0 ? Math.floor(data.length * 0.3) : 0 },
    { name: 'Баа', amt: data.length > 0 ? Math.floor(data.length * 0.8) : 0 },
    { name: 'Бям', amt: data.length > 0 ? Math.floor(data.length * 0.15) : 0 }, 
    { name: 'Ням', amt: data.length > 0 ? Math.floor(data.length * 0.1) : 0 }
  ];

  // Салбарын гүйцэтгэлийн жишээ өгөгдөл (Бодит системд API-аас ирнэ)
  const branchPerformance = [
    { name: 'Салбар 1', count: 12, percentage: 85, status: 'Сайн' },
    { name: 'Салбар 2', count: 8, percentage: 65, status: 'Дунд' },
    { name: 'Салбар 3', count: 15, percentage: 40, status: 'Муу' },
    { name: 'Салбар 4', count: 5, percentage: 95, status: 'Онц' },
  ];

  // Шууд харилцааны гүйцэтгэлийн жишээ өгөгдөл
  const directPerformance = [
    { name: 'Зээлийн газар', count: 10, percentage: 90, status: 'Онц' },
    { name: 'Бизнес хөгжлийн газар ', count: 6, percentage: 75, status: 'Сайн' },
    { name: 'Дотоод аудитын газар', count: 4, percentage: 50, status: 'Дунд' },
    { name: 'Эрсдэлийн удирдлагын газар', count: 2, percentage: 30, status: 'Муу' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* --- 2. ДЭЭД ХЭСЭГ: 6 Үзүүлэлт --- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <StatCard title="Нийт ирсэн" value={data.length} icon={Inbox} color="text-blue-600 bg-blue-500" />
        <StatCard title="Хүлээгдэж буй" value={data.filter(d => d.status === 'Pending').length} icon={Clock} color="text-yellow-600 bg-yellow-500" />
        <StatCard title="Шийдвэрлэсэн" value={data.filter(d => d.status === 'Resolved').length} icon={CheckCircle} color="text-green-600 bg-green-500" />
        <StatCard title="Талархал" value={thanksCount} icon={Heart} color="text-pink-600 bg-pink-500" />
        <StatCard title="Хүсэлт" value={requestCount} icon={FileText} color="text-indigo-600 bg-indigo-500" />
        <StatCard title="Гомдол" value={complaintCount} icon={AlertCircle} color="text-red-600 bg-red-500" />
      </div>

      {/* --- 3. ДУНД ХЭСЭГ: Графикууд --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 h-auto lg:h-80">
        
        {/* Баганан график */}
        <div className={`${STYLES.glassCard} col-span-1 lg:col-span-2 p-4 sm:p-6 flex flex-col h-80 sm:h-auto`}>
          <h3 className="font-bold text-gray-700 mb-2 sm:mb-4 text-sm sm:text-base">Хүсэлтийн тоо (Долоо хоногоор)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#6B7280', fontSize:10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill:'#6B7280', fontSize:10}} />
              <RechartsTooltip 
                cursor={{fill: '#F3F4F6'}} 
                contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} 
              />
              <Bar dataKey="amt" name="Нийт тоо" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Бөөрөнхий график */}
        <div className={`${STYLES.glassCard} col-span-1 p-4 sm:p-6 flex flex-col h-80 sm:h-auto`}>
          <h3 className="font-bold text-gray-700 mb-2 sm:mb-4 text-sm sm:text-base">Төрлөөр</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={[{ name: 'Гомдол', value: complaintCount }, { name: 'Хүсэлт', value: requestCount }, { name: 'Талархал', value: thanksCount }]} 
                cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value"
              >
                {[0, 1, 2].map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- 4. ДООД ХЭСЭГ: Анализ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        
        {/* KPI: Шийдвэрлэх хугацаа */}
        <div className={`${STYLES.glassCard} p-4 sm:p-6 flex flex-col justify-between`}>
           <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-0">
             <div className="w-full">
               <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase">Дундаж шийдвэрлэх хугацаа</p>
               <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mt-2">2ч 15м</h3>
               <p className="text-green-600 text-[10px] sm:text-xs font-bold mt-2 flex items-center gap-1">
                  <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" /> 12% өмнөх сараас сайжирсан
               </p>
             </div>
             <div className="p-2 sm:p-3 bg-indigo-50 rounded-full text-indigo-600 flex-shrink-0">
                 <Activity size={20} className="sm:w-6 sm:h-6" />
             </div>
           </div>
           
           <div className="mt-4 sm:mt-6">
             <div className="w-full bg-gray-100 rounded-full h-2">
                 <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
             </div>
             <p className="text-[10px] text-gray-400 mt-2 text-right">Зорилт: 3 цагийн дотор</p>
           </div>
        </div>

        {/* List: Салбаруудын гүйцэтгэл */}
        <div className={`${STYLES.glassCard} p-4 sm:p-6`}>
           <div className="flex items-center justify-between mb-4 sm:mb-6">
             <h3 className="font-bold text-gray-700 text-sm sm:text-base">Салбар (Топ 4)</h3>
             <button className="text-blue-600 text-[10px] sm:text-xs font-bold hover:underline">Бүгд</button>
           </div>
           
           <div className="space-y-3 sm:space-y-5">
             {branchPerformance.map((branch, idx) => (
               <div key={idx} className="flex items-center gap-2 sm:gap-4">
                  {/* Салбарын нэр */}
                  <div className="w-16 sm:w-20 text-[9px] sm:text-xs font-bold text-gray-600 truncate">{branch.name}</div>
                  
                  {/* Progress Bar хэсэг */}
                  <div className="flex-1">
                     <div className="flex justify-between mb-1 text-[10px] sm:text-[10px]">
                        <span className="text-gray-500 font-medium">{branch.count}</span>
                        <span className={`font-bold ${branch.percentage > 70 ? 'text-green-600' : branch.percentage > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {branch.percentage}%
                        </span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-1000 ${branch.percentage > 75 ? 'bg-green-500' : branch.percentage > 45 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                          style={{ width: `${branch.percentage}%` }}>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* List: Шууд гүйцэтгэл */}
        <div className={`${STYLES.glassCard} p-4 sm:p-6`}>
           <div className="flex items-center justify-between mb-4 sm:mb-6">
             <h3 className="font-bold text-gray-700 text-sm sm:text-base">Төв оффис (Топ 4)</h3>
             <button className="text-blue-600 text-[10px] sm:text-xs font-bold hover:underline">Бүгд</button>
           </div>
           
           <div className="space-y-3 sm:space-y-5">
             {directPerformance.map((direct, idx) => (
               <div key={idx} className="flex items-center gap-2 sm:gap-4">
                  {/* Шууд нэр */}
                  <div className="w-16 sm:w-20 text-[9px] sm:text-xs font-bold text-gray-600 truncate">{direct.name}</div>
                  
                  {/* Progress Bar хэсэг */}
                  <div className="flex-1">
                     <div className="flex justify-between mb-1 text-[10px] sm:text-[10px]">
                        <span className="text-gray-500 font-medium">{direct.count}</span>
                        <span className={`font-bold ${direct.percentage > 70 ? 'text-green-600' : direct.percentage > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {direct.percentage}%
                        </span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-1000 ${direct.percentage > 75 ? 'bg-green-500' : direct.percentage > 45 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                          style={{ width: `${direct.percentage}%` }}>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}