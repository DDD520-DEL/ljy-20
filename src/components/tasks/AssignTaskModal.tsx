import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useStore } from '@/store/useStore';
import { MemberAvatar } from '@/components/members/MemberAvatar';
import { UserPlus, X } from 'lucide-react';

export const AssignTaskModal = () => {
  const {
    showAssignModal,
    setShowAssignModal,
    selectedTaskId,
    tasks,
    members,
    assignTask,
    unassignTask,
    currentUser,
  } = useStore();

  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const task = tasks.find((t) => t.id === selectedTaskId);
  const currentAssignee = task?.assigneeId
    ? members.find((m) => m.id === task.assigneeId)
    : null;

  const handleAssign = () => {
    if (!selectedMember || !selectedTaskId) return;
    assignTask(selectedTaskId, selectedMember);
    setShowAssignModal(false);
    setSelectedMember(null);
  };

  const handleAssignToSelf = () => {
    if (!currentUser || !selectedTaskId) return;
    assignTask(selectedTaskId, currentUser.id);
    setShowAssignModal(false);
  };

  const handleUnassign = () => {
    if (selectedTaskId) {
      unassignTask(selectedTaskId);
      setShowAssignModal(false);
    }
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={showAssignModal}
      onClose={() => {
        setShowAssignModal(false);
        setSelectedMember(null);
      }}
      title="分配任务"
      size="md"
    >
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl">
          <h4 className="font-medium text-slate-800">{task.title}</h4>
          <p className="text-sm text-slate-500 mt-1">{task.description}</p>
        </div>

        {currentAssignee && (
          <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">当前负责人：</span>
              <MemberAvatar member={currentAssignee} size="sm" showName />
            </div>
            <button
              onClick={handleUnassign}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {currentUser && !currentAssignee && (
          <button
            onClick={handleAssignToSelf}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary-300 rounded-xl hover:bg-primary-50 hover:border-primary-400 transition-colors"
          >
            <UserPlus className="w-5 h-5 text-primary-600" />
            <span className="text-primary-700 font-medium">我来负责</span>
          </button>
        )}

        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-3">选择成员</h5>
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  selectedMember === member.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-transparent hover:bg-slate-50'
                } ${currentAssignee?.id === member.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentAssignee?.id === member.id}
              >
                <MemberAvatar member={member} size="sm" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              setShowAssignModal(false);
              setSelectedMember(null);
            }}
            className="btn-secondary flex-1"
          >
            取消
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedMember}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            确认分配
          </button>
        </div>
      </div>
    </Modal>
  );
};
