import { Trash2, Crown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { FamilyMember } from '@/types';
import { MemberAvatar } from './MemberAvatar';
import { getMemberProgress, getMemberTaskCount } from '@/utils/progressUtils';

interface MemberCardProps {
  member: FamilyMember;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const { tasks, removeMember, currentUser, setCurrentUser } = useStore();

  const taskCount = getMemberTaskCount(tasks, member.id);
  const progress = getMemberProgress(tasks, member.id);
  const isCurrentUser = currentUser?.id === member.id;

  const completedCount = tasks.filter(
    (t) => t.assigneeId === member.id && t.status === 'completed'
  ).length;

  return (
    <div className={`card ${isCurrentUser ? 'ring-2 ring-primary-200' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MemberAvatar member={member} size="lg" />
            {isCurrentUser && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-800">{member.name}</h4>
              {isCurrentUser && (
                <span className="badge bg-primary-100 text-primary-700">当前用户</span>
              )}
            </div>
            <p className="text-sm text-slate-500">{member.role}</p>
          </div>
        </div>

        {!isCurrentUser && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentUser(member)}
              className="text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
            >
              切换身份
            </button>
            <button
              onClick={() => {
                if (confirm(`确定要移除成员 ${member.name} 吗？`)) {
                  removeMember(member.id);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">任务进度</span>
          <span className="text-sm font-medium text-slate-800">
            {completedCount}/{taskCount} 已完成
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: member.color }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500">
          完成率: {progress}%
        </div>
      </div>
    </div>
  );
};
