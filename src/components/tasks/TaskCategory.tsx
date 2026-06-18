import { useState } from 'react';
import { ChevronDown, ChevronRight, Building2, HeartHandshake, Wallet, MoreHorizontal } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { TaskCategory } from '@/types';
import { TaskCard } from './TaskCard';
import { getCategoryProgress } from '@/utils/progressUtils';

const iconMap: Record<string, React.ElementType> = {
  Building2,
  HeartHandshake,
  Wallet,
  MoreHorizontal,
};

interface TaskCategoryProps {
  category: TaskCategory;
}

export const TaskCategorySection = ({ category }: TaskCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { activeTasks: tasks } = useStore();

  const categoryTasks = tasks.filter((t) => t.categoryId === category.id);
  const progress = getCategoryProgress(tasks, category.id);
  const Icon = iconMap[category.icon] || MoreHorizontal;

  const completedCount = categoryTasks.filter((t) => t.status === 'completed').length;

  if (categoryTasks.length === 0) return null;

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: category.color + '20' }}
          >
            <Icon className="w-5 h-5" style={{ color: category.color }} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-800">{category.name}</h3>
            <p className="text-sm text-slate-500">
              {completedCount}/{categoryTasks.length} 项已完成
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: category.color }}
            />
          </div>
          <span className="text-sm font-medium text-slate-600 min-w-[3rem] text-right">
            {progress}%
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-3 pl-4 animate-fade-in">
          {categoryTasks.map((task, index) => (
            <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
