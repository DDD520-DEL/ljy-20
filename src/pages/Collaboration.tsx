import { useStore } from '@/store/useStore';
import { MemberCard } from '@/components/members/MemberCard';
import { MemberAvatar } from '@/components/members/MemberAvatar';
import { TaskCard } from '@/components/tasks/TaskCard';
import { getUnassignedTasks, getMemberTaskCount, getMemberProgress } from '@/utils/progressUtils';
import { Users, UserPlus, PieChart, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { isAdmin } from '@/types';

export const Collaboration = () => {
  const { members, activeTasks: tasks, setShowMemberModal, setShowAssignModal, currentUser } = useStore();

  const isCurrentUserAdmin = isAdmin(currentUser);
  const unassignedTasks = getUnassignedTasks(tasks);

  const memberStats = members.map((member) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
    const completed = memberTasks.filter((t) => t.status === 'completed').length;
    const inProgress = memberTasks.filter((t) => t.status === 'in-progress').length;
    const pending = memberTasks.filter((t) => t.status === 'pending').length;
    const progress = getMemberProgress(tasks, member.id);

    return {
      member,
      total: memberTasks.length,
      completed,
      inProgress,
      pending,
      progress,
    };
  });

  const maxTasks = Math.max(...memberStats.map((m) => m.total), 1);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">家庭成员</p>
              <p className="text-2xl font-bold font-serif">{members.length} 人</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">已分配任务</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {tasks.length - unassignedTasks.length}/{tasks.length}
              </p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${tasks.length ? ((tasks.length - unassignedTasks.length) / tasks.length) * 100 : 0}%`,
                backgroundColor: '#ffb300',
              }}
            />
          </div>
        </div>

        {isCurrentUserAdmin ? (
          <div className="card">
            <button
              onClick={() => setShowMemberModal(true)}
              className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <UserPlus className="w-8 h-8 text-slate-400" />
              <span className="text-slate-600 font-medium">添加家庭成员</span>
            </button>
          </div>
        ) : (
          <div className="card flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">仅管理员可添加成员</p>
            </div>
          </div>
        )}
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-slate-800 font-serif mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          任务分配概览
        </h3>
        <div className="space-y-4">
          {memberStats.length > 0 ? (
            memberStats.map((stat, index) => (
              <div
                key={stat.member.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up"
              >
                <div className="flex items-center gap-4">
                  <MemberAvatar member={stat.member} size="md" showName />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {stat.completed}
                        </span>
                        <span className="flex items-center gap-1 text-gold-600">
                          <Clock className="w-3.5 h-3.5" />
                          {stat.inProgress}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {stat.pending}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {stat.progress}%
                      </span>
                    </div>
                    <div className="flex gap-1 h-3">
                      <div
                        className="bg-green-500 rounded-l-full transition-all duration-500"
                        style={{ width: `${stat.total ? (stat.completed / maxTasks) * 100 : 0}%` }}
                      />
                      <div
                        className="bg-gold-400 transition-all duration-500"
                        style={{ width: `${stat.total ? (stat.inProgress / maxTasks) * 100 : 0}%` }}
                      />
                      <div
                        className="bg-slate-300 rounded-r-full transition-all duration-500"
                        style={{ width: `${stat.total ? (stat.pending / maxTasks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>暂无家庭成员</p>
              {isCurrentUserAdmin && (
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="mt-2 text-primary-600 hover:text-primary-700"
                >
                  添加成员
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-800 font-serif mb-4">家庭成员详情</h3>
          <div className="grid grid-cols-1 gap-4">
            {members.map((member, index) => (
              <div key={member.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 font-serif mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gold-500" />
            待认领任务 ({unassignedTasks.length})
          </h3>
          {unassignedTasks.length > 0 ? (
            <div className="space-y-3">
              {unassignedTasks.map((task, index) => (
                <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                  <div className="card border-gold-200 bg-gold-50/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{task.title}</h4>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAssignModal(true, task.id)}
                        className="btn-primary text-sm py-1.5 px-3 flex-shrink-0"
                      >
                        认领
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
              <p className="text-slate-500">所有任务已分配</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
