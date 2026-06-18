import { useStore } from '@/store/useStore';
import { ProgressRing } from '@/components/common/ProgressRing';
import { TaskCard } from '@/components/tasks/TaskCard';
import { MemberAvatar } from '@/components/members/MemberAvatar';
import { MemorialTracker } from '@/components/memorial/MemorialTracker';
import {
  calculateProgress,
  getStatusCounts,
  getTodayTasks,
  getOverdueTasks,
  getUnassignedTasks,
  getBlockedTasks,
  formatDate,
  getDaysRemaining,
} from '@/utils/progressUtils';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  UserPlus,
  Building2,
  HeartHandshake,
  Wallet,
  MoreHorizontal,
  Feather,
  Calendar,
  Star,
  Bell,
  ChevronRight,
  UserPlus as UserPlusIcon,
  Lock,
} from 'lucide-react';
import type { Notification } from '@/types';

export const Dashboard = () => {
  const {
    activeTasks: tasks,
    members,
    deceased,
    categories,
    currentUser,
    notifications,
    setShowMemberModal,
    setActiveTab,
    markNotificationRead,
    setShowNotificationPanel,
  } = useStore();

  const progress = calculateProgress(tasks);
  const statusCounts = getStatusCounts(tasks);
  const todayTasks = getTodayTasks(tasks);
  const overdueTasks = getOverdueTasks(tasks);
  const unassignedTasks = getUnassignedTasks(tasks);
  const blockedTasks = getBlockedTasks(tasks);

  const userNotifications = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : [];
  const unreadNotifications = userNotifications.filter((n) => !n.read);
  const hasUnread = unreadNotifications.length > 0;

  if (!deceased) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_assigned':
        return UserPlusIcon;
      case 'deadline_approaching':
        return Clock;
      case 'task_overdue':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'task_assigned':
        return 'border-primary-300 bg-primary-50 text-primary-700';
      case 'deadline_approaching':
        return 'border-gold-300 bg-gold-50 text-gold-700';
      case 'task_overdue':
        return 'border-red-300 bg-red-50 text-red-700';
      default:
        return 'border-slate-300 bg-slate-50 text-slate-700';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    setActiveTab('tasks');
  };

  const stats = [
    {
      label: '已完成',
      value: statusCounts.completed,
      total: statusCounts.total,
      color: '#2e7d32',
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: '进行中',
      value: statusCounts.inProgress,
      total: statusCounts.total,
      color: '#ffb300',
      icon: Clock,
      bgColor: 'bg-gold-50',
      borderColor: 'border-gold-200',
    },
    {
      label: '待办',
      value: statusCounts.pending,
      total: statusCounts.total,
      color: '#37474f',
      icon: Clock,
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
    },
    {
      label: '逾期',
      value: overdueTasks.length,
      total: statusCounts.total,
      color: '#c62828',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      label: '被阻塞',
      value: blockedTasks.length,
      total: statusCounts.total,
      color: '#7e57c2',
      icon: Lock,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.categoryId === cat.id);
    const catProgress = Math.round(
      (catTasks.filter((t) => t.status === 'completed').length / (catTasks.length || 1)) * 100
    );
    const Icon = { Building2, HeartHandshake, Wallet, MoreHorizontal }[cat.icon] || MoreHorizontal;

    return {
      ...cat,
      count: catTasks.length,
      progress: catProgress,
      Icon,
    };
  });

  return (
    <div className="animate-fade-in">
      {hasUnread && (
        <div className="mb-6 card border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50 to-white shadow-md animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-primary-600 animate-bounce-slow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800 font-serif flex items-center gap-2">
                  您有 {unreadNotifications.length} 条未读提醒
                  <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                    {unreadNotifications.length}
                  </span>
                </h3>
                <button
                  onClick={() => setShowNotificationPanel(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  查看全部
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {unreadNotifications.slice(0, 3).map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type);
                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-3 rounded-lg border ${colorClass} hover:opacity-90 transition-opacity`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {notification.message}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-800 to-primary-900 text-white lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center border-4 border-white/20">
                <Feather className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-serif">
                  {deceased.name} 老人
                </h3>
                <p className="text-primary-200 text-sm">
                  {formatDate(deceased.birthDate)} — {formatDate(deceased.deathDate)}
                </p>
                <p className="text-primary-300 text-xs mt-1">
                  与您的关系：{deceased.relationship}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-200 text-sm">离开我们</p>
              <p className="text-3xl font-bold font-serif">
                {Math.abs(getDaysRemaining(deceased.deathDate))}
              </p>
              <p className="text-primary-300 text-xs">天</p>
            </div>
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center">
          <ProgressRing
            progress={progress}
            size={140}
            strokeWidth={12}
            color="#3f51b5"
            labelStyle="percentage"
          />
          <p className="text-sm text-slate-500 mt-2">整体办理进度</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`card ${stat.bgColor} ${stat.borderColor} border`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                    <span className="text-sm text-slate-400 font-normal">/{stat.total}</span>
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 font-serif flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                今日待办
              </h3>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                查看全部
              </button>
            </div>
            {todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.slice(0, 3).map((task, index) => (
                  <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                    <TaskCard task={task} showCategory />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
                <p>今日没有待办事项</p>
              </div>
            )}
          </div>

          {overdueTasks.length > 0 && (
            <div className="card border-red-200 bg-red-50/50">
              <h3 className="font-semibold text-red-700 font-serif flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" />
                已逾期 ({overdueTasks.length})
              </h3>
              <div className="space-y-3">
                {overdueTasks.slice(0, 3).map((task, index) => (
                  <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                    <TaskCard task={task} showCategory />
                  </div>
                ))}
              </div>
            </div>
          )}

          {blockedTasks.length > 0 && (
            <div className="card border-purple-200 bg-purple-50/50">
              <h3 className="font-semibold text-purple-700 font-serif flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5" />
                被阻塞 ({blockedTasks.length})
              </h3>
              <p className="text-sm text-purple-600 mb-4">
                以下任务存在未完成的前置依赖，暂无法开始。
              </p>
              <div className="space-y-3">
                {blockedTasks.slice(0, 5).map((task, index) => (
                  <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                    <TaskCard task={task} showCategory />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-slate-800 font-serif mb-4">分类进度</h3>
            <div className="space-y-4">
              {categoryStats.map((cat) => (
                <div key={cat.id} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    <cat.Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                      <span className="text-sm text-slate-500">{cat.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.progress}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <MemorialTracker limit={4} />

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 font-serif flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                家庭成员
              </h3>
              <button
                onClick={() => setShowMemberModal(true)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            {members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member) => {
                  const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
                  const memberProgress = Math.round(
                    (memberTasks.filter((t) => t.status === 'completed').length /
                      (memberTasks.length || 1)) *
                      100
                  );
                  return (
                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                      <MemberAvatar member={member} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 truncate">
                            {member.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {memberTasks.filter((t) => t.status === 'completed').length}/
                            {memberTasks.length}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${memberProgress}%`,
                              backgroundColor: member.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">暂无家庭成员</p>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  添加成员
                </button>
              </div>
            )}
          </div>

          {unassignedTasks.length > 0 && (
            <div className="card border-gold-200 bg-gold-50/50">
              <h3 className="font-semibold text-gold-700 font-serif flex items-center gap-2 mb-4">
                <Star className="w-5 h-5" />
                待认领 ({unassignedTasks.length})
              </h3>
              <div className="space-y-2">
                {unassignedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-gold-100"
                  >
                    <span className="text-sm text-slate-700 truncate flex-1">{task.title}</span>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs text-primary-600 hover:underline ml-2 flex-shrink-0"
                    >
                      认领
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
