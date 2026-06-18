import { useState } from 'react';
import { Check, Clock, AlertTriangle, UserPlus, MoreVertical, Trash2, MessageCircle, Link2, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Task } from '@/types';
import { MemberAvatar } from '@/components/members/MemberAvatar';
import { TaskNotes } from './TaskNotes';
import {
  getStatusText,
  getStatusClass,
  getPriorityText,
  getPriorityColor,
  formatDateShort,
  getDaysRemaining,
  isTaskBlocked,
  getBlockingTasks,
} from '@/utils/progressUtils';

interface TaskCardProps {
  task: Task;
  showCategory?: boolean;
}

export const TaskCard = ({ task, showCategory = false }: TaskCardProps) => {
  const [ripple, setRipple] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const {
    members,
    categories,
    activeTasks: tasks,
    toggleTaskStatus,
    setShowAssignModal,
    deleteTask,
    setTaskStatus,
    setShowDependencyModal,
    currentUser,
  } = useStore();

  const assignee = members.find((m) => m.id === task.assigneeId);
  const category = categories.find((c) => c.id === task.categoryId);

  const daysRemaining = task.dueDate ? getDaysRemaining(task.dueDate) : null;
  const isOverdue = daysRemaining !== null && daysRemaining < 0;
  const notesCount = task.notes?.length || 0;

  const blockingTasks = getBlockingTasks(task, tasks);
  const isBlocked = isTaskBlocked(task, tasks);
  const dependsOnCount = task.dependsOn?.length || 0;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRipple(true);
    setTimeout(() => setRipple(false), 300);
    setTimeout(() => toggleTaskStatus(task.id), 150);
  };

  const handleAssign = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAssignModal(true, task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个任务吗？')) {
      deleteTask(task.id);
    }
    setShowMenu(false);
  };

  const handleDependency = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDependencyModal(true, task.id);
    setShowMenu(false);
  };

  const cardClasses = `card ${
    task.status === 'completed'
      ? 'card-completed'
      : task.status === 'in-progress'
      ? 'card-in-progress animate-pulse-slow'
      : ''
  } ${isBlocked ? 'card-blocked' : ''}`;

  return (
    <div className={cardClasses}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          <button
            onClick={handleCheckboxClick}
            className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ripple-effect ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500 text-white'
                : task.status === 'in-progress'
                ? 'bg-gold-100 border-gold-400 text-gold-600'
                : 'border-slate-300 hover:border-primary-500'
            }`}
          >
            {ripple && <span className="absolute inset-0 rounded-full animate-ripple bg-white/60"></span>}
            {task.status === 'completed' && <Check className="w-4 h-4" />}
            {task.status === 'in-progress' && <Clock className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4
                  className={`font-medium ${
                    task.status === 'completed'
                      ? 'text-slate-400 line-through'
                      : 'text-slate-800'
                  }`}
                >
                  {task.title}
                </h4>
                <span
                  className="badge"
                  style={{
                    backgroundColor: getPriorityColor(task.priority) + '20',
                    color: getPriorityColor(task.priority),
                  }}
                >
                  {getPriorityText(task.priority)}
                </span>
                <span className={`badge ${getStatusClass(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                {isBlocked && (
                  <span className="badge bg-purple-100 text-purple-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    被阻塞
                  </span>
                )}
                {showCategory && category && (
                  <span
                    className="badge"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    {category.name}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {task.description}
              </p>

              {(blockingTasks.length > 0 || dependsOnCount > 0) && (
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <button
                    onClick={handleDependency}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {blockingTasks.length > 0 ? (
                      <span>
                        等待 {blockingTasks.length} 个前置任务完成：
                        {blockingTasks.map((bt) => bt.title).join('、')}
                      </span>
                    ) : (
                      <span>已设置 {dependsOnCount} 个前置依赖（均已满足）</span>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {task.dueDate && (
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      isOverdue ? 'text-red-600' : 'text-slate-500'
                    }`}
                  >
                    {isOverdue ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {formatDateShort(task.dueDate)}
                      {daysRemaining !== null && (
                        <span className="ml-1">
                          ({isOverdue ? `已逾期 ${Math.abs(daysRemaining)} 天` : `剩余 ${daysRemaining} 天`})
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {assignee ? (
                  <div className="flex items-center gap-2">
                    <MemberAvatar member={assignee} size="sm" />
                    <span className="text-xs text-slate-500">{assignee.name}</span>
                    {currentUser?.id !== assignee.id && (
                      <button
                        onClick={handleAssign}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        转让
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleAssign}
                    className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>认领任务</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotes(!showNotes);
                  }}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    showNotes
                      ? 'text-primary-600'
                      : notesCount > 0
                      ? 'text-primary-600'
                      : 'text-slate-400 hover:text-primary-600'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>备注{notesCount > 0 ? ` (${notesCount})` : ''}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setTaskStatus(task.id, 'pending');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    标记为待办
                  </button>
                  <button
                    onClick={() => {
                      setTaskStatus(task.id, 'in-progress');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    标记为进行中
                  </button>
                  <button
                    onClick={() => {
                      setTaskStatus(task.id, 'completed');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    标记为已完成
                  </button>
                  <div className="border-t border-slate-200 my-1"></div>
                  <button
                    onClick={handleDependency}
                    className="w-full px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50"
                  >
                    <span className="flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      依赖设置{dependsOnCount > 0 ? ` (${dependsOnCount})` : ''}
                    </span>
                  </button>
                  <div className="border-t border-slate-200 my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <span className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      删除任务
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNotes && <TaskNotes task={task} />}
    </div>
  );
};
