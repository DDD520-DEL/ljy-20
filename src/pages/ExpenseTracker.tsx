import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { EXPENSE_CATEGORY_CONFIG, type ExpenseCategory, type Expense } from '@/types';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  TrendingUp,
  Receipt,
  Calendar,
  User,
  Building2,
  TreePine,
  UtensilsCrossed,
  Shirt,
  Flame,
  Flower2,
  Box,
  Scroll,
  Sparkles,
  Car,
  Church,
  HeartPulse,
  FileText,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Building2,
  TreePine,
  UtensilsCrossed,
  Shirt,
  Flame,
  Flower2,
  Box,
  Scroll,
  Sparkles,
  Car,
  Church,
  HeartPulse,
  FileText,
  Wallet,
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount);
};

interface AddExpenseModalProps {
  deceasedId: string;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const AddExpenseModal = ({ deceasedId, onClose, onSave }: AddExpenseModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const { members, currentUser } = useStore();
  const [payerId, setPayerId] = useState(currentUser?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) return;
    onSave({
      title: title.trim(),
      category,
      amount: parseFloat(amount),
      date,
      description: description.trim() || undefined,
      note: note.trim() || undefined,
      payerId: payerId || undefined,
      deceasedId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">添加费用</h3>
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
              费用名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如：殡仪馆火化费"
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">费用类别</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="input"
            >
              {Object.entries(EXPENSE_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                金额 (元) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">付款人</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="input"
            >
              <option value="">请选择付款人</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">费用描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="可填写费用的详细说明"
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
              disabled={!title.trim() || !amount || parseFloat(amount) <= 0}
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

interface EditExpenseModalProps {
  expense: Expense;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Expense>) => void;
}

const EditExpenseModal = ({ expense, onClose, onSave }: EditExpenseModalProps) => {
  const [title, setTitle] = useState(expense.title);
  const [category, setCategory] = useState<ExpenseCategory>(expense.category);
  const [amount, setAmount] = useState<string>(expense.amount.toString());
  const [date, setDate] = useState(expense.date);
  const [description, setDescription] = useState(expense.description || '');
  const [note, setNote] = useState(expense.note || '');
  const { members } = useStore();
  const [payerId, setPayerId] = useState(expense.payerId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) return;
    onSave(expense.id, {
      title: title.trim(),
      category,
      amount: parseFloat(amount),
      date,
      description: description.trim() || undefined,
      note: note.trim() || undefined,
      payerId: payerId || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">编辑费用</h3>
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
              费用名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">费用类别</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="input"
            >
              {Object.entries(EXPENSE_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                金额 (元) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">付款人</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="input"
            >
              <option value="">请选择付款人</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">费用描述</label>
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
              disabled={!title.trim() || !amount || parseFloat(amount) <= 0}
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

export const ExpenseTracker = () => {
  const {
    activeExpenses: expenses,
    deceased,
    addExpense,
    updateExpense,
    deleteExpense,
    members,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const stats = useMemo(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0];
    const avgAmount = count > 0 ? totalAmount / count : 0;
    return { totalAmount, count, avgAmount, topCategory, categoryTotals };
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = expense.title.toLowerCase().includes(query);
        const matchDesc = (expense.description?.toLowerCase() || '').includes(query);
        const matchNote = (expense.note?.toLowerCase() || '').includes(query);
        if (!matchTitle && !matchDesc && !matchNote) return false;
      }
      if (filterCategory !== 'all' && expense.category !== filterCategory) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchQuery, filterCategory]);

  const getPayerName = (payerId?: string) => {
    if (!payerId) return '';
    const member = members.find((m) => m.id === payerId);
    return member?.name || '';
  };

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    filteredExpenses.forEach((expense) => {
      const dateKey = expense.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(expense);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredExpenses]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">总支出</p>
              <p className="text-2xl font-bold font-serif">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">费用笔数</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.count} 笔
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
              <p className="text-slate-500 text-sm">平均单笔</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {formatCurrency(stats.avgAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">最大支出类别</p>
              <p className="text-lg font-bold text-slate-800 font-serif truncate">
                {stats.topCategory
                  ? EXPENSE_CATEGORY_CONFIG[stats.topCategory[0] as ExpenseCategory]?.name
                  : '-'
                }
              </p>
              {stats.topCategory && (
                <p className="text-sm text-rose-600 font-medium">
                  {formatCurrency(stats.topCategory[1])}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
          <PieChart className="w-4 h-4" />
          分类支出统计
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(EXPENSE_CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = ICON_MAP[config.icon] || Wallet;
            const amount = stats.categoryTotals[key] || 0;
            const percentage = stats.totalAmount > 0 ? (amount / stats.totalAmount) * 100 : 0;
            const isSelected = filterCategory === key;
            return (
              <div
                key={key}
                onClick={() => setFilterCategory(isSelected ? 'all' : key as ExpenseCategory)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.bgColor}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 truncate">{config.name}</span>
                </div>
                <div className="text-base font-bold text-slate-800 font-serif">
                  {formatCurrency(amount)}
                </div>
                {amount > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-10 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                )}
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
                placeholder="搜索费用名称、描述..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="input w-auto"
            >
              <option value="all">全部类别</option>
              {Object.entries(EXPENSE_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            {(searchQuery || filterCategory !== 'all') && (
              <div className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                筛选后合计: {formatCurrency(filteredTotal)}
              </div>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加费用
            </button>
          </div>
        </div>
      </div>

      {groupedExpenses.length > 0 ? (
        <div className="space-y-6">
          {groupedExpenses.map(([date, dayExpenses], groupIndex) => {
            const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
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
                      <p className="text-xs text-slate-500">{dayExpenses.length} 笔支出</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-rose-500" />
                    <span className="text-lg font-bold text-rose-600 font-serif">
                      {formatCurrency(dayTotal)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {dayExpenses.map((expense, index) => {
                    const config = EXPENSE_CATEGORY_CONFIG[expense.category];
                    const Icon = ICON_MAP[config.icon] || Wallet;
                    return (
                      <div
                        key={expense.id}
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
                                <h4 className="font-medium text-slate-800">
                                  {expense.title}
                                </h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  {config.name}
                                </span>
                              </div>
                              {expense.description && (
                                <p className="text-sm mt-1 text-slate-500">
                                  {expense.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 flex-wrap">
                                {expense.payerId && (
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <User className="w-3.5 h-3.5" />
                                    <span>付款人: {getPayerName(expense.payerId)}</span>
                                  </div>
                                )}
                                {expense.note && (
                                  <p className="text-xs px-2.5 py-1 rounded-lg inline-block bg-amber-50 text-amber-700">
                                    📝 {expense.note}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-lg font-bold text-rose-600 font-serif">
                                  {formatCurrency(expense.amount)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingExpense(expense)}
                                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                  title="编辑"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`确定要删除"${expense.title}"这笔费用吗？`)) {
                                      deleteExpense(expense.id);
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
          <Wallet className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-500 mb-2">暂无费用记录</p>
          <p className="text-sm text-slate-400 mb-6">
            {searchQuery || filterCategory !== 'all'
              ? '请尝试调整搜索条件或筛选器'
              : '点击上方按钮记录第一笔费用'}
          </p>
          {!searchQuery && filterCategory === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加费用
            </button>
          )}
        </div>
      )}

      {showAddModal && deceased && (
        <AddExpenseModal
          deceasedId={deceased.id}
          onClose={() => setShowAddModal(false)}
          onSave={addExpense}
        />
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={updateExpense}
        />
      )}
    </div>
  );
};
