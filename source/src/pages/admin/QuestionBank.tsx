import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { mockQuestions } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

const QuestionBank = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Enhance mock data for admin view
  const questions = [
    ...mockQuestions,
    {
      id: '991',
      text: "Which of the following is NOT a safe temperature for holding hot food?",
      options: ["120°F (49°C)", "135°F (57°C)", "140°F (60°C)", "165°F (74°C)"],
      correctAnswer: 0,
      explanation: "Hot food must be held at 135°F (57°C) or higher.",
      category: "Food Safety",
      difficulty: "Medium",
      status: "Active",
      type: 'multiple-choice',
      points: 10
    },
    {
      id: '992',
      text: "What is the primary function of the exhaust hood system?",
      options: ["Remove odors", "Remove grease and smoke", "Cool the kitchen", "Provide lighting"],
      correctAnswer: 1,
      explanation: "It removes grease-laden vapors and smoke.",
      category: "Equipment",
      difficulty: "Easy",
      status: "Review",
      type: 'multiple-choice',
      points: 10
    }
  ];

  const filteredQuestions = questions.filter(q => 
    (q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
     q.category?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'All' || q.category === filterCategory)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">題庫管理</h2>
          <p className="text-sm text-gray-500">管理考試題目與 AI 審核</p>
        </div>
        <button 
          onClick={() => navigate('/admin/questions/new')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>新增題目</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋題目或標籤..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">所有分類</option>
              <option value="Food Safety">食品安全</option>
              <option value="Equipment">設備</option>
              <option value="Regulations">法規</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">題目</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">分類</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">狀態</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{q.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{q.text}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{q.options ? q.options[Number(q.correctAnswer)] : ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {q.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (q as any).status === 'Review' 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {(q as any).status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/admin/questions/${q.id}`)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/questions/${q.id}`)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between">
          <span className="text-sm text-gray-500">顯示第 1 到 {filteredQuestions.length} 筆，共 {filteredQuestions.length} 筆</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50" disabled>上一頁</button>
            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50" disabled>下一頁</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
