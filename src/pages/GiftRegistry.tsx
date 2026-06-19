import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { CONDOLENCE_GIFT_TYPE_CONFIG, type CondolenceGiftType, type CondolenceGift } from '@/types';
import {
  Gift,
  Banknote,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  User,
  Heart,
  Calendar,
  FileText,
  Package,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Banknote,
  Gift,
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount);
};

interface AddGiftModalProps {
  deceasedId: string;
  onClose: () => void;
  onSave: (gift: Omit<CondolenceGift, 'id' | 'createdAt'>) => void;
}

const AddGiftModal = ({ deceasedId, onClose, onSave }: AddGiftModalProps) => {
  const [type, setType] = useState<CondolenceGiftType>('cash');
  const [guestName, setGuestName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [giftName, setGiftName] = useState('');
  const [quantity, setQuantity] = useState<string>('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !relationship.trim()) return;
    if (type === 'cash' && (!amount || parseFloat(amount) <= 0)) return;
    if (type === 'gift' && !giftName.trim()) return;

    onSave({
      type,
      guestName: guestName.trim(),
      relationship: relationship.trim(),
      amount: type === 'cash' ? parseFloat(amount) : undefined,
      giftName: type === 'gift' ? giftName.trim() : undefined,
      quantity: type === 'gift' && quantity ? parseInt(quantity) : undefined,
      date,
      note: note.trim() || undefined,
      deceasedId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">登记随礼</h3>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">随礼类型</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CONDOLENCE_GIFT_TYPE_CONFIG).map(([key, config]) => {
                const Icon = ICON_MAP[config.icon] || Gift;
                const isSelected = type === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key as CondolenceGiftType)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${config.bgColor}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <p className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>
                      {config.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              亲友姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="请输入亲友姓名"
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
                placeholder="如：侄子、朋友、同事等"
                className="input pl-10"
              />
            </div>
          </div>

          {type === 'cash' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                礼金金额 (元) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="请输入礼金金额"
                  className="input pl-10"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  礼品名称 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={giftName}
                    onChange={(e) => setGiftName(e.target.value)}
                    placeholder="如：花圈、挽联"
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">数量</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">登记日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                placeholder="其他需要记录的信息"
                rows={2}
                className="input pl-10 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              取消
            </button>
            <button
              type="submit"
              disabled={
                !guestName.trim() ||
                !relationship.trim() ||
                (type === 'cash' && (!amount || parseFloat(amount) <= 0)) ||
                (type === 'gift' && !giftName.trim())
              }
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

interface EditGiftModalProps {
  gift: CondolenceGift;
  onClose: () => void;
  onSave: (id: string, updates: Partial<CondolenceGift>) => void;
}

const EditGiftModal = ({ gift, onClose, onSave }: EditGiftModalProps) => {
  const [type, setType] = useState<CondolenceGiftType>(gift.type);
  const [guestName, setGuestName] = useState(gift.guestName);
  const [relationship, setRelationship] = useState(gift.relationship);
  const [amount, setAmount] = useState<string>(gift.amount?.toString() || '');
  const [giftName, setGiftName] = useState(gift.giftName || '');
  const [quantity, setQuantity] = useState<string>(gift.quantity?.toString() || '1');
  const [date, setDate] = useState(gift.date);
  const [note, setNote] = useState(gift.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !relationship.trim()) return;
    if (type === 'cash' && (!amount || parseFloat(amount) <= 0)) return;
    if (type === 'gift' && !giftName.trim()) return;

    onSave(gift.id, {
      type,
      guestName: guestName.trim(),
      relationship: relationship.trim(),
      amount: type === 'cash' ? parseFloat(amount) : undefined,
      giftName: type === 'gift' ? giftName.trim() : undefined,
      quantity: type === 'gift' && quantity ? parseInt(quantity) : undefined,
      date,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">编辑随礼</h3>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">随礼类型</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CONDOLENCE_GIFT_TYPE_CONFIG).map(([key, config]) => {
                const Icon = ICON_MAP[config.icon] || Gift;
                const isSelected = type === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key as CondolenceGiftType)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${config.bgColor}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <p className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>
                      {config.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              亲友姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="input pl-10"
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

          {type === 'cash' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                礼金金额 (元) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  礼品名称 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={giftName}
                    onChange={(e) => setGiftName(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">数量</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">登记日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                rows={2}
                className="input pl-10 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              取消
            </button>
            <button
              type="submit"
              disabled={
                !guestName.trim() ||
                !relationship.trim() ||
                (type === 'cash' && (!amount || parseFloat(amount) <= 0)) ||
                (type === 'gift' && !giftName.trim())
              }
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

export const GiftRegistry = () => {
  const {
    activeCondolenceGifts: gifts,
    deceased,
    addCondolenceGift,
    updateCondolenceGift,
    deleteCondolenceGift,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<CondolenceGiftType | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGift, setEditingGift] = useState<CondolenceGift | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalCash = gifts.filter((g) => g.type === 'cash').reduce((sum, g) => sum + (g.amount || 0), 0);
    const totalGiftCount = gifts
      .filter((g) => g.type === 'gift')
      .reduce((sum, g) => sum + (g.quantity || 1), 0);
    const totalRecords = gifts.length;
    const cashCount = gifts.filter((g) => g.type === 'cash').length;
    const giftCount = gifts.filter((g) => g.type === 'gift').length;
    const avgCash = cashCount > 0 ? totalCash / cashCount : 0;
    const relationships = Array.from(new Set(gifts.map((g) => g.relationship))).sort();

    return { totalCash, totalGiftCount, totalRecords, cashCount, giftCount, avgCash, relationships };
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = gift.guestName.toLowerCase().includes(query);
        const matchRelationship = gift.relationship.toLowerCase().includes(query);
        const matchGiftName = (gift.giftName || '').toLowerCase().includes(query);
        const matchNote = (gift.note || '').toLowerCase().includes(query);
        if (!matchName && !matchRelationship && !matchGiftName && !matchNote) {
          return false;
        }
      }
      if (filterType !== 'all' && gift.type !== filterType) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [gifts, searchQuery, filterType]);

  const filteredStats = useMemo(() => {
    const cash = filteredGifts.filter((g) => g.type === 'cash').reduce((sum, g) => sum + (g.amount || 0), 0);
    const giftItems = filteredGifts
      .filter((g) => g.type === 'gift')
      .reduce((sum, g) => sum + (g.quantity || 1), 0);
    return { cash, giftItems };
  }, [filteredGifts]);

  const groupedGifts = useMemo(() => {
    const groups: Record<string, CondolenceGift[]> = {};
    filteredGifts.forEach((gift) => {
      const dateKey = gift.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(gift);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredGifts]);

  const handleDelete = (id: string) => {
    deleteCondolenceGift(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-emerald-200 text-sm">礼金总额</p>
              <p className="text-2xl font-bold font-serif">{formatCurrency(stats.totalCash)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">礼品件数</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.totalGiftCount} 件
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">登记总数</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.totalRecords} 笔
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">平均礼金</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {formatCurrency(stats.avgCash)}
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
                placeholder="搜索亲友姓名、关系、礼品..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input w-auto"
            >
              <option value="all">全部类型</option>
              <option value="cash">仅礼金</option>
              <option value="gift">仅礼品</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {(searchQuery || filterType !== 'all') && (
              <div className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                筛选: 礼金 {formatCurrency(filteredStats.cash)} / 礼品 {filteredStats.giftItems} 件
              </div>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              登记随礼
            </button>
          </div>
        </div>
      </div>

      {groupedGifts.length > 0 ? (
        <div className="space-y-6 pb-32">
          {groupedGifts.map(([date, dayGifts], groupIndex) => {
            const dayCash = dayGifts.filter((g) => g.type === 'cash').reduce((sum, g) => sum + (g.amount || 0), 0);
            const dayGiftItems = dayGifts
              .filter((g) => g.type === 'gift')
              .reduce((sum, g) => sum + (g.quantity || 1), 0);
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            });
            return (
              <div key={date} className="card">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary-50">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 font-serif">{formattedDate}</h3>
                      <p className="text-xs text-slate-500">{dayGifts.length} 笔登记</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-700">{formatCurrency(dayCash)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-rose-600" />
                      <span className="font-semibold text-rose-700">{dayGiftItems} 件</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {dayGifts.map((gift, index) => {
                    const config = CONDOLENCE_GIFT_TYPE_CONFIG[gift.type];
                    const Icon = ICON_MAP[config.icon] || Gift;
                    return (
                      <div
                        key={gift.id}
                        style={{ animationDelay: `${(groupIndex * 50 + index * 30)}ms` }}
                        className="group flex items-start gap-4 p-4 rounded-xl border transition-all animate-slide-up bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium text-slate-800 font-serif">
                                  {gift.guestName}
                                </h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                                  {gift.relationship}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                                  {config.name}
                                </span>
                              </div>
                              {gift.type === 'cash' ? (
                                <p className="text-lg font-bold text-emerald-700 mt-1 font-serif">
                                  {formatCurrency(gift.amount || 0)}
                                </p>
                              ) : (
                                <p className="text-sm text-slate-700 mt-1">
                                  <span className="font-medium">{gift.giftName}</span>
                                  {gift.quantity && gift.quantity > 1 && (
                                    <span className="text-slate-500 ml-1">× {gift.quantity}</span>
                                  )}
                                </p>
                              )}
                              {gift.note && (
                                <p className="text-xs px-2.5 py-1 mt-2 rounded-lg inline-block bg-amber-50 text-amber-700">
                                  📝 {gift.note}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => setEditingGift(gift)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                title="编辑"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(gift.id)}
                                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                title="删除"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-16">
          <Gift className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-500 mb-2">暂无随礼记录</p>
          <p className="text-sm text-slate-400 mb-6">
            {searchQuery || filterType !== 'all'
              ? '请尝试调整搜索条件或筛选器'
              : '点击上方按钮登记第一笔随礼'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              登记随礼
            </button>
          )}
        </div>
      )}

      {groupedGifts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-medium text-slate-700">汇总统计</span>
                <span className="text-slate-400">|</span>
                <span className="text-sm">{stats.totalRecords} 笔登记</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-slate-600">礼金总额：</span>
                  <span className="text-xl font-bold text-emerald-700 font-serif">
                    {formatCurrency(stats.totalCash)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-600" />
                  <span className="text-sm text-slate-600">礼品总数：</span>
                  <span className="text-xl font-bold text-rose-700 font-serif">
                    {stats.totalGiftCount} 件
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && deceased && (
        <AddGiftModal
          deceasedId={deceased.id}
          onClose={() => setShowAddModal(false)}
          onSave={addCondolenceGift}
        />
      )}

      {editingGift && (
        <EditGiftModal
          gift={editingGift}
          onClose={() => setEditingGift(null)}
          onSave={updateCondolenceGift}
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
                确定要删除该随礼登记记录吗？此操作无法撤销。
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
