import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { FUNERAL_ITEM_CATEGORY_CONFIG, type FuneralItemCategory, type FuneralItem } from '@/types';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  RefreshCw,
  Shirt,
  Flame,
  Flower2,
  Box,
  Scroll,
  Sparkles,
  Apple,
  X,
  Check,
  TrendingUp,
  Clock,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Shirt,
  Flame,
  Flower2,
  Box,
  Scroll,
  Sparkles,
  Apple,
  Package,
};

interface AddItemModalProps {
  deceasedId: string;
  onClose: () => void;
  onSave: (item: Omit<FuneralItem, 'id' | 'createdAt'>) => void;
}

const AddItemModal = ({ deceasedId, onClose, onSave }: AddItemModalProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FuneralItemCategory>('other');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('个');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      quantity: Math.max(1, quantity),
      unit: unit.trim() || undefined,
      purchased: false,
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
            <h3 className="text-lg font-semibold text-slate-800 font-serif">添加物品</h3>
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
              物品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入物品名称"
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">物品分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FuneralItemCategory)}
              className="input"
            >
              {Object.entries(FUNERAL_ITEM_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">数量</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">单位</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="如：个、套、包"
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">物品描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="可填写物品的规格、要求等"
              rows={2}
              className="input resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="其他需要说明的事项"
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
              disabled={!name.trim()}
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

interface EditItemModalProps {
  item: FuneralItem;
  onClose: () => void;
  onSave: (id: string, updates: Partial<FuneralItem>) => void;
}

const EditItemModal = ({ item, onClose, onSave }: EditItemModalProps) => {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<FuneralItemCategory>(item.category);
  const [description, setDescription] = useState(item.description || '');
  const [quantity, setQuantity] = useState(item.quantity);
  const [unit, setUnit] = useState(item.unit || '个');
  const [note, setNote] = useState(item.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(item.id, {
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      quantity: Math.max(1, quantity),
      unit: unit.trim() || undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">编辑物品</h3>
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
              物品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">物品分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FuneralItemCategory)}
              className="input"
            >
              {Object.entries(FUNERAL_ITEM_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">数量</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">单位</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">物品描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
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
              disabled={!name.trim()}
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

export const ItemChecklist = () => {
  const {
    activeFuneralItems: items,
    deceased,
    addFuneralItem,
    updateFuneralItem,
    deleteFuneralItem,
    toggleFuneralItemPurchased,
    resetFuneralItems,
    members,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FuneralItemCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'purchased'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FuneralItem | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const stats = useMemo(() => {
    const total = items.length;
    const purchased = items.filter((i) => i.purchased).length;
    const pending = total - purchased;
    const percentage = total > 0 ? Math.round((purchased / total) * 100) : 0;
    return { total, purchased, pending, percentage };
  }, [items]);

  const categoryStats = useMemo(() => {
    const result: Record<string, { total: number; purchased: number }> = {};
    Object.keys(FUNERAL_ITEM_CATEGORY_CONFIG).forEach((key) => {
      result[key] = { total: 0, purchased: 0 };
    });
    items.forEach((item) => {
      result[item.category].total++;
      if (item.purchased) result[item.category].purchased++;
    });
    return result;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !(item.description?.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      if (filterCategory !== 'all' && item.category !== filterCategory) {
        return false;
      }
      if (filterStatus === 'purchased' && !item.purchased) return false;
      if (filterStatus === 'pending' && item.purchased) return false;
      return true;
    }).sort((a, b) => {
      if (a.purchased !== b.purchased) return a.purchased ? 1 : -1;
      return a.category.localeCompare(b.category);
    });
  }, [items, searchQuery, filterCategory, filterStatus]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, FuneralItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const getPurchaserName = (purchaserId?: string) => {
    if (!purchaserId) return '';
    const member = members.find((m) => m.id === purchaserId);
    return member?.name || '';
  };

  const handleReset = () => {
    if (!deceased) return;
    resetFuneralItems(deceased.id);
    setShowResetConfirm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">物品总数</p>
              <p className="text-2xl font-bold font-serif">{stats.total} 项</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">已备齐</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.purchased} 项
              </p>
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
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">待准备</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.pending} 项
              </p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? ((stats.pending / stats.total) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">完成进度</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.percentage}%
              </p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.entries(FUNERAL_ITEM_CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = ICON_MAP[config.icon] || Package;
            const stat = categoryStats[key];
            const catPercent = stat.total > 0 ? Math.round((stat.purchased / stat.total) * 100) : 0;
            return (
              <div
                key={key}
                onClick={() => setFilterCategory(filterCategory === key ? 'all' : key as FuneralItemCategory)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  filterCategory === key
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-sm font-medium text-slate-700 truncate">{config.name}</span>
                </div>
                <div className="text-lg font-bold text-slate-800 font-serif">
                  {stat.purchased}/{stat.total}
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${catPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
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
                placeholder="搜索物品名称..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input w-auto"
            >
              <option value="all">全部状态</option>
              <option value="pending">待准备</option>
              <option value="purchased">已备齐</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重置清单
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加物品
            </button>
          </div>
        </div>
      </div>

      {Object.keys(groupedItems).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => {
            const config = FUNERAL_ITEM_CATEGORY_CONFIG[category as FuneralItemCategory];
            const Icon = ICON_MAP[config.icon] || Package;
            const categoryPurchased = categoryItems.filter((i) => i.purchased).length;
            const categoryPercent = Math.round((categoryPurchased / categoryItems.length) * 100);

            return (
              <div key={category} className="card">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-slate-100`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 font-serif flex items-center gap-2">
                        {config.name}
                        <span className="text-sm font-normal text-slate-400">
                          ({categoryPurchased}/{categoryItems.length})
                        </span>
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${categoryPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-12 text-right">
                      {categoryPercent}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {categoryItems.map((item, index) => (
                    <div
                      key={item.id}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all animate-slide-up ${
                        item.purchased
                          ? 'bg-green-50/50 border-green-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => toggleFuneralItemPurchased(item.id)}
                        className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                      >
                        {item.purchased ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-medium ${
                                item.purchased
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-800'
                              }`}
                            >
                              {item.name}
                              {item.unit && (
                                <span className="ml-2 text-sm font-normal text-slate-500">
                                  × {item.quantity} {item.unit}
                                </span>
                              )}
                            </h4>
                            {item.description && (
                              <p className={`text-sm mt-1 ${
                                item.purchased ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                {item.description}
                              </p>
                            )}
                            {item.note && (
                              <p className={`text-xs mt-2 px-2.5 py-1 rounded-lg inline-block ${
                                item.purchased
                                  ? 'bg-slate-100 text-slate-400'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                📝 {item.note}
                              </p>
                            )}
                            {item.purchased && item.purchasedAt && (
                              <p className="text-xs text-green-600 mt-2 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5" />
                                已于 {new Date(item.purchasedAt).toLocaleDateString('zh-CN')} 备齐
                                {item.purchaserId && ` · ${getPurchaserName(item.purchaserId)}`}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                              title="编辑"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`确定要删除"${item.name}"吗？`)) {
                                  deleteFuneralItem(item.id);
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-500 mb-2">暂无匹配的物品</p>
          <p className="text-sm text-slate-400 mb-6">
            {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
              ? '请尝试调整搜索条件或筛选器'
              : '点击上方按钮添加第一个物品'}
          </p>
          {!searchQuery && filterCategory === 'all' && filterStatus === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加物品
            </button>
          )}
        </div>
      )}

      {showAddModal && deceased && (
        <AddItemModal
          deceasedId={deceased.id}
          onClose={() => setShowAddModal(false)}
          onSave={addFuneralItem}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateFuneralItem}
        />
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <RefreshCw className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认重置清单</h3>
              <p className="text-sm text-slate-500 mb-6">
                此操作将恢复为默认的物品清单，所有自定义物品和当前勾选状态将被清除。确定要继续吗？
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
