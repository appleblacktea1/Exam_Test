import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockUser, mockUsers, mockQuestions } from '@/lib/mockData';
import { Swords, Clock, Trophy, ArrowLeft, Zap, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { useGlobalState } from '@/state/GlobalState';
import { cn } from '@/lib/utils';

export default function Battle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const opponent = useMemo(() => mockUsers[1], []);
  const { config } = useGlobalState();

  // --- 遊戲數據與狀態 ---
  const [timeLeft, setTimeLeft] = useState(20);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const [opAnswer, setOpAnswer] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  // 視覺效果狀態
  const [pulseMy, setPulseMy] = useState(false);
  const [pulseOp, setPulseOp] = useState(false);

  // 彈窗控制
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  /**
   * 關鍵鎖：防止「確認放棄」跳轉時再次觸發攔截
   */
  const isBypassingInterceptor = useRef(false);

  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const questions = useMemo(() => {
    return mockQuestions.filter(q => q.type === 'multiple-choice').slice(0, 5);
  }, []);

  // --- 核心防護邏輯 ---

  useEffect(() => {
    // 1. 攔截：瀏覽器刷新/關閉 (F5, Cmd+R, 關閉視窗)
    // 註：此時瀏覽器只會顯示「系統預設」彈窗，無法顯示自定義 UI
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!finished && !isBypassingInterceptor.current) {
        e.preventDefault();
        e.returnValue = ''; // 觸發你截圖中看到的系統視窗
      }
    };

    // 2. 攔截：瀏覽器上一頁/側滑返回
    // 進入頁面時先塞入一個虛擬狀態，讓使用者按回退時「有東西可以扣」
    if (!finished) {
      window.history.pushState({ noBack: true }, '', window.location.href);
    }

    const handlePopState = (e: PopStateEvent) => {
      if (!finished && !isBypassingInterceptor.current) {
        // 顯示你準備的美觀紅色自定義彈窗
        setShowExitConfirm(true);
        // 強制把網址推回去，防止頁面真的後退跳轉
        window.history.pushState({ noBack: true }, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [finished]);

  /**
   * 處理 UI 上的返回按鈕 (左上角箭頭)
   */
  const handleBackButtonClick = () => {
    if (finished) {
      navigate('/arena');
    } else {
      setShowExitConfirm(true);
    }
  };

  /**
   * 當使用者在自定義彈窗點擊「確認放棄」
   */
  const handleConfirmExit = () => {
    isBypassingInterceptor.current = true; // 暫時解開攔截鎖
    setShowExitConfirm(false);
    navigate('/arena', { replace: true });
  };

  // --- 遊戲計時與邏輯 ---

  useEffect(() => {
    tickRef.current = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) handleLockIn();
  }, [timeLeft]);

  useEffect(() => {
    setOpAnswer(null);
    const delay = Math.floor(3000 + Math.random() * 8000);
    const correct = questions[questionIndex].correctAnswer;
    const willBeCorrect = Math.random() < 0.6;
    const chosen = willBeCorrect ? correct : Math.floor(Math.random() * questions[questionIndex].options.length);
    const t = setTimeout(() => setOpAnswer(chosen), delay);
    return () => clearTimeout(t);
  }, [questionIndex]);

  const handleLockIn = () => {
    if (finished) return;
    const q = questions[questionIndex];
    const correct = q.correctAnswer;
    const base = Math.max(1, config.baseExpPerQuestion);
    const speedBonus = Math.max(0, timeLeft);

    if (myAnswer !== null) {
      const delta = myAnswer === correct ? base + speedBonus : 0;
      setMyScore(s => s + delta);
      if (delta > 0) {
        setPulseMy(true);
        setTimeout(() => setPulseMy(false), 500);
      }
    }
    if (opAnswer !== null) {
      const delta = opAnswer === correct ? base + Math.max(0, Math.floor(timeLeft / 2)) : 0;
      setOpScore(s => s + delta);
      if (delta > 0) {
        setPulseOp(true);
        setTimeout(() => setPulseOp(false), 500);
      }
    }

    const next = questionIndex + 1;
    if (next >= questions.length) {
      setFinished(true);
    } else {
      setQuestionIndex(next);
      setTimeLeft(20);
      setMyAnswer(null);
      setOpAnswer(null);
    }
  };

  const currentQ = questions[questionIndex];

  return (
    <div className="min-h-screen bg-zinc-50 pb-safe font-sans text-zinc-900">
      {/* 頂部 Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 pt-8 rounded-b-[2.5rem] text-white shadow-xl sticky top-0 z-30 transition-all">
        <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto w-full px-2">
          <button
            onClick={handleBackButtonClick}
            className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black flex items-center gap-2">
            <Swords className="w-6 h-6 animate-pulse" /> 對戰中
          </h1>
          <div className="px-4 py-1.5 rounded-2xl bg-zinc-900/20 backdrop-blur-xl border border-white/20 flex items-center gap-2 shadow-inner">
            <Clock className="w-4 h-4 text-pink-200" />
            <span className="font-black tabular-nums">{timeLeft}s</span>
          </div>
        </div>

        {/* 分數面板 */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto w-full px-2">
          <div className={cn(
            "bg-white/15 rounded-[1.5rem] p-4 border border-white/20 transition-all duration-300",
            pulseMy && "bg-white/30 scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          )}>
            <div className="flex items-center gap-3">
              <img src={mockUser.avatar} className="w-10 h-10 rounded-full border-2 border-white/40 shadow-sm" alt="me" />
              <div>
                <div className="text-[10px] font-black uppercase text-indigo-100 opacity-80">我方玩家</div>
                <div className="text-lg font-black">{myScore} <span className="text-xs opacity-60">pts</span></div>
              </div>
            </div>
          </div>
          <div className={cn(
            "bg-white/15 rounded-[1.5rem] p-4 border border-white/20 transition-all duration-300 text-right",
            pulseOp && "bg-white/30 scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          )}>
            <div className="flex items-center justify-end gap-3">
              <div>
                <div className="text-[10px] font-black uppercase text-pink-100 opacity-80">對手</div>
                <div className="text-lg font-black">{opScore} <span className="text-xs opacity-60">pts</span></div>
              </div>
              <img src={opponent.avatar} className="w-10 h-10 rounded-full border-2 border-white/40 shadow-sm" alt="op" />
            </div>
          </div>
        </div>
      </div>

      {/* 主體內容 */}
      <div className="p-4 max-w-2xl mx-auto relative mt-4">
        {!finished ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 題目卡片 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-zinc-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / 20) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Question {questionIndex + 1}
                </span>
                <span className="text-zinc-300 font-bold text-xs tracking-tighter">
                   OF {questions.length}
                </span>
              </div>

              <h2 className="text-xl font-black text-zinc-800 leading-snug mb-8">
                {currentQ.text}
              </h2>

              <div className="grid gap-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMyAnswer(idx)}
                    className={cn(
                      "group text-left p-5 rounded-2xl border-2 transition-all active:scale-[0.98]",
                      myAnswer === idx
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "bg-zinc-50 border-transparent hover:border-zinc-200 text-zinc-600 hover:bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{opt}</span>
                      {myAnswer === idx && <CheckCircle2 size={18} className="text-white/80" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                剩餘時間越多，積分加乘越高
              </div>
              <button
                onClick={handleLockIn}
                disabled={myAnswer === null}
                className="px-8 py-3.5 rounded-2xl bg-zinc-900 text-white font-black shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
              >
                鎖定答案
              </button>
            </div>
          </div>
        ) : (
          /* 結算畫面 */
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-zinc-100 text-center animate-in zoom-in fade-in duration-500">
            <div className="relative inline-block mb-6">
               <Trophy className={cn(
                 "w-20 h-20 mx-auto transition-transform duration-700 delay-300",
                 myScore >= opScore ? "text-yellow-400 scale-110 drop-shadow-xl" : "text-zinc-300"
               )} />
               {myScore >= opScore && (
                 <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-bounce">
                   VICTORY
                 </div>
               )}
            </div>

            <h2 className="font-black text-3xl text-zinc-900 mb-2">
              {myScore >= opScore ? '榮耀勝利！' : '戰敗...再接再厲'}
            </h2>
            <p className="text-zinc-400 font-bold mb-10">
              最終比分：<span className="text-indigo-600">{myScore}</span> 對 <span className="text-pink-500">{opScore}</span>
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/arena')}
                className="w-full py-5 bg-zinc-100 text-zinc-500 rounded-[1.5rem] font-black text-lg hover:bg-zinc-200 transition-all active:scale-95"
              >
                返回競技場
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- 自定義放棄對戰彈窗 (Custom Exit Modal) --- */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowExitConfirm(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-red-100">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <h3 className="text-2xl font-black text-zinc-900 mb-3">確定要退出嗎？</h3>
              <p className="text-zinc-400 font-bold text-sm leading-relaxed mb-10 px-4">
                比賽尚未結束，現在離開將會<span className="text-red-500">視同棄權</span>並扣除積分。
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="py-4 bg-zinc-100 text-zinc-500 font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                >
                  確認放棄
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowExitConfirm(false)}
              className="absolute top-8 right-8 text-zinc-300 hover:text-zinc-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
