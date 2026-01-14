import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCourses } from '@/lib/mockData';
import { ArrowLeft, PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { useGlobalState } from '@/state/GlobalState';

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === id);
  const { setCourseProgress } = useGlobalState();

  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold text-lg">找不到課程</h1>
          <button className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white" onClick={() => navigate('/academy')}>返回學院</button>
        </div>
      </div>
    );
  }

  const modules: Array<{ id: string; title: string; duration: number }> = (course as any).modules || [];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-4 pt-6 rounded-b-[2rem] text-white shadow-xl sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/academy')} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black">{course.title}</h1>
          <div />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm">
          <div className="h-48 bg-zinc-200 rounded-xl flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-zinc-600">講師：{course.provider}</div>
            <button onClick={() => setCourseProgress(course.id, { percent: 100, lastModuleId: (modules[modules.length - 1]?.id) })} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold">標記完成</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm">
          <h2 className="font-bold text-zinc-900 mb-3">課程章節</h2>
          <div className="space-y-2">
            {modules.length === 0 && (
              <div className="text-sm text-zinc-500">尚未提供章節資訊</div>
            )}
            {modules.map((m, idx) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 cursor-pointer" onClick={() => {
                const percent = Math.floor(((idx + 1) / Math.max(modules.length, 1)) * 100);
                setCourseProgress(course.id, { percent, lastModuleId: m.id });
              }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div className="font-bold text-sm text-zinc-800">{m.title}</div>
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {m.duration} 分鐘
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
