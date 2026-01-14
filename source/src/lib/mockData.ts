import { User, Question, QuizResult, NewsItem, Category, Stat, Testimonial, QuickAction, Stage, Course, ShopItem, ShopBundle, Badge } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: '王小明',
    email: 'ming@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    level: 5,
    xp: 2450,
    maxExp: 3000,
    stamina: 80,
    maxStamina: 100,
    coins: 1500,
    diamonds: 50,
    streak: 7,
    badges: ['初級證照', '學習達人'],
    completedQuestions: ['q1', 'q2', 'q3'],
    certificationTarget: '初等考試 / 一般行政 / 國文',
    enrolledCourses: ['course2', 'course4']
  },
  {
    id: '2',
    name: '李老師',
    email: 'teacher@example.com',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    level: 10,
    xp: 15000,
    maxExp: 20000,
    stamina: 100,
    maxStamina: 100,
    coins: 5000,
    diamonds: 200,
    streak: 30,
    badges: ['金牌講師', '命題專家'],
    completedQuestions: [],
    certificationTarget: '教學認證',
    enrolledCourses: []
  },
  {
    id: '3',
    name: '管理員',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    level: 99,
    xp: 99999,
    maxExp: 99999,
    stamina: 999,
    maxStamina: 999,
    coins: 99999,
    diamonds: 9999,
    streak: 999,
    badges: ['系統管理員'],
    completedQuestions: [],
    certificationTarget: '系統維護'
  }
];

// Export single user for backward compatibility or direct use
export const mockUser = mockUsers[0];

export const mockCourses: Course[] = [
  {
    id: 'course1',
    title: '商業應用技能：生成式 AI 如何顛覆您的工作模式',
    provider: 'AWS 台灣亞馬遜',
    price: 0,
    rating: 4.8,
    students: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
    tags: ['AI', '免費課程'],
    // @ts-ignore
    modules: [
      { id: 'm1', title: '生成式 AI 概論', duration: 18 },
      { id: 'm2', title: '企業應用場景', duration: 24 },
      { id: 'm3', title: '風險與倫理', duration: 16 }
    ]
  },
  {
    id: 'course2',
    title: '進擊的綠領 - 碳管理師的養成之路',
    provider: '104獨家',
    price: 299,
    rating: 4.9,
    students: 850,
    imageUrl: 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?auto=format&fit=crop&q=80&w=400',
    tags: ['ESG', '碳管理'],
    // @ts-ignore
    modules: [
      { id: 'm1', title: '碳盤查流程', duration: 30 },
      { id: 'm2', title: 'ISO 14064-1 架構', duration: 28 }
    ]
  },
  {
    id: 'course3',
    title: '新手必修人資課程：掌握七大人資領域',
    provider: '104學習',
    price: 1200,
    rating: 4.7,
    students: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    tags: ['HR', '入門'],
    // @ts-ignore
    modules: [
      { id: 'm1', title: '招募與任用', duration: 25 },
      { id: 'm2', title: '績效管理', duration: 22 }
    ]
  },
  {
    id: 'course4',
    title: '就業服務乙級證照衝刺班',
    provider: 'Gavin老師',
    price: 2500,
    rating: 4.9,
    students: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
    tags: ['證照', '熱門'],
    // @ts-ignore
    modules: [
      { id: 'm1', title: '法規總論', duration: 35 },
      { id: 'm2', title: '實務演練', duration: 40 }
    ]
  }
];

export const mockHotKeywords = ['金融', 'AI', '多益', 'Python', 'ESG', '乙級就業服務', '托福', '長照', '室內設計'];

