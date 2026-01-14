import React, { useMemo, useState } from 'react';
import {
  Settings,
  Award,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Zap,
  BookOpen,
  Heart,
  Trophy,
  Coins,
  Diamond,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { mockUser as originalMockUser, mockCourses, mockBadges } from '../lib/mockData';
import { useGlobalState } from '@/state/GlobalState';
import { cn } from '../lib/utils';

// --- 模擬資料補充 (這裡模擬後端回傳的收藏證照數據) ---
const mockSavedCerts = [
  { id: '1', name: '多益金證挑戰', accuracy: 88 },
  { id: '2', name: '數位行銷證照', accuracy: 95 },
  { id: '3', name: 'Python 基礎程式設計', accuracy: 72 },
  { id: '4', name: '多益金證挑戰', accuracy: 88 },
  { id: '5', name: '數位行銷證照', accuracy: 95 },
  { id: '6', name: 'Python 基礎程式設計', accuracy: 72 },
  { id: '7', name: '多益金證挑戰', accuracy: 88 },
  { id: '8', name: '數位行銷證照', accuracy: 95 },
  { id: '9', name: 'Python 基礎程式設計', accuracy: 72 },
  { id: '10', name: '多益金證挑戰', accuracy: 88 },
  { id: '11', name: '數位行銷證照', accuracy: 95 },
  { id: '12', name: 'Python 基礎程式設計', accuracy: 72 },
];
const SAVED_ITEMS = [
  { id: '1', name: '多益金證挑戰', accuracy: 88, category: '語言檢定', icon: 'Globe', color: 'bg-blue-500' },
  { id: '2', name: '數位行銷證照', accuracy: 95, category: '專業證照', icon: 'TrendingUp', color: 'bg-orange-500' },
  { id: '3', name: 'Python 基礎', accuracy: 72, category: '程式開發', icon: 'Code', color: 'bg-indigo-500' },
  { id: '4', name: '丙級廚師檢定', accuracy: 85, category: '餐飲廚藝', icon: 'ChefHat', color: 'bg-rose-500' },
  { id: '5', name: '室內設計繪圖', accuracy: 60, category: '設計創意', icon: 'PenTool', color: 'bg-purple-500' },
  { id: '6', name: '乙級美容師', accuracy: 92, category: '美容美髮', icon: 'Scissors', color: 'bg-pink-500' },
  { id: '7', name: 'React 實戰', accuracy: 45, category: '程式開發', icon: 'Code', color: 'bg-indigo-500' },
];

// 合併到 mockUser 中
const mockUser = {
  ...originalMockUser,
  savedCertificates: mockSavedCerts
};

export default function Profile() {
  const { user, updateUser } = useGlobalState();
  const [name, setName] = useState(user.name);
  const [target, setTarget] = useState(user.certificationTarget || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const navigate = useNavigate();

  const progressPercentage = Math.min(100, (user.xp / user.maxExp) * 100);

  const avatarChoices = useMemo(() => [
    user.avatar,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ken',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Rex'
  ], [user.avatar]);
  const stats = {
    rank: 136,
    points: 2150,
    winRate: '68%',
    totalMatches: 142
  };

  const unlockedBadgeNames = new Set(user.badges);

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 pb-20 pt-8 px-4 rounded-b-[2.5rem] shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <UserIcon className="w-6 h-6" /> 個人中心
            </h1>
            <Link to="/settings" className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/20">
              <Settings className="w-5 h-5" />
            </Link>
          </header>

          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg overflow-hidden">
                <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{name}</h2>
                <span className="bg-indigo-500/50 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Lv.{user.level}
                </span>
              </div>
              <p className="text-indigo-100 text-sm mb-3 opacity-90">{user.email}</p>
              <div className="bg-black/20 rounded-full h-2 w-full overflow-hidden border border-white/10">
                <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 relative z-20 space-y-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
        <div className="space-y-6">
          {/* 金幣鑽石數據 */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-zinc-100 grid grid-cols-3 divide-x divide-zinc-100">
            <div className="flex flex-col items-center gap-1">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-zinc-900">{user.coins.toLocaleString()}</span>
              <span className="text-[10px] text-zinc-500">金幣</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Diamond className="w-5 h-5 text-cyan-600" />
              <span className="font-bold text-zinc-900">{user.diamonds.toLocaleString()}</span>
              <span className="text-[10px] text-zinc-500">鑽石</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-5 h-5 text-rose-600" />
              <span className="font-bold text-zinc-900">{user.streak}天</span>
              <span className="text-[10px] text-zinc-500">連續</span>
            </div>
          </div>

          {/* 學習數據與各證照正確率 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              學習數據分析
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <span className="text-[10px] text-zinc-500 block">總學習時數</span>
                  <span className="text-lg font-black text-zinc-900">45.2 <small className="text-xs font-normal">hr</small></span>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <span className="text-[10px] text-zinc-500 block">累計解題</span>
                  <span className="text-lg font-black text-zinc-900">{(mockUser.completedQuestions?.length || 0) * 15} <small className="text-xs font-normal">題</small></span>
                </div>
              </div>

              {/* 收藏證照正確率清單 */}
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-zinc-500 font-bold">收藏證照最高正確率</span>
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                </div>

                {/* 設定最大高度並允許縱向滾動，scrollbar-thin 為選用樣式 */}
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {(mockUser.savedCertificates || []).length > 0 ? (
                    mockUser.savedCertificates.map((cert, index) => (
                      <div key={`${cert.id}-${index}`} className="space-y-1">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-medium text-zinc-700 truncate max-w-[150px]">
                            {cert.name}
                          </span>
                          <span className="text-sm font-black text-indigo-600">
                            {cert.accuracy}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                            style={{ width: `${cert.accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-xs text-zinc-400 italic">尚未收藏任何證照</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右側欄位 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 成就勳章 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
            {/* 標題與段位顯示 */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" /> 競技場表現
              </h3>
              <div className="px-3 py-1 bg-indigo-50 rounded-full flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">
                  S1 賽季：巔峰對決
                </span>
              </div>
            </div>

            {/* 核心數據網格 */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-zinc-50/50 rounded-2xl p-3 text-center border border-zinc-100">
                <div className="text-xl font-black text-zinc-900">{stats.totalMatches}</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">總對戰</div>
              </div>
              <div className="bg-emerald-50/50 rounded-2xl p-3 text-center border border-emerald-100">
                <div className="text-xl font-black text-emerald-600">{stats.winRate}</div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">勝率</div>
              </div>
              <div className="bg-indigo-50/50 rounded-2xl p-3 text-center border border-indigo-100">
                <div className="text-xl font-black text-indigo-600">{stats.points}</div>
                <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">目前積分</div>
              </div>
            </div>

            {/* 底部排名與額外資訊 */}
            <div className="flex items-center justify-between bg-zinc-50 rounded-2xl p-4 border border-zinc-100 mt-2">
              <div className="flex items-center gap-4">
                {/* 放大版的排名勳章 */}
                <div className="relative flex-none">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] font-black opacity-80 uppercase">Rank</span>
                      <span className="text-lg font-black tracking-tighter">
                        {stats.rank > 100 ? "100+" : `${stats.rank}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 排名文字描述 */}
                <div>
                  <div className="text-sm font-black text-zinc-800">全球競爭力排名</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                    Global Leaderboard
                  </div>
                </div>
              </div>

              {/* 右側裝飾性圖標 */}
              <div className="pr-2">
                <Trophy
                  size={32}
                  className="text-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* 選單列表 */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
            {[
              {
                icon: <Heart className="w-5 h-5" />,
                label: "我的收藏",
                color: "bg-rose-50 text-rose-500",
                path: "/favorites" // 新增跳轉路徑
              },
              {
                icon: <BookOpen className="w-5 h-5" />,
                label: "錯題本",
                color: "bg-orange-50 text-orange-500",
                path: "/wrong-questions"
              },
            ].map((item, i) => (
              <button
                key={i}
                // 使用 navigate 跳轉至對應路徑
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                    item.color
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-zinc-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* 如果是我的收藏，可以顯示收藏數量（選用） */}
                  {item.label === "我的收藏" && (
                    <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium">
                      {SAVED_ITEMS.length}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-zinc-300" />
                </div>
              </button>
            ))}
          </div>

          <button className="w-full bg-white border border-zinc-200 text-zinc-400 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" /> 登出帳號
          </button>
        </div>
      </div>
    </div>
  );
}
