import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import type { Eulogy } from '@/types';
import { EULOGY_STATUS_CONFIG } from '@/types';
import {
  FileText,
  Plus,
  Save,
  CheckCircle2,
  Edit2,
  Trash2,
  User,
  Clock,
  BookOpen,
  Sparkles,
  AlertCircle,
  Pencil,
  Eye,
  ChevronRight,
} from 'lucide-react';

export const EulogyEditor = () => {
  const {
    activeEulogies: eulogies,
    deceased,
    currentUser,
    addEulogy,
    updateEulogy,
    deleteEulogy,
    setEulogyStatus,
  } = useStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const selectedEulogy = useMemo(
    () => eulogies.find((e) => e.id === selectedId) || null,
    [eulogies, selectedId]
  );

  const stats = useMemo(() => {
    const total = eulogies.length;
    const drafts = eulogies.filter((e) => e.status === 'draft').length;
    const finalized = eulogies.filter((e) => e.status === 'finalized').length;
    return { total, drafts, finalized };
  }, [eulogies]);

  const sortedEulogies = useMemo(() => {
    return [...eulogies].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [eulogies]);

  const wordCount = useMemo(() => {
    return content.replace(/\s/g, '').length;
  }, [content]);

  const handleNew = () => {
    setSelectedId(null);
    setTitle('');
    setContent('');
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleSelect = (eulogy: Eulogy) => {
    setSelectedId(eulogy.id);
    setTitle(eulogy.title);
    setContent(eulogy.content);
    setIsEditing(false);
    setShowPreview(false);
  };

  const handleSaveDraft = () => {
    if (!deceased) return;
    if (!title.trim() || !content.trim()) {
      setSaveMessage('请填写标题和内容');
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    if (selectedEulogy) {
      updateEulogy(selectedEulogy.id, {
        title: title.trim(),
        content: content.trim(),
      });
    } else {
      const newEulogy = {
        deceasedId: deceased.id,
        title: title.trim(),
        content: content.trim(),
        authorId: currentUser?.id,
        authorName: currentUser?.name,
        status: 'draft' as const,
      };
      addEulogy(newEulogy);
    }

    setIsEditing(false);
    setSaveMessage('草稿已保存');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleFinalize = () => {
    if (!selectedEulogy) return;
    if (!title.trim() || !content.trim()) {
      setSaveMessage('请填写标题和内容');
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    if (selectedEulogy.status !== 'finalized') {
      if (confirm('确定要将此悼词标记为定稿吗？定稿后仍可修改。')) {
        if (title !== selectedEulogy.title || content !== selectedEulogy.content) {
          updateEulogy(selectedEulogy.id, {
            title: title.trim(),
            content: content.trim(),
          });
        }
        setEulogyStatus(selectedEulogy.id, 'finalized');
        setIsEditing(false);
        setSaveMessage('已标记为定稿');
        setTimeout(() => setSaveMessage(null), 2000);
      }
    }
  };

  const handleRevertToDraft = () => {
    if (!selectedEulogy) return;
    setEulogyStatus(selectedEulogy.id, 'draft');
    setSaveMessage('已恢复为草稿');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleDelete = (eulogy: Eulogy) => {
    if (confirm(`确定要删除悼词"${eulogy.title}"吗？此操作不可恢复。`)) {
      deleteEulogy(eulogy.id);
      if (selectedId === eulogy.id) {
        setSelectedId(null);
        setTitle('');
        setContent('');
        setIsEditing(false);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">悼词编辑</p>
              <p className="text-3xl font-bold font-serif">共 {stats.total} 篇</p>
            </div>
          </div>
          <p className="text-primary-200/80 text-sm mt-4">
            撰写、修改悼词内容，记录对逝者的追思与缅怀
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Pencil className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm text-slate-500">草稿</p>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.drafts} 篇</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-slate-500">已定稿</p>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.finalized} 篇</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="card p-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 font-serif flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600" />
              悼词列表
            </h3>
            <button
              onClick={handleNew}
              className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
              title="新建悼词"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sortedEulogies.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {sortedEulogies.map((eulogy) => {
                  const statusConfig = EULOGY_STATUS_CONFIG[eulogy.status];
                  const isSelected = selectedId === eulogy.id;
                  return (
                    <div
                      key={eulogy.id}
                      className={`group p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary-50 border-l-4 border-primary-500'
                          : 'hover:bg-slate-50 border-l-4 border-transparent'
                      }`}
                      onClick={() => handleSelect(eulogy)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-slate-800 truncate">
                              {eulogy.title}
                            </h4>
                            <span className={`badge ${statusConfig.bgColor} ${statusConfig.color}`}>
                              {statusConfig.name}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2">
                            {eulogy.content}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(eulogy.updatedAt)}
                            </span>
                            {eulogy.authorName && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {eulogy.authorName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(eulogy);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 mb-4">暂无悼词</p>
                <button
                  onClick={handleNew}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  撰写第一篇悼词
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card p-0 flex flex-col overflow-hidden lg:col-span-3">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 font-serif">
                  {selectedEulogy ? '编辑悼词' : '撰写悼词'}
                </h3>
                {selectedEulogy && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`badge ${EULOGY_STATUS_CONFIG[selectedEulogy.status].bgColor} ${EULOGY_STATUS_CONFIG[selectedEulogy.status].color}`}>
                      {EULOGY_STATUS_CONFIG[selectedEulogy.status].name}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {selectedEulogy.authorName || '佚名'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(selectedEulogy.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saveMessage && (
                <span className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  {saveMessage}
                </span>
              )}

              {selectedEulogy && (
                <>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`p-2 rounded-lg transition-colors ${
                      showPreview
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-slate-100 text-slate-500'
                    }`}
                    title="预览"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {!isEditing && selectedEulogy.status !== 'finalized' && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!selectedEulogy && !isEditing && eulogies.length > 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <ChevronRight className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 mb-4">选择左侧悼词进行查看或编辑</p>
                <button
                  onClick={handleNew}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  新建悼词
                </button>
              </div>
            ) : showPreview ? (
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-2xl p-8 shadow-inner">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 font-serif mb-2">
                      {title || '悼词标题'}
                    </h2>
                    {deceased && (
                      <p className="text-slate-500 text-sm">
                        —— 追思 {deceased.name} 老人 ——
                      </p>
                    )}
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <div className="text-slate-700 leading-loose whitespace-pre-wrap text-base font-serif">
                      {content || (
                        <span className="text-slate-400">暂无内容，请编辑后预览...</span>
                      )}
                    </div>
                  </div>
                  {content && (
                    <div className="mt-8 pt-6 border-t border-slate-200 text-right text-sm text-slate-500">
                      {currentUser?.name && <p>撰稿人：{currentUser.name}</p>}
                      <p>{new Date().toLocaleDateString('zh-CN')}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    悼词标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!isEditing && selectedEulogy) setIsEditing(true);
                    }}
                    placeholder="请输入悼词标题，如：追思慈母悼词"
                    className="input text-lg py-3"
                    disabled={
                      selectedEulogy?.status === 'finalized' && !isEditing
                        ? true
                        : false
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      悼词正文 <span className="text-red-500">*</span>
                    </label>
                    <span className="text-sm text-slate-400">
                      共 {wordCount} 字
                    </span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (!isEditing && selectedEulogy) setIsEditing(true);
                    }}
                    placeholder={`请在此撰写悼词正文...

示例结构：
一、开场白，介绍逝者身份
二、回顾逝者生平事迹
三、缅怀逝者品德与贡献
四、表达哀思与追思之情
五、结束语`}
                    rows={18}
                    className="input resize-none text-base leading-relaxed font-serif"
                    disabled={
                      selectedEulogy?.status === 'finalized' && !isEditing
                        ? true
                        : false
                    }
                  />
                </div>

                {selectedEulogy?.status === 'finalized' && !isEditing && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        此悼词已标记为定稿
                      </p>
                      <p className="text-sm text-green-600 mt-0.5">
                        如需修改，请点击编辑按钮。定稿时间：
                        {selectedEulogy.finalizedAt && formatDate(selectedEulogy.finalizedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {(isEditing || !selectedEulogy) && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        写作建议
                      </p>
                      <p className="text-sm text-amber-700 mt-0.5">
                        悼词应真实感人，可回顾逝者生平、品德、贡献，表达缅怀之情。建议篇幅控制在 500-1500 字，朗读时间约 5-10 分钟。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {(!showPreview) && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                {deceased && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    撰稿人：{currentUser?.name || '未登录'}
                    <span className="text-slate-300">·</span>
                    <FileText className="w-4 h-4" />
                    追思：{deceased.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedEulogy?.status === 'finalized' ? (
                  <button
                    onClick={handleRevertToDraft}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    恢复为草稿
                  </button>
                ) : (
                  <button
                    onClick={handleFinalize}
                    disabled={!selectedEulogy || !title.trim() || !content.trim()}
                    className="btn-gold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    标记定稿
                  </button>
                )}

                <button
                  onClick={handleSaveDraft}
                  disabled={
                    (!isEditing && selectedEulogy &&
                      title === selectedEulogy.title &&
                      content === selectedEulogy.content) ||
                    !title.trim() ||
                    !content.trim()
                  }
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {selectedEulogy ? '保存修改' : '保存草稿'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
