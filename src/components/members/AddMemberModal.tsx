import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useStore } from '@/store/useStore';
import { memberColors, generateId } from '@/utils/progressUtils';

export const AddMemberModal = () => {
  const { showMemberModal, setShowMemberModal, addMember } = useStore();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedColor, setSelectedColor] = useState(memberColors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMember({
      name: name.trim(),
      role: role.trim() || '家庭成员',
      color: selectedColor,
    });

    setName('');
    setRole('');
    setShowMemberModal(false);
  };

  return (
    <Modal
      isOpen={showMemberModal}
      onClose={() => setShowMemberModal(false)}
      title="添加家庭成员"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="请输入成员姓名"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            身份
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
            placeholder="如：长子、女儿、配偶等"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            选择颜色
          </label>
          <div className="flex flex-wrap gap-2">
            {memberColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowMemberModal(false)}
            className="btn-secondary flex-1"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加
          </button>
        </div>
      </form>
    </Modal>
  );
};
