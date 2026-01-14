import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Brain, BookOpen, Share2, Map, ArrowRight } from 'lucide-react';
import { mockQuestions, mockStages } from '@/lib/mockData';

const QuizAnalysis = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock analysis data (in a real app, this would come from the location state or DB)
  // Filtering questions for the stage if id exists, or just taking first 3 for demo
  const stageQuestions = id ? mockQuestions.filter(q => q.stageId === id) : [];
  const displayQuestions = stageQuestions.length > 0 ? stageQuestions : mockQuestions.slice(0, 3);

  const results = displayQuestions.map((q, idx) => ({
    ...q,
    userAnswer: idx === 0 ? 0 : idx === 1 ? 2 : 1, // Mock user answers (Wrong, Correct, Correct)
    isCorrect: idx !== 0,
    aiAnalysis: q.explanation || "此題目測試您對核心概念的理解。請複習相關章節以加強記憶。"
  }));

  const score = Math.round((results.filter(r => r.isCorrect).length / results.length) * 100);

  // Find current stage and next stage
  const currentStage = mockStages.find(s => s.id === id);
  const nextStage = currentStage
    ? mockStages.find(s => s.examId === currentStage.examId && s.orderIndex === currentStage.orderIndex + 1)
    : null;

  const handleBackToMap = () => {
     if (currentStage?.examId) {
         navigate(`/challenge/${currentStage.examId}`);
     } else {
         navigate('/');
     }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg">測驗分析</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Score Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500 mb-1">總分</div>
            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{score}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-500 mb-1">準確率</div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">
              {results.filter(r => r.isCorrect).length}/{results.length}
            </div>
          </div>
        </div>

        {/* AI Insight Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1">AI 學習洞察</h2>
              <p className="text-purple-100 text-sm leading-relaxed">
                做得好！您在<span className="font-bold text-white">基礎觀念</span>方面表現優異，但在<span className="font-bold text-white">實務應用</span>方面還有進步空間。建議加強複習相關法規與操作流程。
              </p>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white px-1">詳細檢討</h3>

          {results.map((item, idx) => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 scroll-mt-20" id={`q-${idx}`}>
              {/* Question Header */}
              <div className="flex gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  item.isCorrect
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      item.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.isCorrect ? '答對' : '答錯'}
                    </span>
                    <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-white leading-snug">
                    {item.text}
                  </h4>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-6 pl-11">
                {item.options.map((opt, optIdx) => {
                  const isSelected = optIdx === item.userAnswer;
                  const isCorrect = optIdx === item.correctAnswer;

                  let style = "border-zinc-200 dark:border-zinc-700 opacity-70";
                  let icon = null;

                  if (isCorrect) {
                    style = "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900 text-green-800 dark:text-green-300 font-medium opacity-100";
                    icon = <CheckCircle className="w-4 h-4 text-green-600" />;
                  } else if (isSelected && !isCorrect) {
                    style = "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900 text-red-800 dark:text-red-300 font-medium opacity-100";
                    icon = <XCircle className="w-4 h-4 text-red-600" />;
                  }

                  return (
                    <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between text-sm ${style}`}>
                      <span>{opt}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>

              {/* AI Analysis Box */}
              <div className="pl-11">
                <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                      AI 解析
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {item.aiAnalysis}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-50 shadow-lg">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={handleBackToMap}
            className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Map className="w-5 h-5" />
            返回地圖
          </button>
          {nextStage ? (
            <button
              onClick={() => navigate(`/quiz/${nextStage.id}`)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-colors flex items-center justify-center gap-2"
            >
              下一關
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              disabled
            >
              已完成所有關卡
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAnalysis;
