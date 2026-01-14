import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const logoUrl = "data:image/png;base64,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";

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailRegex.test(email)) return setError('請輸入有效的 Email 格式');

    setIsLoading(true);
    // 模擬發送流程
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 font-sans text-zinc-900">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 p-10 relative z-10">
        {!isSent ? (
          <>
            <div className="text-center mb-8">
              <img src={logoUrl} alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg" />
              <h1 className="text-3xl font-black tracking-tight mb-2">找回密碼</h1>
              <p className="text-zinc-500 font-medium px-4">請輸入電子郵件，我們將發送驗證信給您</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="email" required placeholder="example@mail.com"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-70">
                {isLoading ? "正在發送..." : "發送驗證信"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2">已發送驗證信</h2>
            <p className="text-zinc-500 font-medium mb-10">請檢查您的收件匣（包含垃圾郵件箱）</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-zinc-400 hover:text-indigo-600 font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" /> 返回登入界面
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
