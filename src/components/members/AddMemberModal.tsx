import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useStore } from '@/store/useStore';
import { memberColors, generateId } from '@/utils/progressUtils';
import type { MemberRole } from '@/types';
import { MEMBER_ROLE_LABELS, isAdmin } from '@/types';
import { Shield, ShieldCheck } from 'lucide-react';

export const AddMemberModal = () => {
  const { showMemberModal, setShowMemberModal, addMember, currentUser } = useStore();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedColor, setSelectedColor] = useState(memberColors[0]);
  const [permissionRole, setPermissionRole] = useState<MemberRole>('assistant');

  const isCurrentUserAdmin = isAdmin(currentUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMember({
      name: name.trim(),
      role: role.trim() || '家庭成员',
      color: selectedColor,
      permissionRole,
    });

    setName('');
    setRole('');
    setPermissionRole('assistant');
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

        {isCurrentUserAdmin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              角色权限 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPermissionRole('admin')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  permissionRole === 'admin'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 ${permissionRole === 'admin' ? 'text-primary-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">{MEMBER_ROLE_LABELS.admin}</p>
                  <p className="text-xs text-slate-500">可增删任务和成员</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPermissionRole('assistant')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  permissionRole === 'assistant'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Shield className={`w-5 h-5 ${permissionRole === 'assistant' ? 'text-primary-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">{MEMBER_ROLE_LABELS.assistant}</p>
                  <p className="text-xs text-slate-500">仅更新自己的任务</p>
                </div>
              </button>
            </div>
          </div>
        )}

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