export const mockCategories: Category[] = [
  {
  id: 'public',
  name: '初等考試',
  description: '公務人員初等考試相關科目',
  icon: 'BookOpen',
  color: 'bg-indigo-700',
  count: 2,
  // 新增這個 groups 結構，用來存放「一般行政」等大種類
  groups: [
    {
      groupName: '一般行政',
      exams: [
        { id: '010_501_01', name: '國文(包括公文格式用語)', candidates: 32541 },
        { id: '010_501_02', name: '公民與英文', candidates: 41203 },
        { id: '010_501_03', name: '法學大意', candidates: 28765 },
        { id: '010_501_04', name: '行政學大意', candidates: 35678 },
      ]
    },
    {
      groupName: '社會行政',
      exams: [
        { id: '010_502_03', name: '社政法規大意', candidates: 15432 }
      ]
    },
    {
      groupName: '勞工行政',
      exams: [
        { id: '010_503_03', name: '法學大意', candidates: 19876 },
        { id: '010_503_04', name: '勞工行政與勞工法規大意', candidates: 17654 }
      ]
    },
    {
      groupName: '教育行政',
      exams: [
        { id: '010_504_03', name: '教育法規大意', candidates: 19876 },
        { id: '010_504_04', name: '教育學大意', candidates: 17654 }
      ]
    },
    {
      groupName: '圖書資訊管理',
      exams: [
        { id: '010_505_03', name: '圖書館學大意', candidates: 19876 },
        { id: '010_505_04', name: '中文圖書分類編目大意', candidates: 17654 }
      ]
    },
    {
      groupName: '人事行政',
      exams: [
        { id: '010_506_03', name: '法學大意', candidates: 19876 },
        { id: '010_506_04', name: '人事行政大意', candidates: 17654 }
      ]
    },
    {
      groupName: '財稅行政',
      exams: [
        { id: '010_507_03', name: '稅務法規大意', candidates: 19876 },
        { id: '010_507_04', name: '財政學大意', candidates: 17654 }
      ]
    },
    {
      groupName: '金融保險',
      exams: [
        { id: '010_508_03', name: '貨幣銀行學大意', candidates: 19876 },
        { id: '010_508_04', name: '保險學大意', candidates: 17654 }
      ]
    },
    {
      groupName: '會計',
      exams: [
        { id: '010_509_03', name: '會計審計法規大意', candidates: 19876 },
        { id: '010_509_04', name: '會計學大意', candidates: 17654 }
      ]
    },
    {
      groupName: '統計',
      exams: [
        { id: '010_510_03', name: '資料處理大意', candidates: 19876 },
        { id: '010_510_04', name: '統計學大意', candidates: 17654 }
      ]
    },
    {
      groupName: '廉政',
      exams: [
        { id: '010_511_03', name: '法學大意', candidates: 19876 },
        { id: '010_511_04', name: '公務員法大意（包括任用、服務、考績、懲戒、行政中立、利益衝突迴避與財產申報）', candidates: 17654 }
      ]
    },
    {
      groupName: '經建行政',
      exams: [
        { id: '010_512_03', name: '法學大意', candidates: 19876 },
        { id: '010_512_04', name: '經濟學大意', candidates: 17654 }
      ]
    },
    {
      groupName: '交通行政',
      exams: [
        { id: '010_513_03', name: '交通行政大意', candidates: 19876 },
        { id: '010_513_04', name: '運輸學大意', candidates: 17654 }
      ]
    },
    {
      groupName: '地政',
      exams: [
        { id: '010_514_03', name: '土地法大意', candidates: 19876 },
        { id: '010_514_04', name: '土地行政大意', candidates: 17654 }
      ]
    },
    // 未來可以輕鬆新增其他大類
  ]
}
];

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  maxProgress: number;
  reward: {
    type: 'coins' | 'diamonds' | 'exp';
    value: number;
  };
  status: 'active' | 'claimable' | 'completed';
}

export const mockQuests: Quest[] = [
  {
    id: 'd1',
    title: '每日刷題',
    description: '完成 10 道練習題',
    type: 'daily',
    progress: 3,
    maxProgress: 10,
    reward: { type: 'coins', value: 100 },
    status: 'active'
  },
  {
    id: 'd2',
    title: '完美主義',
    description: '連續答對 5 題',
    type: 'daily',
    progress: 5,
    maxProgress: 5,
    reward: { type: 'diamonds', value: 10 },
    status: 'claimable'
  },
  {
    id: 'w1',
    title: '每週挑戰',
    description: '累計獲得 500 分',
    type: 'weekly',
    progress: 350,
    maxProgress: 500,
    reward: { type: 'coins', value: 500 },
    status: 'active'
  },
  {
    id: 'a1',
    title: '初出茅廬',
    description: '完成第一個章節',
    type: 'achievement',
    progress: 1,
    maxProgress: 1,
    reward: { type: 'diamonds', value: 50 },
    status: 'completed'
  }
];

