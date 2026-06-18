import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { UserPlus, Plus, Bell, RefreshCw, Download, Loader2, ChevronDown, UserRound, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/progressUtils';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { isAdmin } from '@/types';

interface HeaderProps {
  onExportPdf?: () => void;
  isExporting?: boolean;
}

export const Header = ({ onExportPdf, isExporting = false }: HeaderProps) => {
  const {
    deceased,
    deceaseds,
    currentUser,
    notifications,
    showNotificationPanel,
    setShowMemberModal,
    setShowTaskModal,
    setShowNotificationPanel,
    setShowSetup,
    switchDeceased,
    deleteDeceased,
    resetData,
  } = useStore();

  const [showSwitcher, setShowSwitcher] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const unreadCount = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length
    : 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddDeceased = () => {
    setShowSwitcher(false);
    setShowSetup(true);
  };

  const handleSwitchDeceased = (id: string) => {
    switchDeceased(id);
    setShowSwitcher(false);
  };

  const handleDeleteDeceased = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这位逝者的所有数据吗？此操作不可撤销。')) {
      deleteDeceased(id);
      setShowSwitcher(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative" ref={switcherRef}>
          <button
            onClick={() => setShowSwitcher(!showSwitcher)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-slate-50 border border-primary-100 hover:from-primary-100 hover:to-slate-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
              <UserRound className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-semibold text-slate-800 font-serif leading-tight">
                {deceased ? `${deceased.name} 老人后事办理` : '身后事事务清单'}
              </h2>
              {deceased && (
                <p className="text-xs text-slate-500 leading-tight mt-0.5">
                  {formatDate(deceased.birthDate)} — {formatDate(deceased.deathDate)}
                  <span className="mx-1.5">·</span>
                  {deceased.relationship}
                </p>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${showSwitcher ? 'rotate-180' : ''}`}
            />
          </button>

          {showSwitcher && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <p className="text-sm font-medium text-slate-600">切换逝者事务空间</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {deceaseds.length > 0 ? (
                  deceaseds.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleSwitchDeceased(d.id)}
                      className={`w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 group ${
                        deceased?.id === d.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          deceased?.id === d.id
                            ? 'bg-gradient-to-br from-primary-600 to-primary-800'
                            : 'bg-slate-200'
                        }`}
                      >
                        <UserRound
                          className={`w-5 h-5 ${deceased?.id === d.id ? 'text-white' : 'text-slate-500'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            deceased?.id === d.id ? 'text-primary-700' : 'text-slate-700'
                          }`}
                        >
                          {d.name} 老人
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {formatDate(d.birthDate)} — {formatDate(d.deathDate)} · {d.relationship}
                        </p>
                      </div>
                      {deceaseds.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteDeceased(d.id, e)}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex-shrink-0"
                          title="删除该逝者"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    暂无逝者信息
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-100">
                <button
                  onClick={handleAddDeceased}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加新逝者
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {deceased && onExportPdf && (
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {isAdmin(currentUser) && (
          <button
            onClick={() => setShowMemberModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">添加成员</span>
          </button>
        )}

        {deceased && isAdmin(currentUser) && (
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">添加任务</span>
          </button>
        )}

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
