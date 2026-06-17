import { useStore } from '@/store/useStore';
import { UserPlus, Plus, Bell, RefreshCw } from 'lucide-react';
import { formatDate } from '@/utils/progressUtils';

export const Header = () => {
  const { deceased, setShowMemberModal, setShowTaskModal, resetData } = useStore();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 font-serif">
            {deceased ? `${deceased.name} 老人后事办理` : '身后事事务清单'}
          </h2>
          {deceased && (
            <p className="text-sm text-slate-500">
              {formatDate(deceased.birthDate)} — {formatDate(deceased.deathDate)}
              <span className="mx-2">·</span>
              与您的关系：{deceased.relationship}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowMemberModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">添加成员</span>
        </button>

        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">添加任务</span>
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={() => {
            if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
              resetData();
            }
          }}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="重置数据"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