export const mockStages: Stage[] = [
  {
    id: '110_110010_501_01',
    name: '國文(包括公文格式用語)',
    description: '110年公務人員初等考試',
    certificationType: '初等考試 / 一般行政 / 國文',
    orderIndex: 1,
    status: 'completed',
    maxAccuracy: 30,
    // @ts-ignore
    examId: 'c1',
    // @ts-ignore
    rewards: { exp: 100, coins: 50 }
  },
];

export const mockQuestions: Question[] = [

];

export const mockResults: QuizResult[] = [
  {
    id: 'r1',
    userId: '1',
    score: 80,
    totalQuestions: 10,
    correctAnswers: 8,
    timeSpent: 300,
    completedAt: new Date().toISOString(),
    answers: [
      { questionId: 'q1', selectedOption: 2, isCorrect: true },
      { questionId: 'q2', selectedOption: 2, isCorrect: true }
    ]
  }
];

// Mistakes notebook (錯題本)
export const mockMistakes: Array<{
  id: string;
  topic: string;
  question: string;
  myAnswer: string;
  correct: string;
  note?: string;
}> = [
  { id: 'mk1', topic: '金融法規', question: '公開發行公司重大訊息揭露的規範是？', myAnswer: '公司章程', correct: '證券交易法相關規定', note: '注意重大訊息定義與揭露時點' },
  { id: 'mk2', topic: '餐飲衛生', question: '冷藏溫度應維持於？', myAnswer: '10°C', correct: '7°C 以下', note: '背下標準數值' },
  { id: 'mk3', topic: '英語聽力', question: '對話中 speaker A 的意圖？', myAnswer: '抱怨', correct: '提出建議' }
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '2024 金融證照考試日程表公布',
    summary: '金管會公布最新年度證照考試時程，請考生密切注意報名時間。本次新增數位金融相關證照...',
    category: '考試公告',
    date: '2024-03-15',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
    tag: '熱門',
    color: 'bg-red-500'
  },
  {
    id: '2',
    title: '多益改制懶人包：題型變化一次看',
    summary: '多益聽力與閱讀測驗將進行部分題型調整，增加口語化情境與多人對話內容，難度略為提升...',
    category: '測驗新知',
    date: '2024-03-10',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400',
    tag: '必讀',
    color: 'bg-blue-500'
  },
  {
    id: '3',
    title: 'Python 證照含金量大增，求職必備',
    summary: '隨著 AI 產業蓬勃發展，Python 程式設計能力成為眾多科技公司徵才的首要條件之一...',
    category: '職場趨勢',
    date: '2024-03-05',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
    tag: '趨勢',
    color: 'bg-green-500'
  }
];

export const mockStats: Stat[] = [
  { label: '活躍用戶', value: '12,000+', icon: 'Users', change: '+12%' },
  { label: '題庫總數', value: '50,000+', icon: 'Database', change: '+8%' },
  { label: '核發證書', value: '8,500+', icon: 'Award', change: '+25%' },
  { label: '合作機構', value: '150+', icon: 'Building2', change: '+5%' }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: '陳怡君',
    role: '金融分析師',
    content: '透過這個平台的模擬考題，我順利考取了 CFA Level 1，題目的解析非常詳細，對觀念釐清很有幫助！',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica'
  },
  {
    id: '2',
    name: '林志豪',
    role: '後端工程師',
    content: '刷題系統的介面很友善，而且還有程式碼題型的練習，讓我在面試前的技術測驗更有信心。',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '3',
    name: '張雅婷',
    role: '日文系學生',
    content: '每天利用通勤時間做個幾題，日檢 N2 聽力成績進步超多，很推薦給想考檢定的人。',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  }
];

