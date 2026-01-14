import React from 'react';
import { Search, MoreHorizontal, Shield, UserX, UserCheck, Mail } from 'lucide-react';

const UserList = () => {
  const users = [
    { id: 1, name: 'Alice Chen', email: 'alice@example.com', role: 'Student', status: 'Active', joined: '2024-05-20' },
    { id: 2, name: 'Bob Wang', email: 'bob@example.com', role: 'Student', status: 'Active', joined: '2024-05-21' },
    { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', role: 'VIP', status: 'Active', joined: '2024-05-22' },
    { id: 4, name: 'David Wu', email: 'david@example.com', role: 'Student', status: 'Suspended', joined: '2024-05-23' },
    { id: 5, name: 'Eve Lin', email: 'eve@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
    { id: 6, name: 'Frank Zhang', email: 'frank@example.com', role: 'Student', status: 'Inactive', joined: '2024-05-24' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">用戶管理</h2>
          <p className="text-sm text-gray-500">查看與管理註冊用戶</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋用戶姓名或 Email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700">
            匯出 CSV
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-700">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">用戶</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">角色</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">狀態</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">加入時間</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === 'Admin' ? <Shield className="w-3 h-3 text-indigo-500" /> : null}
                    <span className={`text-sm ${user.role === 'Admin' ? 'font-semibold text-indigo-600' : 'text-gray-600 dark:text-gray-300'}`}>
                      {user.role === 'Student' ? '學生' : user.role === 'Admin' ? '管理員' : user.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : user.status === 'Suspended'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {user.status === 'Active' ? '活躍' : user.status === 'Suspended' ? '停權' : '未啟用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                      <Mail className="w-4 h-4" />
                    </button>
                    {user.status === 'Suspended' ? (
                       <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded" title="Activate">
                       <UserCheck className="w-4 h-4" />
                     </button>
                    ) : (
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Suspend">
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
