import { useState, useMemo, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { DOCUMENT_CATEGORY_CONFIG, type DocumentCategory, type FuneralDocument } from '@/types';
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Upload,
  X,
  Edit2,
  Trash2,
  FileText,
  Flame,
  Home,
  Receipt,
  TreePine,
  ShieldCheck,
  HeartPulse,
  Folder,
  Image as ImageIcon,
  ZoomIn,
  Calendar,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Flame,
  Home,
  Receipt,
  TreePine,
  ShieldCheck,
  HeartPulse,
  Folder,
};

interface AddDocumentModalProps {
  deceasedId: string;
  onClose: () => void;
  onSave: (doc: Omit<FuneralDocument, 'id' | 'uploadDate'>) => void;
}

const AddDocumentModal = ({ deceasedId, onClose, onSave }: AddDocumentModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('death_certificate');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [note, setNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;
    onSave({
      title: title.trim(),
      category,
      description: description.trim() || undefined,
      imageUrl,
      deceasedId,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">上传证件</h3>
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
              证件照片 <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all"
            >
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="证件预览"
                    className="max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto bg-slate-100 rounded-xl flex items-center justify-center">
                    <Upload className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">点击上传证件照片</p>
                    <p className="text-xs text-slate-400 mt-1">支持 JPG、PNG 格式</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              证件名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入证件名称"
              className="input"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">证件分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="input"
            >
              {Object.entries(DOCUMENT_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">证件描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="可填写证件的相关说明"
              rows={2}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="其他需要记录的信息"
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
              disabled={!title.trim() || !imageUrl}
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

interface EditDocumentModalProps {
  document: FuneralDocument;
  onClose: () => void;
  onSave: (id: string, updates: Partial<FuneralDocument>) => void;
}

const EditDocumentModal = ({ document, onClose, onSave }: EditDocumentModalProps) => {
  const [title, setTitle] = useState(document.title);
  const [category, setCategory] = useState<DocumentCategory>(document.category);
  const [description, setDescription] = useState(document.description || '');
  const [imageUrl, setImageUrl] = useState(document.imageUrl);
  const [note, setNote] = useState(document.note || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;
    onSave(document.id, {
      title: title.trim(),
      category,
      description: description.trim() || undefined,
      imageUrl,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 font-serif">编辑证件</h3>
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
              证件照片 <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all"
            >
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="证件预览"
                    className="max-h-40 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 mx-auto bg-slate-100 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">点击更换照片</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              证件名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">证件分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="input"
            >
              {Object.entries(DOCUMENT_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">证件描述</label>
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
              disabled={!title.trim() || !imageUrl}
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

interface ViewDocumentModalProps {
  document: FuneralDocument;
  onClose: () => void;
}

const ViewDocumentModal = ({ document, onClose }: ViewDocumentModalProps) => {
  const config = DOCUMENT_CATEGORY_CONFIG[document.category];
  const Icon = ICON_MAP[config.icon] || Folder;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative max-w-4xl w-full max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
          <div className="relative bg-slate-100 flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '60vh' }}>
            <img
              src={document.imageUrl}
              alt={document.title}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgColor}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 font-serif">{document.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{config.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>上传于 {new Date(document.uploadDate).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
            {document.description && (
              <p className="text-slate-600 mt-4">{document.description}</p>
            )}
            {document.note && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700">📝 {document.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DocumentArchive = () => {
  const {
    activeDocuments: documents,
    deceased,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<FuneralDocument | null>(null);
  const [viewingDoc, setViewingDoc] = useState<FuneralDocument | null>(null);

  const stats = useMemo(() => {
    const total = documents.length;
    const categoryCounts: Record<string, number> = {};
    Object.keys(DOCUMENT_CATEGORY_CONFIG).forEach((key) => {
      categoryCounts[key] = 0;
    });
    documents.forEach((doc) => {
      categoryCounts[doc.category]++;
    });
    return { total, categoryCounts };
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(query);
        const matchDesc = doc.description?.toLowerCase().includes(query);
        const matchNote = doc.note?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchNote) {
          return false;
        }
      }
      if (filterCategory !== 'all' && doc.category !== filterCategory) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [documents, searchQuery, filterCategory]);

  const groupedDocuments = useMemo(() => {
    const groups: Record<string, FuneralDocument[]> = {};
    filteredDocuments.forEach((doc) => {
      if (!groups[doc.category]) groups[doc.category] = [];
      groups[doc.category].push(doc);
    });
    return groups;
  }, [filteredDocuments]);

  const handleDelete = (doc: FuneralDocument) => {
    if (confirm(`确定要删除"${doc.title}"吗？`)) {
      deleteDocument(doc.id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">证件总数</p>
              <p className="text-3xl font-bold font-serif">{stats.total} 份</p>
            </div>
          </div>
          <p className="text-primary-200/80 text-sm mt-4">
            分类归档各类证明文件，方便随时查阅
          </p>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">分类统计</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(DOCUMENT_CATEGORY_CONFIG).map(([key, config]) => {
              const Icon = ICON_MAP[config.icon] || Folder;
              const count = stats.categoryCounts[key] || 0;
              return (
                <div
                  key={key}
                  onClick={() => setFilterCategory(filterCategory === key ? 'all' : key as DocumentCategory)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    filterCategory === key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgColor}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 truncate">{config.name}</p>
                      <p className="text-base font-bold text-slate-800">{count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
                placeholder="搜索证件名称、描述..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as DocumentCategory | 'all')}
              className="input w-auto"
            >
              <option value="all">全部分类</option>
              {Object.entries(DOCUMENT_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            {filterCategory !== 'all' && (
              <button
                onClick={() => setFilterCategory('all')}
                className="btn-secondary flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                清除筛选
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              上传证件
            </button>
          </div>
        </div>
      </div>

      {Object.keys(groupedDocuments).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedDocuments).map(([category, categoryDocs]) => {
            const config = DOCUMENT_CATEGORY_CONFIG[category as DocumentCategory];
            const Icon = ICON_MAP[config.icon] || Folder;

            return (
              <div key={category} className="card">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.bgColor}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 font-serif flex items-center gap-2">
                        {config.name}
                        <span className="text-sm font-normal text-slate-400">
                          ({categoryDocs.length} 份)
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categoryDocs.map((doc, index) => (
                    <div
                      key={doc.id}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all animate-slide-up"
                    >
                      <div
                        onClick={() => setViewingDoc(doc)}
                        className="relative aspect-[3/4] bg-slate-100 cursor-pointer overflow-hidden"
                      >
                        <img
                          src={doc.imageUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                              <ZoomIn className="w-5 h-5 text-slate-700" />
                            </div>
                          </div>
                        </div>
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {config.name}
                        </div>
                      </div>

                      <div className="p-3">
                        <h4 className="font-medium text-slate-800 text-sm truncate" title={doc.title}>
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.uploadDate).toLocaleDateString('zh-CN')}
                        </p>
                        {doc.description && (
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingDoc(doc)}
                          className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
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
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-500 mb-2">暂无证件档案</p>
          <p className="text-sm text-slate-400 mb-6">
            {searchQuery || filterCategory !== 'all'
              ? '请尝试调整搜索条件或筛选器'
              : '上传各类证明文件，方便统一管理和查阅'}
          </p>
          {!searchQuery && filterCategory === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              上传证件
            </button>
          )}
        </div>
      )}

      {showAddModal && deceased && (
        <AddDocumentModal
          deceasedId={deceased.id}
          onClose={() => setShowAddModal(false)}
          onSave={addDocument}
        />
      )}

      {editingDoc && (
        <EditDocumentModal
          document={editingDoc}
          onClose={() => setEditingDoc(null)}
          onSave={updateDocument}
        />
      )}

      {viewingDoc && (
        <ViewDocumentModal
          document={viewingDoc}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </div>
  );
};
