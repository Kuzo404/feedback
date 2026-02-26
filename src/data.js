// Хэрэглэгчийн эрхүүд
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin',
  DIRECT_ADMIN: 'direct_admin'
};

// Салбарын жагсаалт
export const BRANCHES = [
  'Төв салбар',
  'Салбар 1 (Баруун 4 зам)',
  'Салбар 2 (Зүүн 4 зам)',
  'Салбар 3 (Зайсан)',
  'Салбар 4 (Хороолол)',
  'Салбар 5 (Яармаг)',
  'Салбар 6 (13-р хороолол)',
  'Салбар 7 (Нарантуул)',
];

// Нийтлэг загварын CSS
export const STYLES = {
  // Glassmorphism Card Style
  glassCard: 'bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-2xl',
  
  // Badge Styles (Status)
  badge: {
    Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Assigned: 'bg-blue-100 text-blue-700 border border-blue-200',
    Processing: 'bg-purple-100 text-purple-700 border border-purple-200', // Direct Admin дээр ашиглана
    Resolved: 'bg-green-100 text-green-700 border border-green-200',
    Rejected: 'bg-red-100 text-red-700 border border-red-200',
  }
};

// --- MOCK DATA (Туршилтын өгөгдөл) ---
export const INITIAL_DATA = [
  // --- 1. PENDING (Ирсэн хүсэлтүүд) ---
  {
    id: 1001,
    user: 'Б.Болд-Эрдэнэ',
    phone: '9911-2233',
    type: 'Гомдол',
    targetType: 'Employee', // Ажилтан руу
    employeeName: 'Г.Дорж (Теллер)',
    desc: 'Үйлчилгээний ажилтан маш удаан, дараалал ихтэй байхад нэмэлт цонх нээхгүй байна. Ажил хоцорлоо.',
    branch: 'Салбар 1 (Баруун 4 зам)',
    status: 'Pending',
    created_at: '2024-05-20, 10:30',
    assigned_at: null,
    resolved_at: null,
    isDirect: false,
    isOperator: false, // Апп-аас илгээсэн
    rating: 1,
    file: 'evidence_photo.jpg',
    recipient: 'Салбарын захирал'
  },
  {
    id: 1002,
    user: 'Г.Сарантуяа',
    phone: '8811-0099',
    type: 'Хүсэлт',
    targetType: 'Organization', // Байгууллага руу
    employeeName: null,
    desc: 'Танай байгууллагын зээлийн нөхцөлийн талаар дэлгэрэнгүй мэдээлэл имэйлээр авмаар байна.',
    branch: 'Төв салбар',
    status: 'Pending',
    created_at: '2024-05-21, 09:15',
    assigned_at: null,
    resolved_at: null,
    isDirect: false,
    isOperator: true, // Оператор бүртгэсэн
    rating: 0,
    file: null,
    recipient: 'Менежер'
  },
  {
    id: 1003,
    user: 'Unitel Group',
    phone: '7777-8888',
    type: 'Хүсэлт',
    targetType: 'Organization',
    employeeName: null,
    desc: 'Хамтран ажиллах гэрээний төслийг хавсаргав. Хянаж үзээд хариу өгнө үү.',
    branch: 'Төв салбар',
    status: 'Pending',
    created_at: '2024-05-22, 14:00',
    assigned_at: null,
    resolved_at: null,
    isDirect: true, // Шууд харилцагч (Direct Admin харна)
    isOperator: false,
    rating: 0,
    file: 'contract_draft_v1.pdf',
    recipient: 'Маркетинг алба'
  },
  {
    id: 1004,
    user: 'О.Мөнх-Од',
    phone: '9900-5544',
    type: 'Талархал',
    targetType: 'Employee',
    employeeName: 'А.Сарнай',
    desc: 'Маш соёлтой, хурдан шуурхай үйлчилгээ үзүүлсэнд баярлалаа.',
    branch: 'Салбар 3 (Зайсан)',
    status: 'Pending',
    created_at: '2024-05-23, 11:20',
    assigned_at: null,
    resolved_at: null,
    isDirect: false,
    isOperator: true, // Оператороос
    rating: 5,
    file: null,
    recipient: 'Хүний нөөц'
  },

  // --- 2. ASSIGNED / PROCESSING (Илгээсэн / Хүлээгдэж буй) ---
  {
    id: 2001,
    user: 'Э.Тулга',
    phone: '9900-1122',
    type: 'Гомдол',
    targetType: 'Organization',
    employeeName: null,
    desc: 'АТМ-д карт залгиулчихлаа. Яаралтай буцааж авмаар байна.',
    branch: 'Салбар 3 (Зайсан)',
    status: 'Assigned', // SuperAdmin-аас салбар руу илгээсэн
    created_at: '2024-05-19, 16:20',
    assigned_at: '2024-05-19, 16:30',
    resolved_at: null,
    isDirect: false,
    isOperator: true,
    rating: 2,
    resolution: 'Салбарын менежер Лхагва руу шилжүүлэв. Карт буцаах процесс эхлүүлэх.',
    file: null,
    recipient: null
  },
  {
    id: 2002,
    user: 'MCS CocaCola',
    phone: '7575-1111',
    type: 'Хүсэлт',
    targetType: 'Organization',
    employeeName: null,
    desc: 'Шинэ бүтээгдэхүүний танилцуулга уулзалт хийх хүсэлтэй байна.',
    branch: 'Төв салбар',
    status: 'Processing', // Direct Admin дээр "Шийдвэрлэгдэж байна"
    created_at: '2024-05-20, 11:00',
    assigned_at: '2024-05-20, 11:30', // Эхэлсэн цаг
    resolved_at: null,
    isDirect: true, // Шууд
    isOperator: false,
    rating: 0,
    resolution: 'Уулзалтын цаг товлохоор холбогдож байна.',
    file: 'product_intro.pptx',
    recipient: 'Борлуулалтын алба'
  },

  // --- 3. RESOLVED (Шийдвэрлэсэн түүх) ---
  {
    id: 3001,
    user: 'Ц.Наран',
    phone: '8080-9090',
    type: 'Талархал',
    targetType: 'Employee',
    employeeName: 'Б.Сувд (Зөвлөх)',
    desc: 'Зээлийн эдийн засагч Б.Сувд маш ойлгомжтой, хурдан шуурхай үйлчилж зээлээ амжилттай авлаа. Баярлалаа.',
    branch: 'Салбар 2 (Зүүн 4 зам)',
    status: 'Resolved',
    created_at: '2024-05-18, 09:00',
    assigned_at: '2024-05-18, 09:10',
    resolved_at: '2024-05-18, 10:00',
    isDirect: false,
    isOperator: false,
    rating: 5, // 5 од
    resolution: 'Ажилтанд талархал уламжилж, гүйцэтгэлийн үнэлгээнд оруулав.',
    file: null,
    recipient: null
  },
  {
    id: 3002,
    user: 'Д.Баяр',
    phone: '9111-3344',
    type: 'Гомдол',
    targetType: 'Organization',
    employeeName: null,
    desc: 'Паркинг байхгүй байна. Машинаа ачуулчихлаа.',
    branch: 'Төв салбар',
    status: 'Resolved',
    created_at: '2024-05-15, 13:00',
    assigned_at: '2024-05-15, 13:10',
    resolved_at: '2024-05-15, 14:00',
    isDirect: false,
    isOperator: true,
    rating: 1,
    resolution: 'Харилцагчид нөхцөл байдлыг тайлбарлаж, ойр орчмын зогсоолын мэдээлэл өгөв. Гомдлыг хаав.',
    file: 'parking_ticket.jpg',
    recipient: null
  },
  {
    id: 3003,
    user: 'АПУ ХК',
    phone: '11-334455',
    type: 'Хүсэлт',
    targetType: 'Organization',
    employeeName: null,
    desc: 'Төлбөр тооцооны алдааг шалгаж өгнө үү.',
    branch: 'Төв салбар',
    status: 'Resolved',
    created_at: '2024-05-10, 10:00',
    assigned_at: '2024-05-10, 10:30',
    resolved_at: '2024-05-11, 09:00',
    isDirect: true, // Шууд харилцагч
    isOperator: false,
    rating: 4,
    resolution: 'Тооцоог нийлж, зөрүүг залруулсан гүйлгээ хийгдсэн.',
    file: 'transaction_error.png',
    recipient: 'Санхүүгийн алба'
  }
];