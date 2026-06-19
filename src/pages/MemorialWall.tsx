import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { isAdmin } from '@/types';
import type { MemorialMessage } from '@/types';
import {
  MessageSquareHeart,
  Send,
  Trash2,
  Heart,
  Clock,
  User,
  Users,
  CalendarHeart,
  Feather,
  X,
  AlertTriangle,
} from 'lucide-react';

interface MessageFormProps {
  deceasedId: string;
  onSubmit: (message: Omit<MemorialMessage, 'id' | 'createdAt'>) => void;
}

const MessageForm = ({ deceasedId, onSubmit }: MessageFormProps) => {
  const [authorName, setAuthorName] = useState('');
  const [authorRelationship, setAuthorRelationship] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorRelationship.trim() || !content.trim()) return;
    onSubmit({
      authorName: authorName.trim(),
      authorRelationship: authorRelationship.trim(),
      content: content.trim(),
      deceasedId,
    });
    setAuthorName('');
    setAuthorRelationship('');
    setContent('');
  };

  const isValid = authorName.trim() && authorRelationship.trim() && content.trim();

  return (
    <div className="card mb-6 bg-gradient-to-br from-amber-50 to-white border-amber-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg">
          <Feather className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 font-serif">写下您的追思</h3>
          <p className="text-sm text-slate-500">寄托哀思，永存记忆</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              您的姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="请输入您的姓名"
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
                value={authorRelationship}
                onChange={(e) => setAuthorRelationship(e.target.value)}
                placeholder="如：儿子、女儿、朋友、同事等"
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            追思留言 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此写下您想对逝者说的话，寄托您的哀思与怀念..."
            rows={5}
            className="input resize-none"
          />
          <div className="mt-1.5 flex justify-between items-center">
            <span className={`text-xs ${content.length > 480 ? 'text-red-500' : 'text-slate-400'}`}>
              {content.length}/500
            </span>
            {content.length > 500 && (
              <span className="text-xs text-red-500">内容过长，请精简</span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || content.length > 500}
            className="btn-primary flex items-center gap-2 px-8"
          >
            <Send className="w-4 h-4" />
            发表留言
          </button>
        </div>
      </form>
    </div>
  );
};

interface MessageCardProps {
  message: MemorialMessage;
  index: number;
  canDelete: boolean;
  onDelete: (id: string) => void;
}

const MessageCard = ({ message, index, canDelete, onDelete }: MessageCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const avatarColors = [
    'from-primary-500 to-primary-700',
    'from-amber-500 to-amber-700',
    'from-emerald-500 to-emerald-700',
    'from-rose-500 to-rose-700',
    'from-indigo-500 to-indigo-700',
    'from-cyan-500 to-cyan-700',
  ];
  const colorClass = avatarColors[index % avatarColors.length];

  return (
    <div
      style={{ animationDelay: `${index * 40}ms` }}
      className="card group animate-slide-up relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-semibold shadow-md`}>
            {message.authorName.slice(0, 1)}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 font-serif text-base">
              {message.authorName}
            </h4>
            <p className="text-sm text-primary-600 font-medium">
              {message.authorRelationship}
            </p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
            title="删除留言"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mb-4 pl-1">
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400 pt-3 border-t border-slate-100">
        <Clock className="w-4 h-4" />
        <span>{formatDate(message.createdAt)}</span>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">确认删除</h3>
              <p className="text-sm text-slate-500 mb-6 text-center">
                确定要删除这条追思留言吗？此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    onDelete(message.id);
                    setShowDeleteConfirm(false);
                  }}
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

export const MemorialWall = () => {
  const {
    activeMemorialMessages: messages,
    deceased,
    currentUser,
    addMemorialMessage,
    deleteMemorialMessage,
  } = useStore();

  const canDeleteMessages = isAdmin(currentUser);

  const stats = useMemo(() => {
    const total = messages.length;
    const today = new Date().toDateString();
    const todayMessages = messages.filter(
      (m) => new Date(m.createdAt).toDateString() === today
    ).length;

    const uniqueRelations = new Set(messages.map((m) => m.authorRelationship));

    return { total, todayMessages, uniqueRelations: uniqueRelations.size };
  }, [messages]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [messages]);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">追思留言总数</p>
              <p className="text-2xl font-bold font-serif">{stats.total} 条</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CalendarHeart className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">今日新增</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.todayMessages} 条
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">亲友参与</p>
              <p className="text-2xl font-bold text-slate-800 font-serif">
                {stats.uniqueRelations} 类关系
              </p>
            </div>
          </div>
        </div>
      </div>

      {canDeleteMessages && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>您以管理员身份登录，可以删除不当留言。将鼠标悬停在留言卡片上即可看到删除按钮。</span>
        </div>
      )}

      {deceased && (
        <MessageForm
          deceasedId={deceased.id}
          onSubmit={addMemorialMessage}
        />
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 font-serif flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary-500" />
          亲友留言
          {sortedMessages.length > 0 && (
            <span className="text-sm font-normal text-slate-400">
              （共 {sortedMessages.length} 条）
            </span>
          )}
        </h3>
      </div>

      {sortedMessages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedMessages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              index={index}
              canDelete={canDeleteMessages}
              onDelete={deleteMemorialMessage}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-20 bg-gradient-to-br from-slate-50 to-white">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary-100 to-amber-100 flex items-center justify-center">
            <MessageSquareHeart className="w-10 h-10 text-primary-400" />
          </div>
          <p className="text-lg font-medium text-slate-500 mb-2 font-serif">暂无追思留言</p>
          <p className="text-sm text-slate-400 mb-6">
            {deceased
              ? `成为第一位为${deceased.name}老人留下追思话语的人`
              : '请先创建逝者信息'}
          </p>
        </div>
      )}
    </div>
  );
};
