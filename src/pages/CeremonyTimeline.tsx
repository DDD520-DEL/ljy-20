import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
  CEREMONY_STEP_TYPE_CONFIG,
  CEREMONY_STEP_STATUS_CONFIG,
  type CeremonyStep,
  type CeremonyStepType,
  type CeremonyStepStatus,
} from '@/types';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
  X,
  MapPin,
  User,
  StickyNote,
  Timer,
  CalendarClock,
  LogIn,
  Heart,
  BookOpen,
  Users,
  Eye,
  Flame,
  MoreHorizontal,
  ListTodo,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  LogIn,
  Heart,
  BookOpen,
  Users,
  PersonStanding: Users,
  Eye,
  Flame,
  MoreHorizontal,
};

interface AddStepModalProps {
  deceasedId: string;
  maxOrder: number;
  onClose: () => void;
  onSave: (step: Omit<CeremonyStep, 'id' | 'createdAt'>) => void;
}

const AddStepModal = ({ deceasedId, maxOrder, onClose, onSave }: AddStepModalProps) => {
  const [type, setType] = useState<CeremonyStepType>('other');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(15);
  const [location, setLocation] = useState('');
  const [host, setHost] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      startTime,
      duration: Math.max(1, duration),
      order: maxOrder + 1,
      status: 'pending',
      location: location.trim() || undefined,
      host: host.trim() || undefined,
      note: note.trim() || undefined,
      deceasedId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">添加仪式环节</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              环节类型
            </label>
            <select
              value={type}
              onChange={(e) => {
                const newType = e.target.value as CeremonyStepType;
                setType(newType);
                if (!title.trim()) {
                  setTitle(CEREMONY_STEP_TYPE_CONFIG[newType].name);
                }
              }}
              className="input"
            >
              {Object.entries(CEREMONY_STEP_TYPE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              环节名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入环节名称"
              className="input"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                开始时间
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                持续时长（分钟）
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              环节描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="可填写环节的具体内容和要求"
              rows={2}
              className="input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                地点
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="如：告别厅"
                  className="input pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                主持人
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="主持人姓名"
                  className="input pl-9"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              备注
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="其他需要注意的事项"
              rows={2}
              className="input resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="btn-primary flex-1"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditStepModalProps {
  step: CeremonyStep;
  onClose: () => void;
  onSave: (id: string, updates: Partial<CeremonyStep>) => void;
}

const EditStepModal = ({ step, onClose, onSave }: EditStepModalProps) => {
  const [type, setType] = useState<CeremonyStepType>(step.type);
  const [title, setTitle] = useState(step.title);
  const [description, setDescription] = useState(step.description || '');
  const [startTime, setStartTime] = useState(step.startTime);
  const [duration, setDuration] = useState(step.duration);
  const [location, setLocation] = useState(step.location || '');
  const [host, setHost] = useState(step.host || '');
  const [note, setNote] = useState(step.note || '');
  const [status, setStatus] = useState<CeremonyStepStatus>(step.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(step.id, {
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      startTime,
      duration: Math.max(1, duration),
      status,
      location: location.trim() || undefined,
      host: host.trim() || undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">编辑仪式环节</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              环节类型
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CeremonyStepType)}
              className="input"
            >
              {Object.entries(CEREMONY_STEP_TYPE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              环节名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                开始时间
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                持续时长（分钟）
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              环节状态
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CeremonyStepStatus)}
              className="input"
            >
              {Object.entries(CEREMONY_STEP_STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              环节描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                地点
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                主持人
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="input pl-9"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              备注
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="btn-primary flex-1"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

const calculateTotalDuration = (steps: CeremonyStep[]): number => {
  if (steps.length === 0) return 0;
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const firstStep = sortedSteps[0];
  const lastStep = sortedSteps[sortedSteps.length - 1];
  const [startHours, startMinutes] = firstStep.startTime.split(':').map(Number);
  const [endHours, endMinutes] = lastStep.startTime.split(':').map(Number);
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes + lastStep.duration;
  return Math.max(0, endTotal - startTotal);
};

export const CeremonyTimeline = () => {
  const {
    activeCeremonySteps: steps,
    deceased,
    addCeremonyStep,
    updateCeremonyStep,
    deleteCeremonyStep,
    setCeremonyStepStatus,
    reorderCeremonySteps,
    resetCeremonySteps,
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStep, setEditingStep] = useState<CeremonyStep | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const stats = useMemo(() => {
    const total = steps.length;
    const completed = steps.filter((s) => s.status === 'completed').length;
    const inProgress = steps.filter((s) => s.status === 'in-progress').length;
    const pending = total - completed - inProgress;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalDuration = calculateTotalDuration(steps);
    return { total, completed, inProgress, pending, percentage, totalDuration };
  }, [steps]);

  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => a.order - b.order);
  }, [steps]);

  const maxOrder = useMemo(() => {
    if (steps.length === 0) return 0;
    return Math.max(...steps.map((s) => s.order));
  }, [steps]);

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newSteps = [...sortedSteps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    reorderCeremonySteps(newSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index >= sortedSteps.length - 1) return;
    const newSteps = [...sortedSteps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    reorderCeremonySteps(newSteps);
  };

  const handleToggleStatus = (step: CeremonyStep) => {
    let newStatus: CeremonyStepStatus = step.status;
    if (step.status === 'pending') newStatus = 'in-progress';
    else if (step.status === 'in-progress') newStatus = 'completed';
    else newStatus = 'pending';
    setCeremonyStepStatus(step.id, newStatus);
  };

  const handleReset = () => {
    if (!deceased) return;
    resetCeremonySteps(deceased.id);
    setShowResetConfirm(false);
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} 分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">仪式总时长</p>
              <p className="text-xl font-bold font-serif">{formatDuration(stats.totalDuration)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">环节总数</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">进行中</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">已完成</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">{stats.completed}</p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">待开始</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800 font-serif">告别仪式流程</h2>
            <span className="text-sm text-slate-500">
              共 {stats.total} 个环节
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重置流程
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加环节
            </button>
          </div>
        </div>
      </div>

      {sortedSteps.length > 0 ? (
        <div className="card">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-1">
              {sortedSteps.map((step, index) => {
                const typeConfig = CEREMONY_STEP_TYPE_CONFIG[step.type];
                const statusConfig = CEREMONY_STEP_STATUS_CONFIG[step.status];
                const Icon = ICON_MAP[typeConfig.icon] || MoreHorizontal;
                const endTime = calculateEndTime(step.startTime, step.duration);

                return (
                  <div
                    key={step.id}
                    className={`relative pl-14 pr-4 py-4 rounded-xl transition-all group ${
                      step.status === 'completed'
                        ? 'bg-green-50/30'
                        : step.status === 'in-progress'
                        ? 'bg-amber-50/50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`absolute left-4 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        step.status === 'completed'
                          ? 'bg-green-500 border-green-500'
                          : step.status === 'in-progress'
                          ? 'bg-amber-500 border-amber-500 animate-pulse'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {step.status === 'completed' && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <div className={`w-8 h-8 rounded-lg ${typeConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                          </div>
                          <h3
                            className={`font-semibold font-serif ${
                              step.status === 'completed'
                                ? 'text-slate-400 line-through'
                                : 'text-slate-800'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            {statusConfig.name}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 ml-11">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{step.startTime} - {endTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Timer className="w-4 h-4" />
                            <span>{step.duration} 分钟</span>
                          </div>
                          {step.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              <span>{step.location}</span>
                            </div>
                          )}
                          {step.host && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              <span>{step.host}</span>
                            </div>
                          )}
                        </div>

                        {step.description && (
                          <p
                            className={`text-sm mt-2 ml-11 ${
                              step.status === 'completed' ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            {step.description}
                          </p>
                        )}

                        {step.note && (
                          <div className="flex items-start gap-1.5 mt-2 ml-11">
                            <StickyNote className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                              {step.note}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="上移"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sortedSteps.length - 1}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="下移"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(step)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                          title={step.status === 'pending' ? '开始' : step.status === 'in-progress' ? '完成' : '重置状态'}
                        >
                          {step.status === 'pending' ? (
                            <Play className="w-4 h-4" />
                          ) : step.status === 'in-progress' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingStep(step)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`确定要删除"${step.title}"环节吗？`)) {
                              deleteCeremonyStep(step.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-16">
          <CalendarClock className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-500 mb-2">暂无仪式环节</p>
          <p className="text-sm text-slate-400 mb-6">
            点击上方按钮添加第一个仪式环节
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加环节
          </button>
        </div>
      )}

      {showAddModal && deceased && (
        <AddStepModal
          deceasedId={deceased.id}
          maxOrder={maxOrder}
          onClose={() => setShowAddModal(false)}
          onSave={addCeremonyStep}
        />
      )}

      {editingStep && (
        <EditStepModal
          step={editingStep}
          onClose={() => setEditingStep(null)}
          onSave={updateCeremonyStep}
        />
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <RefreshCw className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认重置流程</h3>
              <p className="text-sm text-slate-500 mb-6">
                此操作将恢复为默认的告别仪式流程，所有自定义环节将被清除。确定要继续吗？
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-danger flex-1 !bg-red-500 hover:!bg-red-600 !text-white"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
