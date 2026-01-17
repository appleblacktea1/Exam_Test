import React, { createContext, useContext, useState, useEffect } from 'react';

// 定義單次考試紀錄的結構
export interface HistoryRecord {
  id: string;          // 紀錄ID (timestamp)
  examId: string;      // 考卷ID
  examName: string;    // 考卷名稱
  timestamp: number;   // 完成時間
  score: number;       // 分數 (0-100)
  correctCount: number;
  totalCount: number;
  questions: any[];    // 題目快照 (因為隨機模式題目會變，所以要存當下的題目)
  userAnswers: Record<number, string[]>; // 使用者的答案 { 0: ['A'], 1: ['B', 'C'] }
}

interface HistoryContextType {
  records: HistoryRecord[];
  addRecord: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
  clearRecords: () => void;
  getRecord: (id: string) => HistoryRecord | undefined;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  // 載入 localStorage
  useEffect(() => {
    const saved = localStorage.getItem('exam_history');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // 儲存變更
  useEffect(() => {
    localStorage.setItem('exam_history', JSON.stringify(records));
  }, [records]);

  const addRecord = (data: Omit<HistoryRecord, 'id' | 'timestamp'>) => {
    const newRecord: HistoryRecord = {
      ...data,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setRecords(prev => {
      // 1. 過濾掉「相同考卷ID」且「相同考試名稱(代表同模式)」的舊紀錄
      // 這樣就能保證同一個考試只會有一筆最新的資料
      const filtered = prev.filter(r =>
        !(r.examId === data.examId && r.examName === data.examName)
      );

      // 2. 將新紀錄加到最前面
      return [newRecord, ...filtered];
    });
  };

  const clearRecords = () => setRecords([]);

  const getRecord = (id: string) => records.find(r => r.id === id);

  return (
    <HistoryContext.Provider value={{ records, addRecord, clearRecords, getRecord }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within a HistoryProvider');
  return context;
};
