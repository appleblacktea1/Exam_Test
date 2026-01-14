import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Timer, Heart, Eraser, Hourglass, ArrowLeft,
  AlertCircle, CheckCircle2, Loader2, Trophy, Map, X, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 動態掃描資源
const allImages = import.meta.glob('../lib/questions/images/**/*.{jpg,jpeg,png,svg,webp}', { eager: true });
const questionFiles = import.meta.glob('../lib/questions/*.json');

const INITIAL_TIME = 45;

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- 狀態控制 ---
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [health, setHealth] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);
  const [skills, setSkills] = useState({ eraser: 1, freeze: 2, healthy: 1 });
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // --- 統計數據 ---
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // --- 您提供的路徑邏輯 ---
  const challengeMapId = useMemo(() => {
    if (!id) return '';
    const cleanId = id.trim();
    const parts = cleanId.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : cleanId;
  }, [id]);

  // --- 圖片處理邏輯 ---
  const getImageUrl = (jsonPath: any) => {
    if (!jsonPath) return null;
    const path = typeof jsonPath === 'object' ? jsonPath.file_path : jsonPath;
    if (typeof path !== 'string') return null;
    const normalizedPath = path.replace('@/', '../');
    const target = allImages[normalizedPath];
    return target ? (target as any).default : null;
  };

  // --- 資料載入 ---
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const filePath = Object.keys(questionFiles).find(path => path.includes(`${id?.trim()}.json`));
        if (filePath) {
          const module: any = await questionFiles[filePath]();
          const data = module.default || module;
          setQuestions(Array.isArray(data) ? data : (data.questions || []));
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    loadData();
  }, [id]);

  // --- 計時器 ---
  useEffect(() => {
    if (showResult || isPaused || showExitConfirm || isSubmitted || loading || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleWrongAnswer(); return INITIAL_TIME; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, isPaused, currentQuestionIndex, showExitConfirm, isSubmitted, loading, questions.length]);

  const handleWrongAnswer = () => {
    setWrongCount(prev => prev + 1);
    setHealth(prev => {
      const nextHealth = prev - 1;
      if (nextHealth <= 0) setShowResult(true);
      else goToNext();
      return nextHealth;
    });
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedKeys([]);
      setIsSubmitted(false);
      setRemovedKeys([]);
      setTimeLeft(INITIAL_TIME);
    } else { setShowResult(true); }
  };

  const processAnswer = (keys: string[]) => {
    setIsSubmitted(true);
    const q = questions[currentQuestionIndex];
    const correct = Array.isArray(q.correctAnswer) ? keys.every(k => q.correctAnswer.includes(k)) : keys[0] === q.correctAnswer;

    setTimeout(() => {
      if (correct) {
        setCorrectCount(prev => prev + 1);
        goToNext();
      } else { handleWrongAnswer(); }
    }, 800);
  };

  const activateSkill = (type: 'eraser' | 'freeze' | 'healthy') => {
    if (skills[type] <= 0 || isSubmitted) return;
    setSkills(s => ({ ...s, [type]: s[type] - 1 }));
    if (type === 'eraser') {
      const q = questions[currentQuestionIndex];
      const wrong = q.options.filter((o: any) => o.key !== q.correctAnswer && !removedKeys.includes(o.key));
      if (wrong.length > 0) setRemovedKeys(r => [...r, wrong[0].key]);
    } else if (type === 'freeze') {
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 8000);
    } else if (type === 'healthy') {
      setHealth(h => Math.min(h + 1, 3));
    }
  };

  if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-indigo-500"><Loader2 className="animate-spin" size={40} /></div>;

  // --- 結算頁面 ---
  if (showResult) {
    const accuracy = Math.round((correctCount / (correctCount + wrongCount || 1)) * 100);
    return (
      <div className="fixed inset-0 z-[300] bg-zinc-950 flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full -mr-16 -mt-16" />

          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-indigo-400" size={40} />
          </div>
          <h2 className="text-3xl font-black mb-2">練習完成</h2>
          <p className="text-zinc-500 mb-8 font-medium">這是你的本次戰報</p>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">正確率</p>
              <p className="text-4xl font-black text-indigo-400">{accuracy}%</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">答對題數</p>
                <p className="text-2xl font-black text-emerald-400">{correctCount}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">答錯題數</p>
                <p className="text-2xl font-black text-red-400">{wrongCount}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/home')} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
              <BrainCircuit size={20} /> AI 解析
            </button>
            <button onClick={() => navigate(`/challenge/${challengeMapId}`)} className="w-full py-5 bg-zinc-100 hover:bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95">
              <Map size={20} /> 返回地圖
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white flex flex-col overflow-hidden font-sans">
      {/* 燈箱 */}
      {zoomImg && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} className="max-w-full max-h-[90vh] object-contain" />
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full"><X /></button>
        </div>
      )}

      {/* 退出確認 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-xs shadow-2xl">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-black mb-2 tracking-tight">中斷挑戰？</h3>
            <p className="text-zinc-400 text-sm mb-8">
              離開將會<span className="text-red-400 font-bold">扣除體力</span>且不計入本次練習分。
            </p>
            <div className="space-y-3">
              <button onClick={() => setShowExitConfirm(false)} className="w-full py-4 bg-zinc-800 rounded-2xl font-bold active:scale-95 transition-transform">繼續練習</button>
              <button onClick={() => navigate(`/challenge/${challengeMapId}`)} className="w-full py-4 bg-red-500 rounded-2xl font-bold active:scale-95 transition-transform">確定退出</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-none p-4 flex justify-between items-center bg-zinc-900/50 border-b border-white/5">
        <button onClick={() => setShowExitConfirm(true)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(h => <Heart key={h} size={22} className={cn(h <= health ? "text-red-500 fill-red-500" : "text-zinc-800")} />)}
        </div>
        <div className={cn("font-mono text-lg font-black w-16 text-right transition-colors", timeLeft <= 10 && !isPaused ? "text-red-500 animate-pulse" : "text-indigo-400")}>
          {isPaused ? "FREE" : `${timeLeft}s`}
        </div>
      </div>

      <div className="flex-none h-1.5 bg-zinc-900 w-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / INITIAL_TIME) * 100}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-[2rem] shadow-xl">
            <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">
              Question {currentQuestionIndex + 1}
            </div>
            <h2 className="text-lg font-bold leading-relaxed mb-4 text-zinc-100 whitespace-pre-wrap">
              {currentQuestion?.text}
            </h2>
            {currentQuestion?.images && currentQuestion.images.length > 0 && (
              <div className="flex flex-col gap-4 mt-4">
                {currentQuestion.images.map((img: any, idx: number) => {
                  const src = getImageUrl(img);
                  return src && (
                    <div key={idx} className="bg-black/20 p-2 rounded-2xl border border-white/5 flex justify-center">
                      <img src={src} onClick={() => setZoomImg(src)} className="max-h-[250px] w-auto rounded-lg cursor-zoom-in" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid gap-3 pb-24">
            {currentQuestion?.options.map((option: any) => {
              const isSelected = selectedKeys.includes(option.key);
              if (removedKeys.includes(option.key)) return null;
              const optImg = getImageUrl(option.imageUrl);
              return (
                <button
                  key={option.key}
                  disabled={isSubmitted}
                  onClick={() => { setSelectedKeys([option.key]); processAnswer([option.key]); }}
                  className={cn(
                    "p-5 rounded-[1.5rem] border-2 text-left flex flex-col gap-4 transition-all duration-200",
                    isSelected ? "border-indigo-500 bg-indigo-500/10 shadow-lg" : "border-transparent bg-zinc-900 hover:bg-zinc-800/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black", isSelected ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-500")}>
                      {option.key}
                    </div>
                    <span className="text-[15px] font-medium leading-snug">{option.text}</span>
                  </div>
                  {optImg && <img src={optImg} className="max-h-[140px] w-auto rounded-xl mx-auto border border-white/5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-none p-5 bg-zinc-950/90 border-t border-white/5 pb-safe">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
          <SkillBtn icon={<Eraser size={20} />} count={skills.eraser} onClick={() => activateSkill('eraser')} label="刪除錯項" color="bg-blue-600" />
          <SkillBtn icon={<Hourglass size={20} />} count={skills.freeze} onClick={() => activateSkill('freeze')} label="凍結時間" color="bg-purple-600" />
          <SkillBtn icon={<Heart size={20} />} count={skills.healthy} onClick={() => activateSkill('healthy')} label="補充體力" color="bg-emerald-600" />
        </div>
      </div>
    </div>
  );
}

function SkillBtn({ icon, count, onClick, label, color }: any) {
  return (
    <button onClick={onClick} disabled={count <= 0} className={cn("flex flex-col items-center p-3 rounded-2xl bg-zinc-900 border border-white/5 transition-all relative", count > 0 ? "active:scale-90" : "opacity-10")}>
      <div className={cn("p-2 rounded-xl mb-1.5 text-white shadow-inner", count > 0 ? color : "bg-zinc-700")}>{icon}</div>
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">{label}</span>
      {count > 0 && <div className="absolute top-2 right-2 bg-red-500 text-[9px] px-1.5 py-0.5 rounded-full font-black text-white ring-2 ring-zinc-950">{count}</div>}
    </button>
  );
}
