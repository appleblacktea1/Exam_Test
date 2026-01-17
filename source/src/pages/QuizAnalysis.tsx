import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, XCircle, Brain, BookOpen, Map,
  Target, Lock, Sparkles, AlertCircle, ListChecks, CheckSquare, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- 1. 動態掃描圖片資源 ---
const allImages = import.meta.glob('../lib/questions/images/**/*.{jpg,jpeg,png,svg,webp}', { eager: true });

// --- 2. 圖片處理邏輯 ---
const getImageUrl = (jsonPath: any) => {
  if (!jsonPath) return null;
  const path = typeof jsonPath === 'object' ? jsonPath.file_path : jsonPath;
  if (typeof path !== 'string') return null;
  const normalizedPath = path.replace('@/', '../');
  const target = allImages[normalizedPath];
  return target ? (target as any).default : null;
};

interface AnalysisState {
  questions: any[];
  userAnswers: Record<number, string | string[]>;
  score: number;
  correctCount: number;
  returnPath: string;
}

const QuizAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // 這裡取得的 id 是完整的，例如 "110_110010_507_04"

  const state = location.state as AnalysisState;

  // 圖片燈箱狀態
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // 權限模擬
  const isPro = true;

  const getMaskedContent = (realLength: number = 50) => {
    const mask = "此為付費解鎖內容，請升級會員以查看完整 AI 解析。";
    return mask.repeat(Math.ceil(realLength / mask.length));
  };

  // 防呆機制
  useEffect(() => {
    if (!state) {
      if (id) {
        const target = `/quiz/${id}`;
        navigate(target, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [state, navigate, id]);

  if (!state) return null;

  const { questions, userAnswers, score, correctCount, returnPath } = state;

  // --- [關鍵修正] 處理返回路徑邏輯 ---
  const handleReturn = () => {
    // 如果是隨機模式，直接返回原本的路徑即可
    if (id?.includes('_random')) {
      navigate(returnPath);
      return;
    }

    // 針對一般模式，進行 ID 修正 (110_110010_507_04 -> 010_507_04)
    // 我們使用 URL 上的 id (因為它是最完整的原始資料) 來進行計算
    if (id) {
      const parts = id.split('_'); // ['110', '110010', '507', '04']

      if (parts.length >= 2) {
        const year = parts[0];     // "110"
        const rawCode = parts[1];  // "110010"

        let cleanCode = rawCode;
        // 如果第二段包含年份，則切除
        if (rawCode.startsWith(year)) {
          cleanCode = rawCode.slice(year.length); // "010"
        }

        // 剩餘部分
        const rest = parts.slice(2).join('_'); // "507_04"
        const newId = rest ? `${cleanCode}_${rest}` : cleanCode; // "010_507_04"

        // 組合路徑: 取得 returnPath 的前段 (例如 /challenge/) + 新 ID
        const pathParts = returnPath.split('/');
        const basePath = pathParts.slice(0, pathParts.length - 1).join('/');

        navigate(`${basePath}/${newId}`);
        return;
      }
    }

    // 如果無法處理，則使用預設路徑
    navigate(returnPath);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] pb-32 font-sans">

      {/* 圖片燈箱 */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setZoomImg(null)}
        >
          <img src={zoomImg} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" alt="Zoom" />
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-[#1a1b26] sticky top-0 z-10 border-b border-zinc-200 dark:border-white/5 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleReturn}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </button>
            <h1 className="font-black text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              AI 智能解析
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Score Card */}
        <div className="bg-white dark:bg-[#18181b] rounded-[2rem] p-6 shadow-xl border border-zinc-200 dark:border-white/10 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">本次得分</div>
            <div className={cn("text-5xl font-black tracking-tighter", score >= 60 ? "text-emerald-500" : "text-rose-500")}>
              {score}
            </div>
          </div>
          <div className="text-right z-10">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">準確率</div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white flex items-center justify-end gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              {correctCount} / {questions.length}
            </div>
          </div>
        </div>

        {/* AI Insight Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">學習洞察</h2>
              <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                {score === 100 ? "完美！您已經完全掌握了這些概念。" :
                 score >= 60 ? "表現不錯，建議針對錯誤的題目閱讀下方解析。" :
                 "別氣餒，透過 AI 解析找出盲點，下次會更好！"}
              </p>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="space-y-6">
          <h3 className="font-black text-xl text-zinc-900 dark:text-white px-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> 詳細檢討
          </h3>

          {questions.map((q, idx) => {
            const myAnsRaw = userAnswers[idx];
            const correctAnsRaw = q.correctAnswer;

            const myAnsArr = Array.isArray(myAnsRaw) ? myAnsRaw : (myAnsRaw ? [myAnsRaw] : []);
            const correctArr = Array.isArray(correctAnsRaw) ? correctAnsRaw : [correctAnsRaw];

            const isCorrect =
              myAnsArr.length === correctArr.length &&
              myAnsArr.every((val: string) => correctArr.includes(val));

            // 判斷題型
            const isMultiChoice = q.type === 'mixed' || correctArr.length > 1;

            return (
              <div key={idx} className="bg-white dark:bg-[#18181b] rounded-[2rem] p-6 shadow-sm border border-zinc-200 dark:border-white/5 scroll-mt-24">

                {/* 1. 題目區塊 */}
                <div className="flex gap-4 mb-4">
                  <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm",
                      isCorrect
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                    )}>
                      {idx + 1}
                    </div>
                    {/* 題型標籤 */}
                    <div className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 border",
                      isMultiChoice
                        ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    )}>
                       {isMultiChoice ? <ListChecks size={10} /> : <CheckSquare size={10} />}
                       {isMultiChoice ? "複選" : "單選"}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap">
                      {q.text}
                    </h4>
                    {/* 題目圖片 */}
                    {q.images && q.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2 mt-2">
                        {q.images.map((imgStr: any, imgIdx: number) => {
                           const src = getImageUrl(imgStr);
                           return src && (
                             <img
                               key={imgIdx}
                               src={src}
                               alt="Question"
                               onClick={() => setZoomImg(src)}
                               className="h-32 md:h-40 w-auto rounded-xl border border-zinc-200 dark:border-white/10 cursor-zoom-in hover:opacity-90 transition-opacity"
                             />
                           );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. 選項列表 */}
                <div className="space-y-3 mb-6">
                  {q.options.map((opt: any) => {
                    const isSelected = myAnsArr.includes(opt.key);
                    const isAnswer = correctArr.includes(opt.key);
                    const optImg = getImageUrl(opt.imageUrl);

                    let containerStyle = "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 opacity-60";
                    let textClass = "text-zinc-500 dark:text-zinc-400";
                    let icon = null;

                    if (isAnswer) {
                      containerStyle = "bg-emerald-50 border-emerald-500 dark:bg-emerald-500/10 dark:border-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                      textClass = "text-emerald-800 dark:text-emerald-300 font-bold";
                      icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                    } else if (isSelected && !isAnswer) {
                      containerStyle = "bg-rose-50 border-rose-500 dark:bg-rose-500/10 dark:border-rose-500 opacity-100";
                      textClass = "text-rose-800 dark:text-rose-300 font-bold";
                      icon = <XCircle className="w-5 h-5 text-rose-500" />;
                    }

                    return (
                      <div key={opt.key} className={cn("p-4 rounded-xl border-2 flex flex-col gap-2 transition-all", containerStyle)}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center text-xs font-black border",
                                isAnswer ? "border-emerald-500 bg-emerald-500 text-white" :
                                (isSelected ? "border-rose-500 bg-rose-500 text-white" : "border-zinc-300 text-zinc-400")
                              )}>
                                {opt.key}
                              </div>
                              <span className={cn("text-sm md:text-base leading-snug", textClass)}>
                                {opt.text}
                              </span>
                            </div>
                            {icon}
                         </div>
                         {optImg && (
                             <img
                               src={optImg}
                               onClick={() => setZoomImg(optImg)}
                               className="h-24 w-auto rounded-lg border border-black/5 cursor-zoom-in self-start md:ml-9"
                               alt={opt.key}
                             />
                         )}
                      </div>
                    );
                  })}
                </div>

                {/* 3. AI 解析區 */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl border transition-all duration-300 group",
                    !isPro
                      ? "bg-zinc-100 dark:bg-[#1e1e24]/50 border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-indigo-500/50"
                      : "bg-indigo-50 dark:bg-[#1e1e24] border-indigo-100 dark:border-indigo-500/20"
                  )}
                  onClick={() => !isPro && navigate('/shop')}
                >
                  <div className="p-5">
                    {isPro && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          isPro ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-zinc-200 dark:bg-zinc-800"
                        )}>
                          {isPro
                            ? <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            : <Lock className="w-4 h-4 text-zinc-500" />
                          }
                        </div>
                        <span className={cn(
                          "text-xs font-black uppercase tracking-widest",
                          isPro ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"
                        )}>
                          AI 解析
                        </span>
                      </div>
                    </div>

                    <p className={cn(
                      "text-sm leading-relaxed font-medium transition-all duration-500",
                      isPro
                        ? "text-zinc-700 dark:text-zinc-300 mb-4"
                        : "text-zinc-400 dark:text-zinc-500 blur-sm select-none opacity-50 line-clamp-3"
                    )}>
                      {isPro
                        ? (q.explanation || "此題目暫無詳細解析。")
                        : getMaskedContent(q.explanation?.length || 50)
                      }
                    </p>

                    {isPro && (
                      <div className="flex items-start gap-2 pt-3 border-t border-indigo-200 dark:border-white/5">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-zinc-400 leading-snug">
                          本解析由 AI 自動生成，內容僅供參考。請以官方公佈的標準答案與最新法規為準。
                        </p>
                      </div>
                    )}
                  </div>

                  {!isPro && (
                    <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/5 transition-colors">
                      <div className="bg-zinc-900/90 dark:bg-white/90 text-white dark:text-black px-4 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                        <Lock size={12} />
                        解鎖完整解析
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-lg border-t border-zinc-200 dark:border-white/10 z-50">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleReturn}
            className="w-full bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-black py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <Map className="w-5 h-5" />
            返回列表
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalysis;
