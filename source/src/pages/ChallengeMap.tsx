import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap, Coins, Diamond, ChevronRight, LayoutGrid,
  BookOpen, Star, Target, Dices // 引入 Dices
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useGlobalState } from '@/state/GlobalState';
import { mockUser, mockQuests } from '@/lib/mockData';
import QuestDrawer from '@/components/QuestDrawer';

// 1. 動態偵測資料夾下的 JSON 檔案
const questionFiles = import.meta.glob('../lib/questions/*.json');
const fileNames = Object.keys(questionFiles);

export default function ChallengeMap() {
  const navigate = useNavigate();
  const { id: templateId } = useParams(); // 例如：110010_501_02
  const [isQuestOpen, setIsQuestOpen] = useState(false);
  const { config } = useGlobalState();

  // 2. 核心邏輯：過濾年份並加上隨機出題
  const mapItems = useMemo(() => {
    if (!templateId) return [];

    const idParts = templateId.split('_');
    const coreSuffix = idParts.slice(-2).join('_');

    // A. 找出年份試卷
    const years = fileNames
      .map(path => {
        const fileName = path.split('/').pop() || '';
        const cleanFileName = fileName.replace(/\s/g, '').replace('.json', '');

        if (cleanFileName.includes(coreSuffix) && cleanFileName.includes('010')) {
          return {
            type: 'year',
            year: cleanFileName.split('_')[0],
            fullId: fileName.replace('.json', '').trim(),
            title: `${cleanFileName.split('_')[0]} 歷屆試題`
          };
        }
        return null;
      })
      .filter((item): item is { type: string; year: string; fullId: string; title: string } => item !== null)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));

    // B. 手動插入隨機挑戰
    const randomItem = {
      type: 'random',
      year: '∞',
      fullId: `${templateId}_random`, // 注意：Quiz 頁面需支援此 ID 格式
      title: '全範圍隨機挑戰'
    };

    return [randomItem, ...years];
  }, [templateId, fileNames]);

  const title = templateId?.includes('501_01') ? '國文歷屆試題' :
                templateId?.includes('501_02') ? '公民與英文歷屆' : '歷屆試題挑戰';

  return (
    <div className="flex flex-col h-full bg-[#1a1b26] min-h-screen text-white pb-24 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#1a1b26]/80 backdrop-blur-md border-b border-white/5 p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/CLassification')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10">
              <LayoutGrid size={20} />
            </button>
            <div className="relative group cursor-pointer">
              <img src={mockUser.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-[#2a2b36] bg-zinc-800 shadow-lg" />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#1a1b26]">
                Lv.{mockUser.level}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold sm:text-base leading-tight tracking-tight">{title}</span>
                <span className="text-[9px] font-bold text-emerald-200 bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-500/30 tracking-tight mt-1">
                  ID: {templateId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-[#0f1016] px-3 py-1 rounded-full border border-white/5">
              <Coins size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-sm text-yellow-100">{mockUser.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0f1016] px-3 py-1 rounded-full border border-white/5">
              <Diamond size={14} className="text-cyan-400 fill-cyan-400" />
              <span className="font-bold text-sm text-cyan-100">{mockUser.diamonds.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#0f1016] rounded-full px-3 py-1 w-fit border border-white/5">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-yellow-100">{mockUser.stamina}/{config.staminaMax}</span>
          </div>
          <button onClick={() => setIsQuestOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-all">
            <BookOpen size={16} className="text-white fill-white/20" />
            <span className="text-xs font-bold text-white">任務日誌</span>
          </button>
        </div>
      </div>
      <QuestDrawer isOpen={isQuestOpen} onClose={() => setIsQuestOpen(false)} quests={mockQuests} />

      {/* Adventure Map */}
      <div className="flex-1 overflow-y-auto px-4 py-12 relative z-10 custom-scrollbar">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent -z-10" />

        <div className="max-w-md mx-auto space-y-12 relative">
          {mapItems.length > 0 ? (
            mapItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              const isRandom = item.type === 'random';

              // 樣式設定
              const borderColor = isRandom ? "border-amber-500" : "border-indigo-500";
              const shadowColor = isRandom ? "shadow-[0_0_30px_rgba(245,158,11,0.25)]" : "shadow-[0_0_30px_rgba(99,102,241,0.2)]";
              const badgeGradient = isRandom ? "from-amber-500 to-orange-600" : "from-indigo-500 to-purple-600";
              const iconColor = isRandom ? "text-amber-400" : "text-indigo-400";
              const tagStyle = isRandom
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-white/5 text-zinc-400 border border-white/5";

              return (
                <div key={item.fullId} className={cn("flex relative group", isLeft ? "justify-start" : "justify-end")}>
                  <Link
                    to={`/quiz/${item.fullId}`}
                    className="relative w-[85%] transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                  >
                    <div className={cn(
                      "relative overflow-hidden rounded-[2rem] border-2 backdrop-blur-md p-5 bg-[#1a1b26]",
                      borderColor,
                      shadowColor
                    )}>
                      {/* Random 特效 */}
                      {isRandom && (
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/20 blur-[40px] rounded-full pointer-events-none" />
                      )}

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-2xl transition-transform group-hover:rotate-3 bg-gradient-to-br text-white",
                            badgeGradient
                          )}>
                            <span className="text-lg leading-none">{item.year}</span>
                            <span className="text-[8px] mt-1 opacity-60">
                                {isRandom ? 'ALL' : '年度'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white leading-tight">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn("text-[10px] px-2 py-0.5 rounded-full", tagStyle)}>
                                {isRandom ? '綜合測驗' : '挑戰模式'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30">
                            {isRandom ? <Dices size={20} className="text-amber-500" /> : <Star size={20} className="text-amber-500 fill-amber-500" />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Zap size={12} className={iconColor} />
                            <span className="text-[11px] font-bold text-zinc-300">
                                {isRandom ? '+500 EXP' : '+250 EXP'}
                            </span>
                          </div>
                        </div>
                        <div className={cn("flex items-center gap-1 group-hover:translate-x-1 transition-transform", iconColor)}>
                          <span className="text-[10px] font-black uppercase">
                              {isRandom ? 'START RANDOM' : 'START QUIZ'}
                          </span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Target size={32} className="text-zinc-700" />
              </div>
              <h3 className="text-zinc-500 font-bold">目前尚無此科目之歷屆試題</h3>
              <p className="text-[10px] text-zinc-600 mt-2 tracking-widest uppercase">
                Missing: {templateId} Suffix
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
