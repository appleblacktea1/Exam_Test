import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, Image as ImageIcon, HelpCircle } from 'lucide-react';
import { mockQuestions } from '@/lib/mockData';

const QuestionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';

  // Find existing question if in edit mode
  const existingQuestion = isEditMode 
    ? mockQuestions.find(q => q.id.toString() === id) 
    : null;

  const [formData, setFormData] = useState({
    text: existingQuestion?.text || '',
    category: existingQuestion?.category || 'Food Safety',
    difficulty: existingQuestion?.difficulty || 1,
    options: existingQuestion?.options || ['', '', '', ''],
    correctAnswer: existingQuestion?.correctAnswer || 0,
    explanation: (existingQuestion as any)?.explanation || '',
    certificationType: existingQuestion?.certificationType || '中餐丙級'
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to Supabase
    console.log('Saving question:', formData);
    alert('題目儲存成功！ (模擬)');
    navigate('/admin/questions');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/questions')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? '編輯題目' : '新增題目'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditMode ? `ID: #${id}` : '為學生創建新的挑戰'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditMode && (
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900">
              <Trash2 className="w-4 h-4" />
              <span>刪除</span>
            </button>
          )}
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm font-medium"
          >
            <Save className="w-4 h-4" />
            <span>儲存題目</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Text */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                題目內容
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="在此輸入題目..."
              />
            </div>
            
            <div>
              <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                <ImageIcon className="w-4 h-4" />
                <span>新增圖片附件</span>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">答案選項</h3>
            <div className="space-y-4">
              {formData.options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === idx}
                    onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className={`w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                          formData.correctAnswer === idx 
                            ? 'border-green-500 ring-1 ring-green-500 bg-green-50 dark:bg-green-900/10' 
                            : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        placeholder={`選項 ${idx + 1}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <HelpCircle className="w-4 h-4" />
                詳解 (AI 生成或手動輸入)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="解釋為何此答案是正確的..."
              />
              <div className="flex justify-end mt-2">
                <button className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
                  ✨ AI 生成詳解
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              設定
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">分類</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="Food Safety">食品安全</option>
                <option value="Equipment">設備</option>
                <option value="Hygiene">衛生</option>
                <option value="Regulations">法規</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">證照類型</label>
              <select
                value={formData.certificationType}
                onChange={(e) => setFormData({ ...formData, certificationType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="中餐丙級">中餐丙級</option>
                <option value="西餐丙級">西餐丙級</option>
                <option value="烘焙丙級">烘焙丙級</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">難度 (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg border transition-all ${
                      formData.difficulty === level
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 text-gray-600 border-gray-200 dark:border-zinc-700 hover:bg-gray-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">狀態</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                  已啟用
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
