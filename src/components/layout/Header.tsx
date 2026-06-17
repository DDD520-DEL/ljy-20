import { useStore } from '@/store/useStore';
import { UserPlus, Plus, Bell, RefreshCw, Download, Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/progressUtils';
import { NotificationCenter } from '@/components/common/NotificationCenter';

interface HeaderProps {
  onExportPdf?: () => void;
  isExporting?: boolean;
}

export const Header = ({ onExportPdf, isExporting = false }: HeaderProps) => {
  const {
    deceased,
    currentUser,
    notifications,
    showNotificationPanel,
    setShowMemberModal,
    setShowTaskModal,
    setShowNotificationPanel,
    resetData,
  } = useStore();

  const unreadCount = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length
    : 0;

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
        {deceased && onExportPdf && (
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="导出PDF报告"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isExporting ? '导出中...' : '导出报告'}</span>
          </button>
        )}

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

        <div className="relative">
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className={`p-2 rounded-lg transition-colors relative ${
              showNotificationPanel
                ? 'bg-primary-100 text-primary-600'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs font-medium text-white bg-red-500 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter
            isOpen={showNotificationPanel}
            onClose={() => setShowNotificationPanel(false)}
          />
        </div>

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
