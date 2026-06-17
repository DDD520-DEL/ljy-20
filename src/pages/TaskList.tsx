import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { TaskCategorySection } from '@/components/tasks/TaskCategory';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Filter, Search, SortAsc, SortDesc, List, Grid3X3 } from 'lucide-react';
import type { TaskStatus } from '@/types';

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
];

const priorityFilters = [
  { value: 0, label: '全部优先级' },
  { value: 1, label: '紧急' },
  { value: 2, label: '重要' },
  { value: 3, label: '一般' },
];

export const TaskList = () => {
  const { categories, tasks } = useStore();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'category'>('category');

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 0 && task.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && task.categoryId !== categoryFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.priority - b.priority;
    }
    return b.priority - a.priority;
  });

  return (
    <div className="animate-fade-in">
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="input-field w-auto min-w-[120px]"
            >
              {statusFilters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(Number(e.target.value))}
              className="input-field w-auto min-w-[120px]"
            >
              {priorityFilters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-auto min-w-[120px]"
            >
              <option value="all">全部分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary flex items-center gap-2"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              排序
            </button>

            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('category')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'category' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusFilters.map((f) => {
              const count =
                f.value === 'all'
                  ? filteredTasks.length
                  : filteredTasks.filter((t) => t.status === f.value).length;
              return (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    statusFilter === f.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {viewMode === 'category' ? (
        <div className="space-y-6">
          {categories.map((category, index) => (
            <div key={category.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
              <TaskCategorySection category={category} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task, index) => (
              <div key={task.id} style={{ animationDelay: `${index * 30}ms` }} className="animate-slide-up">
                <TaskCard task={task} showCategory />
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500">没有找到符合条件的任务</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
