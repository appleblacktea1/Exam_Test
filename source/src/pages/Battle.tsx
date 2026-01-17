import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockUser, mockUsers, mockCategories } from '@/lib/mockData';
import { Swords, Clock, Trophy, ArrowLeft, Zap, AlertTriangle, X, CheckCircle2, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useGlobalState } from '@/state/GlobalState';
import { cn } from '@/lib/utils';

// 動態匯入所有題目 JSON
const questionFiles = import.meta.glob('../lib/questions/*.json');
// 動態匯入所有圖片 (支援 jpg, png, svg, webp)
const allImages = import.meta.glob('../lib/questions/images/**/*.{jpg,jpeg,png,svg,webp}', { eager: true });

export default function Battle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { config } = useGlobalState();
  const opponent = useMemo(() => mockUsers[1], []);

  // --- 狀態管理 ---
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 遊戲狀態
  const [timeLeft, setTimeLeft] = useState(20);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);

  // 支援多選：改用陣列儲存選中的 index
  const [myAnswerIndices, setMyAnswerIndices] = useState<number[]>([]);
  const [opAnswerIndices, setOpAnswerIndices] = useState<number[]>([]);

  const [finished, setFinished] = useState(false);
  const [pulseMy, setPulseMy] = useState(false);
  const [pulseOp, setPulseOp] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null); // 圖片放大燈箱

  const isBypassingInterceptor = useRef(false);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // --- 輔助函式：解析圖片路徑 ---
  const getImageUrl = (pathOrObj: any) => {
    if (!pathOrObj) return null;
    // 有些 JSON 結構可能是 { file_path: "..." } 或直接是字串
    const path = typeof pathOrObj === 'object' ? pathOrObj.file_path : pathOrObj;
    if (typeof path !== 'string') return null;

    // 將 JSON 裡可能的 @/ 路徑轉換為相對路徑，或是直接匹配
    // 這裡假設 JSON 裡的路徑格式能對應到 glob 的 key
    // 常見修正：把 @/ 換成 ../
    const normalizedPath = path.replace('@/', '../');
    const target = allImages[normalizedPath];
    return target ? (target as any).default : null;
  };

  // --- 1. 載入題目 ---
  useEffect(() => {
    async function loadQuestions() {
      if (!id) {
        setError("無效的考卷 ID");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const matchingPaths = Object.keys(questionFiles).filter(path => path.includes(id));
        if (matchingPaths.length === 0) {
          setError(`找不到 ID: ${id} 的相關考卷`);
          setLoading(false);
          return;
        }

        const loadedModules = await Promise.all(matchingPaths.map(path => questionFiles[path]()));

        let pool: any[] = [];
        loadedModules.forEach((mod: any) => {
          const data = mod.default || mod;
          const qs = Array.isArray(data) ? data : (data.questions || []);
          pool = pool.concat(qs);
        });

        if (pool.length > 0) {
          // 隨機取 5 題
          setQuestions(pool.sort(() => 0.5 - Math.random()).slice(0, 5));
        } else {
          setError("讀取到的題庫為空");
        }
      } catch (err) {
        console.error(err);
        setError("載入發生錯誤");
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [id]);

  const examDisplayName = useMemo(() => {
    for (const cat of mockCategories) {
      for (const group of cat.groups || []) {
        const match = group.exams.find(ex => ex.id === id);
        if (match) return match.name;
      }
    }
    return id;
  }, [id]);

  // --- 2. 攔截機制 ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!finished && !isBypassingInterceptor.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    if (!finished && !loading && !error) {
      window.history.pushState({ noBack: true }, '', window.location.href);
    }
    const handlePopState = () => {
      if (!finished && !isBypassingInterceptor.current && !loading && !error) {
        setShowExitConfirm(true);
        window.history.pushState({ noBack: true }, '', window.location.href);
      } else if (finished || error) {
        navigate('/arena');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [finished, loading, error]);

  // --- 3. 計時器 ---
  useEffect(() => {
    if (loading || finished || error || questions.length === 0) return;
    tickRef.current = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [loading, finished, error, questions.length]);

  useEffect(() => {
    if (timeLeft === 0 && !finished && !loading) handleLockIn();
  }, [timeLeft, finished, loading]);

  // --- 4. 對手機器人邏輯 ---
  useEffect(() => {
    if (loading || finished || error || questions.length === 0) return;

    setOpAnswerIndices([]);
    const delay = Math.floor(3000 + Math.random() * 8000);
    const currentQ = questions[questionIndex];
    if (!currentQ) return;

    const t = setTimeout(() => {
      // 簡單模擬：隨機選 1~2 個選項
      const optionCount = currentQ.options?.length || 4;
      const count = Math.random() > 0.8 ? 2 : 1; // 20% 機率選兩個
      const chosen: number[] = [];
      while (chosen.length < count) {
        const idx = Math.floor(Math.random() * optionCount);
        if (!chosen.includes(idx)) chosen.push(idx);
      }
      setOpAnswerIndices(chosen);
    }, delay);

    return () => clearTimeout(t);
  }, [questionIndex, loading, finished, questions]);

  // --- 5. 處理選項點擊 (單選/多選) ---
  const handleOptionClick = (idx: number, isMultiple: boolean) => {
    if (isMultiple) {
      setMyAnswerIndices(prev => {
        if (prev.includes(idx)) return prev.filter(i => i !== idx);
        return [...prev, idx];
      });
    } else {
      setMyAnswerIndices([idx]);
    }
  };

  // --- 6. 鎖定答案與算分 ---
  const handleLockIn = () => {
    if (finished || loading) return;
    const q = questions[questionIndex];
    if (!q) return;

    const base = Math.max(1, config.baseExpPerQuestion);
    const speedBonus = Math.max(0, timeLeft);

    // --- 比對答案邏輯 ---
    // 假設 q.correctAnswer 可能是一個 index (單選: 2) 或 array (多選: [0, 2])
    // 或者 key (單選: "C") 或 array (多選: ["A", "C"])
    // 這裡我們統一轉成「正確選項的 indices」來比對

    let correctIndices: number[] = [];
    if (Array.isArray(q.correctAnswer)) {
      // 多選情況
      q.correctAnswer.forEach((ans: any) => {
        if (typeof ans === 'number') {
           correctIndices.push(ans);
        } else {
           // 如果是 key (例如 "A"), 找 index
           const idx = q.options.findIndex((opt: any) => (typeof opt === 'string' ? false : opt.key === ans));
           if (idx !== -1) correctIndices.push(idx);
        }
      });
    } else {
      // 單選情況
      if (typeof q.correctAnswer === 'number') {
        correctIndices.push(q.correctAnswer);
      } else {
        const idx = q.options.findIndex((opt: any) => (typeof opt === 'string' ? false : opt.key === q.correctAnswer));
        if (idx !== -1) correctIndices.push(idx);
      }
    }

    // 比對 myAnswerIndices 是否完全等於 correctIndices (忽略順序)
    const isMyCorrect =
      myAnswerIndices.length === correctIndices.length &&
      myAnswerIndices.every(val => correctIndices.includes(val));

    // 機器人判斷 (簡單隨機)
    const isOpCorrect = Math.random() > 0.5; // 50% 機率對

    if (isMyCorrect) {
      setMyScore(s => s + base + speedBonus);
      setPulseMy(true);
      setTimeout(() => setPulseMy(false), 500);
    }

    if (isOpCorrect) {
      setOpScore(s => s + base + Math.floor(speedBonus / 2));
      setPulseOp(true);
      setTimeout(() => setPulseOp(false), 500);
    }

    const next = questionIndex + 1;
    if (next >= questions.length) {
      setFinished(true);
    } else {
      setQuestionIndex(next);
      setTimeLeft(20);
      setMyAnswerIndices([]);
      setOpAnswerIndices([]);
    }
  };

  const handleConfirmExit = () => {
    isBypassingInterceptor.current = true;
    setShowExitConfirm(false);
    navigate('/arena', { replace: true });
  };

  const currentQ = questions[questionIndex];
  // 判斷題型：如果 correctAnswer 是陣列，或者 options 裡有 isMultiple 標記 (視你的 JSON 結構而定)
  // 這裡簡單用 correctAnswer 是否為陣列來判斷
  const isMultipleChoice = currentQ && Array.isArray(currentQ.correctAnswer);

  // --- Render ---
  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
  if (error) return <div className="h-screen flex flex-col items-center justify-center p-6 text-center"><AlertTriangle className="text-zinc-300 mb-4" size={40} /><p>{error}</p><button onClick={() => navigate('/arena')} className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-xl">返回</button></div>;

  return (
    <div className="min-h-screen bg-zinc-50 pb-safe font-sans text-zinc-900">
      {/* 圖片放大燈箱 */}
      {zoomImg && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} className="max-w-full max-h-[90vh] object-contain rounded-lg" alt="zoom" />
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white"><X /></button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 pt-8 rounded-b-[2.5rem] text-white shadow-xl sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto w-full px-2">
          <button onClick={() => finished ? navigate('/arena') : setShowExitConfirm(true)} className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Swords className="w-4 h-4" /> {examDisplayName}
          </h1>
          <div className="px-4 py-1.5 rounded-2xl bg-zinc-900/20 backdrop-blur-xl border border-white/20 flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-200" />
            <span className="font-black tabular-nums">{timeLeft}s</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto w-full px-2">
           <div className={cn("bg-white/15 rounded-[1.5rem] p-4 transition-all", pulseMy && "bg-white/30 scale-105")}>
             <div className="text-[10px] opacity-70">YOU</div>
             <div className="text-xl font-black">{myScore}</div>
           </div>
           <div className={cn("bg-white/15 rounded-[1.5rem] p-4 text-right transition-all", pulseOp && "bg-white/30 scale-105")}>
             <div className="text-[10px] opacity-70">OPPONENT</div>
             <div className="text-xl font-black">{opScore}</div>
           </div>
        </div>
      </div>

      {/* 主體內容 */}
      <div className="p-4 max-w-2xl mx-auto mt-4">
        {!finished ? (
          <div className="space-y-4">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-zinc-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
                <div className="h-full bg-indigo-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 20) * 100}%` }} />
              </div>

              {/* 題號與題型標籤 */}
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                   <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black tracking-widest">
                     Q{questionIndex + 1} / {questions.length}
                   </span>
                   {/* 題型提示 */}
                   <span className={cn(
                     "px-2 py-1 rounded-md text-[10px] font-bold border",
                     isMultipleChoice
                       ? "bg-purple-50 text-purple-600 border-purple-100"
                       : "bg-emerald-50 text-emerald-600 border-emerald-100"
                   )}>
                     {isMultipleChoice ? "複選題" : "單選題"}
                   </span>
                 </div>
              </div>

              <h2 className="text-xl font-black text-zinc-800 leading-snug mb-4 whitespace-pre-wrap">
                {currentQ?.text}
              </h2>

              {/* 題目圖片顯示區 */}
              {currentQ?.images && currentQ.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
                  {currentQ.images.map((img: any, idx: number) => {
                    const src = getImageUrl(img);
                    if (!src) return null;
                    return (
                      <div key={idx} className="relative group shrink-0">
                        <img
                          src={src}
                          className="h-32 w-auto rounded-xl border border-zinc-100 object-cover cursor-zoom-in hover:opacity-90"
                          onClick={() => setZoomImg(src)}
                          alt="question-img"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full text-white pointer-events-none">
                          <ImageIcon size={12} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="grid gap-3">
                {currentQ?.options?.map((opt: any, idx: number) => {
                  const displayKey = typeof opt === 'string' ? '' : opt.key;
                  const displayText = typeof opt === 'string' ? opt : opt.text;
                  const optImgUrl = typeof opt === 'string' ? null : getImageUrl(opt.imageUrl); // 選項圖片
                  const isSelected = myAnswerIndices.includes(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx, isMultipleChoice)}
                      className={cn(
                        "group text-left p-5 rounded-2xl border-2 transition-all active:scale-[0.98]",
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                          : "bg-zinc-50 border-transparent hover:bg-zinc-100 text-zinc-600"
                      )}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                            {displayKey && (
                                <span className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5",
                                    isSelected ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-500"
                                )}>
                                    {displayKey}
                                </span>
                            )}
                            <span className="font-bold leading-relaxed">{displayText}</span>
                            {isSelected && <CheckCircle2 size={18} className="ml-auto text-white/80 shrink-0" />}
                        </div>
                        {/* 選項圖片 */}
                        {optImgUrl && (
                          <img
                            src={optImgUrl}
                            className="w-full h-32 object-contain rounded-lg bg-white/50 border border-black/5 mt-2"
                            alt="option-img"
                            onClick={(e) => {
                                e.stopPropagation(); // 避免觸發按鈕點擊
                                setZoomImg(optImgUrl);
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLockIn}
              disabled={myAnswerIndices.length === 0}
              className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-black shadow-xl disabled:opacity-30 transition-all active:scale-95"
            >
              鎖定答案 {isMultipleChoice && myAnswerIndices.length > 0 && `(${myAnswerIndices.length})`}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl text-center">
            <Trophy className={cn("w-20 h-20 mx-auto mb-4", myScore >= opScore ? "text-yellow-400" : "text-zinc-300")} />
            <h2 className="text-3xl font-black mb-2">{myScore >= opScore ? '勝利！' : '惜敗'}</h2>
            <p className="text-zinc-400 font-bold mb-8">最終比分：{myScore} - {opScore}</p>
            <button onClick={() => navigate('/arena')} className="w-full py-4 bg-zinc-100 rounded-2xl font-bold">返回競技場</button>
          </div>
        )}
      </div>

      {/* 退出彈窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center">
             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h3 className="text-xl font-black mb-2">確定放棄？</h3>
             <p className="text-zinc-400 text-sm mb-6">將會扣除積分。</p>
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setShowExitConfirm(false)} className="py-3 bg-zinc-100 rounded-xl font-bold">取消</button>
               <button onClick={handleConfirmExit} className="py-3 bg-red-500 text-white rounded-xl font-bold">確認</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
