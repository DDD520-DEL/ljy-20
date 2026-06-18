import { useStore } from '@/store/useStore';
import { LayoutDashboard, ListTodo, Users, BookOpen, Plus, Settings, Shield, ShieldCheck, Package } from 'lucide-react';
import { MEMBER_ROLE_LABELS } from '@/types';

const navItems = [
  { id: 'dashboard', label: '总览', icon: LayoutDashboard },
  { id: 'tasks', label: '事务清单', icon: ListTodo },
  { id: 'items', label: '物品清单', icon: Package },
  { id: 'collaboration', label: '协作中心', icon: Users },
  { id: 'reference', label: '信息参考', icon: BookOpen },
];

export const Sidebar = () => {
  const { activeTab, setActiveTab, currentUser } = useStore();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-serif">悼</span>
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold text-slate-800">身后事助手</h1>
            <p className="text-xs text-slate-500">温暖陪伴 · 有序前行</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-link w-full ${activeTab === item.id ? 'sidebar-link-active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {currentUser && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: currentUser.color }}
            >
              {currentUser.name.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
                <span className="text-slate-300">·</span>
                <span className={`inline-flex items-center gap-0.5 text-xs ${
                  currentUser.permissionRole === 'admin' ? 'text-gold-600' : 'text-slate-400'
                }`}>
                  {currentUser.permissionRole === 'admin' ? (
                    <ShieldCheck className="w-3 h-3" />
                  ) : (
                    <Shield className="w-3 h-3" />
                  )}
                  {MEMBER_ROLE_LABELS[currentUser.permissionRole]}
                </span>
              </div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
              <Settings className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