export const mockQuickActions: QuickAction[] = [
  {
    id: 'mock-exam',
    title: '模擬測驗',
    description: '全真模擬考試環境，檢測實力',
    icon: 'PenTool',
    path: '/challenge/finance',
    label: '模擬測驗'
  },
  {
    id: 'wrong-review',
    title: '錯題複習',
    description: '針對弱點加強練習，事半功倍',
    icon: 'BookOpen',
    path: '/academy',
    label: '錯題複習'
  },
  {
    id: 'exam-schedule',
    title: '考試日程',
    description: '查詢近期各類證照考試時間',
    icon: 'Calendar',
    path: '/category/finance',
    label: '考試日程'
  },
  {
    id: 'community',
    title: '考生社群',
    description: '交流備考心得，互相激勵',
    icon: 'MessageCircle',
    path: '/arena',
    label: '考生社群'
  }
];

export const mockBattles: any[] = [
  {
    id: 'b1',
    player1: mockUsers[0],
    player2: mockUsers[1],
    status: 'completed',
    winnerId: '2',
    mode: 'ranked',
    timestamp: '2024-03-10T14:30:00Z',
    player1Score: 80,
    player2Score: 95
  },
  {
    id: 'b2',
    player1: mockUsers[0],
    player2: { ...mockUsers[2], name: '神秘高手' },
    status: 'completed',
    winnerId: '1',
    mode: 'quick',
    timestamp: '2024-03-11T09:15:00Z',
    player1Score: 100,
    player2Score: 85
  }
];

export const mockLeaderboard: any[] = [
  { rank: 1, user: mockUsers[2], score: 25000, trend: 'stable' },
  { rank: 2, user: mockUsers[1], score: 15000, trend: 'up' },
  { rank: 3, user: mockUsers[0], score: 2450, trend: 'down' },
  {
    rank: 4,
    user: { ...mockUsers[0], id: '4', name: '張小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi', level: 4 },
    score: 2100,
    trend: 'up'
  },
  {
    rank: 5,
    user: { ...mockUsers[0], id: '5', name: '陳大文', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', level: 3 },
    score: 1800,
    trend: 'stable'
  }
];

export const mockShopItems: ShopItem[] = [
  {
    id: 'item1',
    name: '無限體力 (1小時)',
    description: '1小時內無限次挑戰關卡，無需消耗體力',
    price: 100,
    currency: 'diamonds',
    icon: 'Zap',
    type: 'consumable',
    tags: ['熱門']
  },
  {
    id: 'item2',
    name: '考題詳解包 (單科)',
    description: '解鎖單一科目的所有詳解，永久有效',
    price: 500,
    currency: 'diamonds',
    icon: 'BookOpen',
    type: 'permanent',
    tags: ['推薦']
  },
  {
    id: 'item3',
    name: '經驗加倍卡 (24小時)',
    description: '24小時內獲得的經驗值加倍',
    price: 50,
    currency: 'diamonds',
    icon: 'TrendingUp',
    type: 'consumable'
  },
  {
    id: 'item4',
    name: '金幣禮包 (小)',
    description: '獲得 5000 金幣',
    price: 10,
    currency: 'diamonds',
    icon: 'Coins',
    type: 'consumable'
  }
];

export const mockBundles: ShopBundle[] = [
  {
    id: 'bundle1',
    name: '新手衝刺包',
    description: '包含無限體力(3小時)、經驗加倍卡(3天)與金幣禮包',
    price: 299,
    originalPrice: 500,
    currency: 'diamonds',
    items: ['無限體力 x3', '經驗加倍 x3', '金幣 x10000'],
    endDate: '2024-04-01'
  },
  {
    id: 'bundle2',
    name: '考前急救包',
    description: '全科目詳解解鎖 + 考前猜題卷',
    price: 999,
    originalPrice: 1500,
    currency: 'diamonds',
    items: ['全科詳解', '猜題卷 x5', '無限體力 x5'],
    endDate: '2024-05-01'
  }
];

export const mockBadges: Badge[] = [
  { id: 'b-start', name: '初級證照', icon: 'Award', description: '獲得第一張證照', unlocked: true },
  { id: 'b-learner', name: '學習達人', icon: 'BookOpen', description: '連續學習 7 天', unlocked: true },
  { id: 'b-speed', name: '神速答題', icon: 'Zap', description: '在 5 秒內作答正確', unlocked: false },
  { id: 'b-community', name: '社群之星', icon: 'Users', description: '社群貢獻 10 次', unlocked: false }
];
