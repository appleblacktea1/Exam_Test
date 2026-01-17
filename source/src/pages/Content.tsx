import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  History,
  MessageSquareWarning,
  CheckCircle2,
  Clock,
  Mail,
  AlertCircle // 新增 icon 用於顯示錯誤
} from 'lucide-react';

const CustomerServicePage = () => {
  const navigate = useNavigate();

  // 定義初始狀態 (方便之後重置使用)
  const initialFormState = {
    type: 'question',
    title: '',
    email: '',
    content: ''
  };

  // 1. 表單資料狀態
  const [formData, setFormData] = useState(initialFormState);

  // 2. 錯誤訊息狀態 (用於 Regex 驗證失敗時顯示)
  const [errors, setErrors] = useState({
    email: '',
    title: '',
    content: ''
  });

  // 3. Loading 狀態 (防止使用者重複點擊)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 核心邏輯區 ---
  // 驗證函數
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', title: '', content: '' };

    // Regex: 這裡使用標準 Email 格式驗證
    // 如果您只想限制 "@gmail.com"，可以用 /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/i
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = '請輸入電子信箱';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email 格式不正確 (例如: user@example.com)';
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = '請輸入標題';
      isValid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = '請輸入詳細內容';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 先執行驗證
    if (!validateForm()) {
      return; // 驗證失敗則中斷
    }

    setIsSubmitting(true);

    // 2. 準備要傳給後端的資料包 (Payload)
    // 這裡的結構就是您之後 API 接收到的 JSON 格式
    const apiPayload = {
      category: formData.type,    // 對應後端欄位
      subject: formData.title,    // 對應後端欄位
      contact_email: formData.email, // 對應後端欄位
      message_body: formData.content, // 對應後端欄位
      created_at: new Date().toISOString()
    };

    try {
      // -----------------------------------------------------------
      // TODO: 之後在這裡串接您的後端 API
      // 範例: const response = await axios.post('/api/tickets', apiPayload);
      // -----------------------------------------------------------

      console.log('準備發送至後端的資料:', apiPayload);

      // 模擬 API 請求延遲 (1.5秒)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. 成功後的處理
      alert('✅ 客服單已成功送出！');

      // 4. 自動清除表格中的值 (重置為初始狀態)
      setFormData(initialFormState);
      setErrors({ email: '', title: '', content: '' }); // 清除錯誤訊息

    } catch (error) {
      alert('❌ 發生錯誤，請稍後再試');
      console.error(error);
    } finally {
      setIsSubmitting(false); // 解除 Loading 狀態
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 h-16 flex items-center shadow-sm">
        <h1 className="ml-3 text-lg font-bold text-gray-800 flex items-center gap-2">
          <MessageSquareWarning className="w-5 h-5 text-indigo-600" />
          客服中心
        </h1>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* --- 表單區塊 --- */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              填寫回報單
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 問題類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">問題類型</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="question">一般提問</option>
                <option value="bug">系統 Bug 回報</option>
                <option value="account">帳號與會員問題</option>
                <option value="exam">題庫內容錯誤</option>
              </select>
            </div>

            {/* 標題 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                標題 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="請簡述您的問題..."
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                value={formData.title}
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value});
                  if (errors.title) setErrors({...errors, title: ''}); // 輸入時清除紅框
                }}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.title}</p>}
            </div>

            {/* 聯絡信箱 (含 Regex 驗證 UI) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                聯絡信箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: ''}); // 輸入時清除紅框
                }}
              />
              {/* 錯誤訊息顯示區 */}
              {errors.email ? (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12}/> {errors.email}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">我們將透過此信箱回覆您的處理進度。</p>
              )}
            </div>

            {/* 詳細內容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                詳細內容 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="請詳細描述..."
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all resize-none ${
                  errors.content ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                value={formData.content}
                onChange={(e) => {
                  setFormData({...formData, content: e.target.value});
                  if (errors.content) setErrors({...errors, content: ''});
                }}
              />
              {errors.content && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.content}</p>}
            </div>

            {/* 送出按鈕 (加入 Loading 狀態) */}
            <button
              type="submit"
              disabled={isSubmitting} // 防止重複點擊
              className={`
                w-full font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-black hover:shadow-xl active:scale-[0.98] text-white'}
              `}
            >
              {isSubmitting ? (
                <>處理中...</>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  送出回報單
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CustomerServicePage;
