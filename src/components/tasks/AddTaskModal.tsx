import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useStore } from '@/store/useStore';
import { categories } from '@/data/categories';

export const AddTaskModal = () => {
  const { showTaskModal, setShowTaskModal, addTask, deceased } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deceased) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      categoryId,
      deceasedId: deceased.id,
      status: 'pending',
      priority,
      dueDate: dueDate || undefined,
      notes: [],
    });

    setTitle('');
    setDescription('');
    setCategoryId(categories[0].id);
    setPriority(2);
    setDueDate('');
    setShowTaskModal(false);
  };

  if (!deceased) return null;

  return (
    <Modal
      isOpen={showTaskModal}
      onClose={() => setShowTaskModal(false)}
      title="添加新任务"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            任务名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[80px] resize-none"
            placeholder="请输入任务详细说明和注意事项"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              任务分类
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
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
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
              className="input-field"
            >
              <option value={1}>紧急</option>
              <option value={2}>重要</option>
              <option value={3}>一般</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            截止日期
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowTaskModal(false)}
            className="btn-secondary flex-1"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加
          </button>
        </div>
      </form>
    </Modal>
  );
};
