import { useState, useRef } from 'react';
import { Plus, Trash2, GripVertical, X, AlertCircle, Clock } from 'lucide-react';
import { categories } from '@/data/categories';
import type { TemplateTaskItem } from '@/types';
import { getPriorityText, getPriorityColor } from '@/utils/progressUtils';

interface TaskTemplateEditorProps {
  tasks: TemplateTaskItem[];
  onChange: (tasks: TemplateTaskItem[]) => void;
}

interface EditingTask {
  id: string;
  field: 'title' | 'description' | 'categoryId' | 'priority' | 'dueDays';
}

export const TaskTemplateEditor = ({ tasks, onChange }: TaskTemplateEditorProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingTask | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    categoryId: categories[0].id,
    priority: 2 as 1 | 2 | 3,
    dueDays: '',
  });
  const dragDataRef = useRef<{ fromCategory: string; toCategory: string } | null>(null);

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const getTasksByCategory = (categoryId: string) => {
    return sortedTasks.filter((t) => t.categoryId === categoryId);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (taskId !== dragOverId) {
      setDragOverId(taskId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedTask = tasks.find((t) => t.id === draggedId);
    const targetTask = tasks.find((t) => t.id === targetId);

    if (!draggedTask || !targetTask) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex((t) => t.id === draggedId);
    const targetIndex = newTasks.findIndex((t) => t.id === targetId);

    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    const reordered = newTasks.map((t, idx) => ({ ...t, order: idx }));
    onChange(reordered);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    dragDataRef.current = null;
  };

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('确定要删除这个任务模板吗？')) return;
    const remaining = tasks
      .filter((t) => t.id !== taskId)
      .map((t, idx) => ({ ...t, order: idx }));
    onChange(remaining);
  };

  const handleEditStart = (taskId: string, field: EditingTask['field']) => {
    setEditing({ id: taskId, field });
  };

  const handleEditChange = (taskId: string, field: EditingTask['field'], value: string) => {
    onChange(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        if (field === 'priority') {
          return { ...t, priority: Number(value) as 1 | 2 | 3 };
        }
        if (field === 'dueDays') {
          return { ...t, dueDays: value ? Number(value) : undefined };
        }
        return { ...t, [field]: value };
      })
    );
  };

  const handleEditEnd = () => {
    setEditing(null);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const maxOrder = tasks.reduce((max, t) => Math.max(max, t.order), -1);
    const taskToAdd: TemplateTaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      categoryId: newTask.categoryId,
      priority: newTask.priority,
      dueDays: newTask.dueDays ? Number(newTask.dueDays) : undefined,
      order: maxOrder + 1,
    };

    onChange([...tasks, taskToAdd]);
    setNewTask({
      title: '',
      description: '',
      categoryId: categories[0].id,
      priority: 2,
      dueDays: '',
    });
    setShowAddForm(false);
  };

  const renderTaskField = (task: TemplateTaskItem, field: EditingTask['field'], displayValue: string) => {
    const isEditing = editing?.id === task.id && editing?.field === field;

    if (!isEditing) {
      return (
        <span
          className="cursor-pointer hover:text-primary-600 transition-colors"
          onClick={() => handleEditStart(task.id, field)}
        >
          {displayValue}
        </span>
      );
    }

    if (field === 'description') {
      return (
        <textarea
          autoFocus
          defaultValue={displayValue}
          onBlur={(e) => {
            handleEditChange(task.id, field, e.target.value);
            handleEditEnd();
          }}
          className="input-field text-sm min-h-[60px] mt-1"
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleEditEnd();
          }}
        />
      );
    }

    if (field === 'categoryId') {
      return (
        <select
          autoFocus
          defaultValue={task.categoryId}
          onBlur={(e) => {
            handleEditChange(task.id, field, e.target.value);
            handleEditEnd();
          }}
          className="input-field text-sm py-1"
          onChange={(e) => {
            handleEditChange(task.id, field, e.target.value);
            handleEditEnd();
          }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      );
    }

    if (field === 'priority') {
      return (
        <select
          autoFocus
          defaultValue={task.priority}
          onBlur={(e) => {
            handleEditChange(task.id, field, e.target.value);
            handleEditEnd();
          }}
          className="input-field text-sm py-1"
          onChange={(e) => {
            handleEditChange(task.id, field, e.target.value);
            handleEditEnd();
          }}
        >
          <option value={1}>紧急</option>
          <option value={2}>重要</option>
          <option value={3}>一般</option>
        </select>
      );
    }

    if (field === 'dueDays') {
      return (
        <input
          type="number"
          autoFocus
          defaultValue={task.dueDays ?? ''}
          placeholder="天数"
          min={0}
          onBlur={(e) => {
            handleEditChange(task.id, field, e.target.value);
            handleEditEnd();
          }}
          className="input-field text-sm py-1 w-24"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') handleEditEnd();
          }}
        />
      );
    }

    return (
      <input
        type="text"
        autoFocus
        defaultValue={displayValue}
        onBlur={(e) => {
          handleEditChange(task.id, field, e.target.value);
          handleEditEnd();
        }}
        className="input-field text-sm py-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') handleEditEnd();
        }}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-500">
            拖拽任务可调整顺序，点击文字可编辑内容
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-secondary flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          添加任务
        </button>
      </div>

      {showAddForm && (
        <div className="card border-primary-200 bg-primary-50/50 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-slate-800">添加新任务</h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                任务名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input-field"
                placeholder="请输入任务名称"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                任务描述
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input-field min-h-[60px] resize-none"
                placeholder="请输入任务详细说明"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  分类
                </label>
                <select
                  value={newTask.categoryId}
                  onChange={(e) => setNewTask({ ...newTask, categoryId: e.target.value })}
                  className="input-field"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  优先级
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) as 1 | 2 | 3 })}
                  className="input-field"
                >
                  <option value={1}>紧急</option>
                  <option value={2}>重要</option>
                  <option value={3}>一般</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  截止天数
                </label>
                <input
                  type="number"
                  min={0}
                  value={newTask.dueDays}
                  onChange={(e) => setNewTask({ ...newTask, dueDays: e.target.value })}
                  className="input-field"
                  placeholder="逝世后N天"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleAddTask}
                disabled={!newTask.title.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {categories.map((category) => {
          const categoryTasks = getTasksByCategory(category.id);
          if (categoryTasks.length === 0) return null;

          return (
            <div key={category.id}>
              <div
                className="flex items-center gap-2 mb-2 px-2"
                style={{ color: category.color }}
              >
                <div
                  className="w-1 h-5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h4 className="font-medium text-sm">{category.name}</h4>
                <span className="text-xs text-slate-400">
                  ({categoryTasks.length} 项)
                </span>
              </div>

              <div className="space-y-2">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={(e) => handleDragOver(e, task.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className={`card transition-all duration-200 ${
                      draggedId === task.id
                        ? 'opacity-50 scale-[0.98]'
                        : dragOverId === task.id
                        ? 'ring-2 ring-primary-400 ring-offset-2'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-0.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {renderTaskField(task, 'title', task.title)}
                          <span
                            className="badge"
                            style={{
                              backgroundColor: getPriorityColor(task.priority) + '20',
                              color: getPriorityColor(task.priority),
                            }}
                          >
                            {renderTaskField(task, 'priority', getPriorityText(task.priority))}
                          </span>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: category.color + '20',
                              color: category.color,
                            }}
                          >
                            {renderTaskField(task, 'categoryId', category.name)}
                          </span>
                          {task.dueDays !== undefined && (
                            <span className="badge bg-slate-100 text-slate-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {renderTaskField(task, 'dueDays', `逝世后 ${task.dueDays} 天`)}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-slate-500 mt-1">
                          {task.description
                            ? renderTaskField(task, 'description', task.description)
                            : (
                              <span
                                className="text-slate-400 italic cursor-pointer hover:text-slate-500"
                                onClick={() => handleEditStart(task.id, 'description')}
                              >
                                点击添加描述...
                              </span>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="删除任务"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {sortedTasks.length === 0 && (
          <div className="card text-center py-10">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">暂无任务，点击上方按钮添加</p>
          </div>
        )}
      </div>
    </div>
  );
};
