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
  count: 14,
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

// src/lib/mockData.js

export const mockNews: NewsItem[] = [
  {
    id: '1150001',
    title: '2025 金融證照報考全攻略：新手該如何安排考試順序？',
    category: '備考攻略',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    date: '2025-01-15',
    isCarousel: true,
    author: '金融小導師',
    readTime: '5 min',
    tags: ['證券商', '期貨', '銀行內控'],
    content: `金融業是許多新鮮人嚮往的產業，但面對琳瑯滿目的證照，究竟該從何考起？
    IMAGE:https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop|金融證照是入行的敲門磚
首先，建議新手先從「法定證照」下手。所謂法定證照，就是法規規定從業人員必須具備的資格。最基礎的黃金三張分別是：證券商業務員、信託業務人員、銀行內部控制與內部稽核。

### 1. 證券商業務員 (普業)
這是進入證券業的門票。考試內容包含證券交易相關法規與實務、投資學與財務分析。建議準備時間為 3-4 週。通過率約在 40%-50% 之間，只要勤做歷屆試題，過關機率很高。

### 2. 信託業務人員
隨著銀行轉型財富管理，信託證照幾乎是銀行員的標配。考試全為選擇題，內容偏重法規記憶。建議在考完普業後接著準備，因為部分觀念重疊，準備起來會事半功倍。

### 3. 進階規劃：投信投顧與期貨
當你拿到了基礎證照後，若想往理專或分析師發展，「投信投顧業務員」與「期貨商業務員」將是你的下一站。特別注意，如果你已經考過「證券商高級業務員」，投信投顧只需要考一科法規即可取得證照，這是最省力的考法！

總結來說，考證照不是比量多，而是比「精準」。先確認自己的職涯方向（銀行、證券、保險），再安排考試順序，才能讓每一張證照都成為你加薪的籌碼。`
  },
  {
    id: '1150002',
    title: '多益聽力測驗改制？官方澄清說明懶人包',
    category: '最新消息',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
    date: '2025-01-14',
    isCarousel: false,
    author: '英文檢定組',
    readTime: '3 min',
    tags: ['TOEIC', '英語學習', '考試快訊'],
    content: `近期網路上流傳多益 (TOEIC) 聽力測驗即將大幅改制的傳言，引發許多考生恐慌。ETS 台灣區總代理已於昨日正式發布新聞稿澄清。
IMAGE:https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop|AI 技術正快速改變職場生態
### 重點一：題型並未改變
官方強調，2025 年度的公開測驗，題型將維持 2018 年更新後的版本，並無所謂的「大幅度增加口音」或「減少圖片題」的計畫。目前的聽力測驗依然包含美、加、英、澳四國口音，比例也維持固定。

### 重點二：難度動態調整
雖然題型不變，但有考生反應近期考試難度似乎變高。對此，專家分析指出，多益考試本來就會根據試題庫進行動態配置。近期的趨勢確實發現，「多人對話」的語速稍快，且「圖表題」的資訊量增加，這考驗的是考生整合資訊的能力，而非單純的聽力。

### 如何應對？
1. **練習多國口音**：不要只聽美式英語，建議多聽 BBC Learning English 或澳洲的廣播節目。
2. **先看題目再聽**：Part 3 和 Part 4 務必利用播放題組說明的時候，先快速掃描題目與選項，抓出關鍵字。

請考生放心，只要照著原本的進度準備，不需要因為謠言而打亂陣腳。`
  },
  {
    id: '1150003',
    title: 'AI 時代來臨！這 5 張資訊證照含金量最高，薪水三級跳',
    category: '產業趨勢',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    date: '2025-01-12',
    isCarousel: true,
    author: 'Tech Hunter',
    readTime: '6 min',
    tags: ['AI', '雲端', '資安', '職涯發展'],
    content: `生成式 AI 的爆發，讓資訊人才的需求量大增，但也拉高了入行門檻。想要在眾多求職者中脫穎而出，擁有一張具備公信力的國際證照絕對是加分項。以下盤點 2025 年含金量最高的 5 張證照：

### 1. AWS Certified Solutions Architect (Associate/Professional)
雲端市占率第一的 AWS，其架構師證照依然是業界標準。無論是傳產數位轉型還是科技新創，都急需懂得雲端架構的人才。

### 2. Certified Information Systems Security Professional (CISSP)
資安界的黃金標準。隨著 AI 詐騙與攻擊手法翻新，企業對資安長 (CISO) 層級的人才需求若渴。雖然這張證照考試難度極高且需要工作經驗，但考到後年薪通常是百萬起跳。

### 3. Google Professional Machine Learning Engineer
針對 AI 工程師設計。考驗你如何在 Google Cloud 上構建、訓練並部署機器學習模型。在 AI 應用落地的現在，這張證照證明了你有「實戰能力」。

### 4. PMP (Project Management Professional)
雖然不是純技術證照，但在軟體開發專案中，PMP 依然是專案經理的必備利器，特別是在導入 AI 專案時，如何控管範疇與風險至關重要。

### 5. iPAS 資訊安全工程師
這是台灣經濟部發證的國家級證照，近年來受到本土企業與公家機關的高度認可，適合剛畢業或想轉職的新手作為入門磚。`
  },
  {
    id: '1150004',
    title: '室內設計師的日常：從考照到接案的心路歷程',
    category: '職涯分享',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
    date: '2025-01-08',
    isCarousel: true,
    author: '設計師 Allen',
    readTime: '4 min',
    tags: ['室內設計', '乙級', '接案'],
    content: `很多人以為室內設計師就是畫畫圖、挑挑家具，過著優雅的生活。但現實往往是：在工地吃便當、跟工班師傅博感情、半夜還在趕圖改圖。

### 關於考照：乙級是必備的嗎？
如果你想開業、或是接裝修工程金額超過一定數目，依台灣法規，「建築物室內裝修工程管理乙級」與「建築物室內設計乙級」是必須的。
* **設計乙級**：考手繪透視圖、施工圖。這是最難的一關，要在有限時間內畫完精確的圖面，手真的會畫到抽筋。
* **工程管理乙級**：考工法、法規、監工實務。這需要大量的背誦與理解現場工法。

### 接案的現實
剛拿到證照出來接案，最常遇到的問題不是「不會畫圖」，而是「不會報價」與「不會溝通」。
業主通常不懂行情，覺得你畫幾張圖為什麼要收設計費？這時候，你的專業證照就是一個很好的背書，證明你是經過國家考試認證的專業人士，而非一般的統包商。

這條路很辛苦，但當你看到原本的廢墟變成業主夢想中的家，那種成就感是無可比擬的。`
  },
  {
    id: '1150005',
    title: 'React 前端開發者必讀：2025 年技術趨勢預測',
    category: '程式開發',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    date: '2025-01-03',
    isCarousel: true,
    author: 'Frontend Weekly',
    readTime: '5 min',
    tags: ['React', 'Next.js', 'Frontend'],
    content: `React 生態系變動極快，2024 年我們見證了 Server Components 的普及。展望 2025，前端開發者應該關注哪些重點？

### 1. React Server Components (RSC) 成為主流
這不再只是 Next.js 的專利，React 官方團隊正致力於讓 RSC 成為標準。這改變了我們思考「狀態管理」與「資料獲取」的方式。你需要習慣在 Server 端處理繁重的運算，將 Client 端留給互動邏輯。

### 2. 構建工具的戰爭：Vite vs Turbopack
Webpack 逐漸老去，Vite 已經成為新專案的首選。但 Vercel 推出的 Turbopack 號稱比 Vite 快 10 倍 (在某些場景下)，這場速度之戰將讓開發者受惠，DX (開發者體驗) 將大幅提升。

### 3. AI 輔助編碼 (AI-Assisted Coding)
這不是要取代你，而是要讓你變快。GitHub Copilot 與 Cursor 等工具已經能精準地寫出 React Component 與 Hooks。未來的工程師，競爭力在於「如何問對問題」以及「Code Review AI 寫的程式碼」。

建議新手現在學習 React，直接從 Next.js 框架入手，並熟悉 TypeScript，這已經是現代前端開發的標配。`
  },
  {
    id: '1150006',
    title: '【學員專訪】非本科系如何花半年考取資安工程師證照',
    category: '成功案例',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop',
    date: '2024-12-28',
    isCarousel: true,
    author: '平台編輯部',
    readTime: '4 min',
    tags: ['轉職', '資安', 'iPAS'],
    content: `小美原本是文學院畢業的行政助理，對於電腦的認知僅止於文書處理。但在一次公司遭受勒索病毒攻擊的事件後，她對「資訊安全」產生了濃厚的興趣。

「一開始真的看天書，什麼 TCP/IP、防火牆規則，完全看不懂。」小美笑著說。

### 制定讀書計畫
她分享了她的備考策略：
1. **前兩個月：打底**。利用線上課程（例如本平台的資安入門課），將網路基礎概論看過一遍。不求甚解，先求有印象。
2. **中間兩個月：刷題與實作**。她購買了模擬試題，並在自己的電腦上架設虛擬機 (VM)，練習 Linux 指令與基礎滲透測試工具。
3. **最後兩個月：衝刺 iPAS 初級**。針對經濟部 iPAS 的考綱進行重點複習。

### 遇到的困難
「最難的是挫折感。」小美坦言，有好幾次想放棄。但她善用了社群的力量，加入了資安讀書會 Discord 群組，遇到不懂的名詞就發問，群組裡的前輩都很樂意解答。

半年後，她順利通過了 iPAS 資訊安全工程師初級能力鑑定，並憑藉這張證照與展現出的學習熱忱，成功轉職至一家系統整合商擔任初級資安分析師。

「不要覺得自己是非本科就做不到，資安領域很大，需要各種不同背景的人才。」這是她給所有轉職者的鼓勵。`
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
