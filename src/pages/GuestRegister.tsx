import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import type { Guest } from '@/types';
import {
  UserPlus,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  Check,
  Users,
  Clock,
  Phone,
  User,
  Heart,
  FileText,
} from 'lucide-react';

interface AddGuestModalProps {
  deceasedId: string;
  onClose: () => void;
  onSave: (guest: Omit<Guest, 'id' | 'createdAt'>) => void;
}

const AddGuestModal = ({ deceasedId, onClose, onSave }: AddGuestModalProps) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim() || !phone.trim()) return;
    onSave({
      name: name.trim(),
      relationship: relationship.trim(),
      phone: phone.trim(),
      deceasedId,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">登记宾客</h3>
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
              姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入宾客姓名"
                className="input pl-10"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              与逝者关系 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="如：儿子、女儿、朋友、同事等"
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              联系电话 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入联系电话"
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="其他需要记录的信息，如礼金、特殊需求等"
                rows={3}
                className="input pl-10 resize-none"
              />
            </div>
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
              disabled={!name.trim() || !relationship.trim() || !phone.trim()}
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

interface EditGuestModalProps {
  guest: Guest;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Guest>) => void;
}

const EditGuestModal = ({ guest, onClose, onSave }: EditGuestModalProps) => {
  const [name, setName] = useState(guest.name);
  const [relationship, setRelationship] = useState(guest.relationship);
  const [phone, setPhone] = useState(guest.phone);
  const [note, setNote] = useState(guest.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim() || !phone.trim()) return;
    onSave(guest.id, {
      name: name.trim(),
      relationship: relationship.trim(),
      phone: phone.trim(),
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">编辑宾客</h3>
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
              姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input pl-10"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              与逝者关系 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              联系电话 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="input pl-10 resize-none"
              />
            </div>
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
              disabled={!name.trim() || !relationship.trim() || !phone.trim()}
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

export const GuestRegister = () => {
  const {
    activeGuests: guests,
    deceased,
    addGuest,
    updateGuest,
    deleteGuest,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRelationship, setFilterRelationship] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const relationships = useMemo(() => {
    const unique = new Set(guests.map((g) => g.relationship));
    return Array.from(unique).sort();
  }, [guests]);

  const stats = useMemo(() => {
    const total = guests.length;
    const today = new Date().toDateString();
    const todayRegistered = guests.filter(
      (g) => new Date(g.createdAt).toDateString() === today
    ).length;

    return { total, todayRegistered, relationships };
  }, [guests, relationships]);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = guest.name.toLowerCase().includes(query);
        const matchRelationship = guest.relationship.toLowerCase().includes(query);
        const matchPhone = guest.phone.includes(query);
        const matchNote = guest.note?.toLowerCase().includes(query);
        if (!matchName && !matchRelationship && !matchPhone && !matchNote) {
          return false;
        }
      }
      if (filterRelationship !== 'all' && guest.relationship !== filterRelationship) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [guests, searchQuery, filterRelationship]);

  const handleDelete = (id: string) => {
    deleteGuest(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">宾客总数</p>
              <p className="text-2xl font-bold font-serif">{stats.total} 人</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">今日登记</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.todayRegistered} 人
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">关系类型</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.relationships.length} 种
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索姓名、关系、电话..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterRelationship}
              onChange={(e) => setFilterRelationship(e.target.value)}
              className="input w-auto"
            >
              <option value="all">全部关系</option>
              {stats.relationships.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              登记宾客
            </button>
          </div>
        </div>
      </div>

      {filteredGuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuests.map((guest, index) => (
            <div
              key={guest.id}
              style={{ animationDelay: `${index * 30}ms` }}
              className="card group animate-slide-up"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg">
                    {guest.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 font-serif text-lg">
                      {guest.name}
                    </h3>
                    <p className="text-sm text-primary-600 font-medium">
                      {guest.relationship}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingGuest(guest)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(guest.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a
                    href={`tel:${guest.phone}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {guest.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    登记于 {new Date(guest.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {guest.note && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">备注：</span>
                    {guest.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <UserPlus className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-500 mb-2">暂无宾客记录</p>
          <p className="text-sm text-slate-400 mb-6">
            {searchQuery || filterRelationship !== 'all'
              ? '请尝试调整搜索条件或筛选器'
              : '点击上方按钮登记第一位宾客'}
          </p>
          {!searchQuery && filterRelationship === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              登记宾客
            </button>
          )}
        </div>
      )}

      {showAddModal && deceased && (
        <AddGuestModal
          deceasedId={deceased.id}
          onClose={() => setShowAddModal(false)}
          onSave={addGuest}
        />
      )}

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          onClose={() => setEditingGuest(null)}
          onSave={updateGuest}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认删除</h3>
              <p className="text-sm text-slate-500 mb-6">
                确定要删除该宾客的登记记录吗？此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="btn btn-danger flex-1 !bg-red-500 hover:!bg-red-600 !text-white"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
