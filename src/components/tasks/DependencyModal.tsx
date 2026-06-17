import { useMemo, useState } from 'react';
import { Link2, Search, Check, Lock, CircleCheck, CircleDot } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useStore } from '@/store/useStore';
import { getStatusText, getStatusClass } from '@/utils/progressUtils';

const wouldCreateCycle = (
  taskId: string,
  candidateId: string,
  tasks: { id: string; dependsOn?: string[] }[]
): boolean => {
  if (taskId === candidateId) return true;
  const visited = new Set<string>();
  const stack = [candidateId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === taskId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const node = tasks.find((t) => t.id === current);
    if (node?.dependsOn) {
      node.dependsOn.forEach((dep) => stack.push(dep));
    }
  }
  return false;
};

export const DependencyModal = () => {
  const {
    showDependencyModal,
    dependencyTaskId,
    setShowDependencyModal,
    tasks,
    categories,
    toggleTaskDependency,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  const currentTask = useMemo(
    () => tasks.find((t) => t.id === dependencyTaskId) || null,
    [tasks, dependencyTaskId]
  );

  const candidateTasks = useMemo(() => {
    if (!currentTask) return [];
    return tasks
      .filter((t) => t.id !== currentTask.id)
      .filter(
        (t) =>
          !searchQuery ||
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [tasks, currentTask, searchQuery]);

  const blockingTasks = useMemo(() => {
    if (!currentTask) return [];
    const deps = currentTask.dependsOn || [];
    return tasks.filter(
      (t) => deps.includes(t.id) && t.status !== 'completed'
    );
  }, [tasks, currentTask]);

  if (!currentTask) return null;

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || '';

  return (
    <Modal
      isOpen={showDependencyModal}
      onClose={() => setShowDependencyModal(false)}
      title="任务依赖设置"
      size="lg"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">当前任务</span>
          </div>
          <p className="text-slate-800 font-medium">{currentTask.title}</p>
          <p className="text-xs text-slate-500 mt-1">
            选择需要先完成的任务，被选中的任务完成后本任务才可开始。
          </p>
        </div>

        {blockingTasks.length > 0 && (
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-start gap-2">
            <Lock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-700">
              当前有 <span className="font-semibold">{blockingTasks.length}</span> 个前置任务未完成，本任务处于被阻塞状态。
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
          {candidateTasks.length > 0 ? (
            candidateTasks.map((t) => {
              const isSelected = (currentTask.dependsOn || []).includes(t.id);
              const createsCycle = wouldCreateCycle(currentTask.id, t.id, tasks);
              const isCompleted = t.status === 'completed';
              const disabled = createsCycle;

              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleTaskDependency(currentTask.id, t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                    disabled
                      ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-800 truncate">
                        {t.title}
                      </span>
                      <span className={`badge ${getStatusClass(t.status)}`}>
                        {getStatusText(t.status)}
                      </span>
                      <span className="badge badge-pending">
                        {getCategoryName(t.categoryId)}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-0.5 text-xs text-green-600">
                          <CircleCheck className="w-3.5 h-3.5" />
                          已满足
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {t.description}
                      </p>
                    )}
                  </div>

                  {disabled && (
                    <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                      循环
                    </span>
                  )}
                  {!disabled && !isSelected && !isCompleted && (
                    <CircleDot className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              没有可选的任务
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setShowDependencyModal(false)}
            className="btn-primary"
          >
            完成
          </button>
        </div>
      </div>
    </Modal>
  );
};
