import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, Mail, Lock, Check,
  Eye, EyeOff, Save, AlertCircle, Camera
} from 'lucide-react';
import { useGlobalState } from '@/state/GlobalState';
import { cn } from '../lib/utils';

const CARTOON_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useGlobalState();

  // 1. 基本資料狀態
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);

  // 2. 密碼彈窗與欄位狀態
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // 3. 獨立的顯示/隱藏切換
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 4. Regex 驗證邏輯
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const isEmailValid = emailRegex.test(email);
  const isNameValid = name.trim().length >= 2;
  const isNewPassValid = passwordRegex.test(newPass);
  const isConfirmValid = newPass === confirmPass && confirmPass.length > 0;

  // 按鈕啟動條件：原密碼不為空、新密碼格式正確、兩次輸入一致
  const canSubmitPassword = currentPass.length > 0 && isNewPassValid && isConfirmValid;

  // 5. 定義處理函式 (解決 ReferenceError)
  const handlePasswordSubmit = () => {
    if (!canSubmitPassword) return;

    // 這裡實作提交邏輯
    console.log("密碼已修改");
    alert("密碼修改成功！");

    // 清除狀態並關閉彈窗
    setIsChangingPassword(false);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleSaveSettings = () => {
    if (isNameValid && isEmailValid) {
      updateUser({ name, email, avatar });
      alert("資料已儲存");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-zinc-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-zinc-600" />
          </button>
          <h1 className="text-lg font-black text-zinc-900">帳號設定</h1>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={!isEmailValid || !isNameValid}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            (isEmailValid && isNameValid) ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          )}
        >
          儲存變更
        </button>
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-8">
        {/* 頭貼選擇 */}
        <section className="bg-white rounded-[2.5rem] p-6 border border-zinc-100 shadow-sm text-center">
          <div className="relative inline-block mb-6">
            <img src={avatar} className="w-24 h-24 rounded-full border-4 border-indigo-50 object-cover mx-auto" alt="Avatar" />
            <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white"><Camera size={14}/></div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {CARTOON_AVATARS.map((url) => (
              <button key={url} onClick={() => setAvatar(url)} className={cn("rounded-xl overflow-hidden border-2 transition-all aspect-square", avatar === url ? "border-indigo-600 scale-110" : "border-transparent opacity-50 hover:opacity-100")}>
                <img src={url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* 姓名與 Email */}
        <section className="bg-white rounded-[2.5rem] p-6 border border-zinc-100 shadow-sm space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-400 ml-1 flex items-center gap-2"><User size={14}/> 姓名</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-400 ml-1 flex items-center gap-2"><Mail size={14}/> 電子郵件</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={() => setIsChangingPassword(true)} className="w-full flex items-center justify-between p-4 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-colors">
            <div className="flex items-center gap-3"><Lock size={18} className="text-rose-500"/><span className="text-sm font-bold text-zinc-700">修改登入密碼</span></div>
            <div className="text-indigo-600 text-xs font-bold">修改</div>
          </button>
        </section>
      </div>

      {/* 修改密碼彈窗 */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-black text-zinc-900">安全性更新</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Update Password</p>
            </div>

            <div className="space-y-4">
              {/* 原密碼 */}
              <div className="relative">
                <input type={showCurrent ? "text" : "password"} placeholder="目前使用的密碼" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full bg-zinc-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 pr-10" />
                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-3.5 text-zinc-400 hover:text-indigo-500">
                  {showCurrent ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>

              {/* 新密碼 */}
              <div className="space-y-1">
                <div className="relative">
                  <input type={showNew ? "text" : "password"} placeholder="設置新密碼" value={newPass} onChange={e => setNewPass(e.target.value)} className={cn("w-full bg-zinc-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 pr-10", (newPass && !isNewPassValid) ? "focus:ring-rose-500 ring-1 ring-rose-200" : "focus:ring-indigo-500")} />
                  <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3.5 text-zinc-400 hover:text-indigo-500">
                    {showNew ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                <p className="text-[10px] text-rose-500 font-bold px-1 flex items-center gap-1">
                  <AlertCircle size={10} /> 密碼需至少 8 位字元，並包含英文與數字組合
                </p>
              </div>

              {/* 確認密碼 */}
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} placeholder="再次確認新密碼" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className={cn("w-full bg-zinc-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 pr-10", (confirmPass && !isConfirmValid) ? "focus:ring-rose-500 ring-1 ring-rose-200" : "focus:ring-indigo-500")} />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3.5 text-zinc-400 hover:text-indigo-500">
                  {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsChangingPassword(false)} className="flex-1 py-3 font-bold text-zinc-400 hover:text-zinc-600 transition-colors">取消</button>
              <button
                onClick={handlePasswordSubmit}
                disabled={!canSubmitPassword}
                className={cn(
                  "flex-1 py-3 rounded-2xl font-black text-sm transition-all shadow-lg",
                  canSubmitPassword ? "bg-zinc-900 text-white active:scale-95" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                )}
              >
                確認更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
