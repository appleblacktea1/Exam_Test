import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Diamond, Gift, Zap, Coins, CreditCard,
  Crown, Sparkles, TrendingUp, BookOpen, Package, Clock, X, Check,
  Star, Flame, ShieldCheck
} from 'lucide-react';
import { useGlobalState } from '@/state/GlobalState';
import { cn } from '../lib/utils';

// 圖示映射表：讓後端傳回的字串轉為 Lucide 組件
const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-indigo-500" />,
  BookOpen: <BookOpen className="w-6 h-6 text-blue-500" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-emerald-500" />,
  Coins: <Coins className="w-6 h-6 text-yellow-500" />,
  Package: <Package className="w-6 h-6 text-zinc-500" />,
  Gift: <Gift className="w-6 h-6 text-rose-500" />,
  Sparkles: <Sparkles className="w-6 h-6 text-purple-500" />,
};

export default function Shop() {
  const [activeTab, setActiveTab] = useState<'items' | 'bundles' | 'currency'>('items');
  const { user, addCoins, addDiamonds, spendCoins, spendDiamonds } = useGlobalState();

  // --- 模擬後端資料庫資料 ---
  const [items] = useState([
    { id: 1, name: "經驗加倍卷", description: "下三場對戰獲得 2x 經驗值", price: 100, currency: 'diamonds', icon: 'Zap', tag: '熱門' },
    { id: 2, name: "體力恢復藥水", description: "立刻恢復 50 點體力", price: 500, currency: 'coins', icon: 'Sparkles', tag: null },
    { id: 3, name: "戰鬥護盾", description: "下次對戰輸了不扣積分", price: 250, currency: 'diamonds', icon: 'ShieldCheck', tag: '新上市' },
    { id: 4, name: "改名卡", description: "修改一次玩家名稱", price: 1000, currency: 'coins', icon: 'Package', tag: null },
  ]);

  const [bundles] = useState([
    {
      id: 'b1', name: "新手衝刺禮包", description: "包含所有新手必備資源", price: 299,
      originalPrice: 1200, items: ["鑽石 x500", "經驗卷 x5", "限定頭像框"],
      icon: 'Gift'
    },
    {
      id: 'b2', name: "學霸進階組", description: "適合深度學習者的組合", price: 590,
      originalPrice: 2500, items: ["鑽石 x1200", "高級題庫解鎖", "金幣 x5000"],
      icon: 'Crown'
    }
  ]);

  const [rechargePacks] = useState([
    { id: 'r1', amount: 60, price: 30, bonusText: null, isHot: false },
    { id: 'r2', amount: 310, price: 150, bonusText: "加贈 10", isHot: true },
    { id: 'r3', amount: 660, price: 300, bonusText: "首儲雙倍", isHot: false },
    { id: 'r4', amount: 1100, price: 500, bonusText: "超值推薦", isHot: true },
    { id: 'r5', amount: 2300, price: 1000, bonusText: "多送 300", isHot: false },
    { id: 'r6', amount: 7000, price: 2990, bonusText: "最划算", isHot: false },
  ]);

  // --- 狀態控制 ---
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);

  // 統一購買動作處理
  const handlePurchase = (product: any) => {
    if (activeTab === 'currency') {
      // 儲值邏輯：台幣買鑽石
      addDiamonds(product.amount);
      setToast({ type: 'success', message: `支付成功！獲得 ${product.amount} 鑽石` });
    } else if (activeTab === 'bundles') {
      // 禮包邏輯：台幣買禮包
      addDiamonds(1000); // 假設禮包內容
      setToast({ type: 'success', message: `成功購買 ${product.name}！` });
    } else {
      // 道具邏輯：虛擬幣買道具
      const success = product.currency === 'diamonds' ? spendDiamonds(product.price) : spendCoins(product.price);
      if (success) {
        setToast({ type: 'success', message: `成功購買 ${product.name}！` });
      } else {
        setToast({ type: 'error', message: "餘額不足" });
      }
    }
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24 font-sans text-zinc-900">
      {/* 頂部資產 Header */}
      <div className="bg-gradient-to-br from-rose-500 to-orange-400 p-8 pt-12 rounded-b-[3rem] shadow-xl text-white">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-2">
              <ShoppingBag className="w-8 h-8" /> 商城
            </h1>
          </div>
          <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
        </header>

        <div className="flex gap-4">
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <p className="text-[10px] font-black text-rose-100 uppercase mb-1">我的鑽石</p>
            <div className="flex items-center gap-2 text-2xl font-black">
              <Diamond className="w-5 h-5 text-cyan-300 fill-current" />
              {user.diamonds.toLocaleString()}
            </div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <p className="text-[10px] font-black text-rose-100 uppercase mb-1">我的金幣</p>
            <div className="flex items-center gap-2 text-2xl font-black">
              <Coins className="w-5 h-5 text-yellow-300 fill-current" />
              {user.coins.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-4xl mx-auto -mt-6">
        {/* Tab 導覽切換 */}
        <div className="flex p-2 bg-white rounded-2xl shadow-xl border border-zinc-100 mb-6">
          {(['items', 'bundles', 'currency'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3.5 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2",
                activeTab === tab ? "bg-rose-500 text-white shadow-lg" : "text-zinc-400 hover:bg-zinc-50"
              )}
            >
              {tab === 'items' ? '道具' : tab === 'bundles' ? '禮包' : '儲值'}
            </button>
          ))}
        </div>

        {/* 每日免費福利 (始終顯示，除非在儲值分頁) */}
        {activeTab !== 'currency' && (
          <div className="mb-8 bg-zinc-900 rounded-[2rem] p-6 shadow-xl text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-lg">每日簽到禮</h3>
                <p className="text-zinc-500 text-xs font-bold">50 枚金幣點擊即領</p>
              </div>
            </div>
            <button
              disabled={hasClaimedToday}
              onClick={() => { addCoins(50); setHasClaimedToday(true); setToast({type: 'success', message: '領取成功！'}); }}
              className={cn(
                "px-6 py-3 rounded-xl font-black text-sm transition-all",
                hasClaimedToday ? "bg-zinc-800 text-zinc-600" : "bg-white text-zinc-900 hover:bg-rose-50"
              )}
            >
              {hasClaimedToday ? '已領取' : '立即領取'}
            </button>
          </div>
        )}

        {/* --- 分頁內容渲染 --- */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* 1. 道具列表 (Grid 渲染) */}
          {activeTab === 'items' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100 flex flex-col group">
                  <div className="relative mb-6">
                    <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                      {ICON_MAP[item.icon] || <Package />}
                    </div>
                    {item.tag && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-md">{item.tag}</span>}
                  </div>
                  <h3 className="font-black text-zinc-800 mb-1">{item.name}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 mb-6 leading-relaxed flex-1">{item.description}</p>
                  <button onClick={() => setSelectedProduct(item)} className="w-full py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-1 active:scale-95 transition-all">
                    {item.price} {item.currency === 'diamonds' ? <Diamond size={12} fill="currentColor" /> : <Coins size={12} fill="currentColor" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 2. 禮包列表 (寬版渲染) */}
          {activeTab === 'bundles' && (
            <div className="space-y-4">
              {bundles.map(bundle => (
                <div key={bundle.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 flex flex-col md:flex-row items-center gap-6 group">
                  <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center shrink-0">
                    <Gift size={48} className="text-rose-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black text-zinc-800 mb-1">{bundle.name}</h3>
                    <p className="text-xs font-bold text-zinc-400 mb-4">{bundle.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {bundle.items.map(i => <span key={i} className="px-2 py-1 bg-zinc-50 text-[10px] font-black text-zinc-500 rounded-lg">{i}</span>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-300 line-through font-bold mb-1">NT$ {bundle.originalPrice}</p>
                    <button onClick={() => setSelectedProduct(bundle)} className="px-10 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-black shadow-lg shadow-rose-200 active:scale-95 transition-all">
                      NT$ {bundle.price} 購買
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. 儲值區域 (台幣買鑽石) */}
          {activeTab === 'currency' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rechargePacks.map(pack => (
                <button
                  key={pack.id}
                  onClick={() => setSelectedProduct(pack)}
                  className={cn(
                    "relative bg-white rounded-[2.5rem] p-8 shadow-sm border-2 transition-all flex flex-col items-center group active:scale-95",
                    pack.isHot ? "border-rose-400 shadow-xl shadow-rose-100" : "border-zinc-100 hover:border-zinc-200"
                  )}
                >
                  {pack.isHot && <Flame className="absolute top-4 right-4 text-rose-500 w-5 h-5 fill-current" />}
                  {pack.bonusText && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">{pack.bonusText}</span>}

                  <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <Diamond className="w-10 h-10 text-cyan-500 fill-cyan-500/10" />
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-black text-zinc-900">{pack.amount}</div>
                    <div className="text-[10px] font-black text-zinc-400 tracking-widest">DIAMONDS</div>
                  </div>

                  <div className="w-full py-3 bg-zinc-900 text-white rounded-2xl font-black text-sm shadow-lg shadow-zinc-200 group-hover:bg-rose-500 transition-colors">
                    NT$ {pack.price}
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 統一購買 Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-200">
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-6">
                   {activeTab === 'currency' ? <Diamond size={40} className="text-cyan-500" /> : <Gift size={40} className="text-rose-500" />}
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">確認訂單</h3>
                <p className="text-zinc-400 font-bold mb-10 leading-relaxed px-4">
                  {activeTab === 'currency'
                    ? `確定要支付 NT$ ${selectedProduct.price} 來獲得 ${selectedProduct.amount} 鑽石嗎？`
                    : `確定要購買「${selectedProduct.name}」嗎？`}
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                   <button onClick={() => setSelectedProduct(null)} className="py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-black hover:bg-zinc-200 transition-colors">取消</button>
                   <button onClick={() => handlePurchase(selectedProduct)} className="py-4 bg-zinc-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all">確認支付</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-4 rounded-2xl shadow-2xl z-[110] font-black flex items-center gap-3 animate-in slide-in-from-bottom-5",
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          {toast.type === 'success' ? <Check size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
