import { useState } from 'react';
import { MessageCircle, Reply, Trash2, Send } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Note, Task } from '@/types';
import { MemberAvatar } from '@/components/members/MemberAvatar';
import { formatRelativeTime } from '@/utils/progressUtils';

interface TaskNotesProps {
  task: Task;
}

export const TaskNotes = ({ task }: TaskNotesProps) => {
  const { members, currentUser, addNote, deleteNote } = useStore();

  const [newNote, setNewNote] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const notes = task.notes || [];
  const topLevelNotes = notes.filter((n) => !n.parentId);
  const getReplies = (parentId: string) => notes.filter((n) => n.parentId === parentId);

  const getAuthor = (authorId: string) => members.find((m) => m.id === authorId);

  const canComment = !!currentUser;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newNote.trim()) return;
    addNote(task.id, newNote, currentUser.id);
    setNewNote('');
  };

  const handleReply = (parentId: string) => {
    if (!currentUser || !replyContent.trim()) return;
    addNote(task.id, replyContent, currentUser.id, parentId);
    setReplyContent('');
    setReplyToId(null);
  };

  const handleDelete = (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    const hasReplies = target ? getReplies(target.id).length > 0 : false;
    const message = hasReplies
      ? '确定要删除这条备注吗？其下的所有回复也将一并删除。'
      : '确定要删除这条备注吗？';
    if (confirm(message)) {
      deleteNote(task.id, noteId);
    }
  };

  const renderNote = (note: Note, isReply = false) => {
    const author = getAuthor(note.authorId);
    const isOwn = currentUser?.id === note.authorId;

    return (
      <div
        key={note.id}
        className={`flex gap-3 ${isReply ? 'mt-3 ml-10' : 'mt-4 first:mt-0'}`}
      >
        <div className="flex-shrink-0">
          <MemberAvatar member={author} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-700">
              {author?.name || '未知成员'}
            </span>
            <span className="text-xs text-slate-400">
              {formatRelativeTime(note.createdAt)}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5 whitespace-pre-wrap break-words">
            {note.content}
          </p>
          <div className="flex items-center gap-3 mt-1">
            {canComment && !isReply && (
              <button
                onClick={() => {
                  setReplyToId(replyToId === note.id ? null : note.id);
                  setReplyContent('');
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary-600 transition-colors"
              >
                <Reply className="w-3 h-3" />
                回复
              </button>
            )}
            {isOwn && (
              <button
                onClick={() => handleDelete(note.id)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                删除
              </button>
            )}
          </div>

          {replyToId === note.id && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleReply(note.id);
                  }
                }}
                placeholder={`回复 ${author?.name || '成员'}...`}
                className="input-field text-sm py-1.5"
                autoFocus
              />
              <button
                onClick={() => handleReply(note.id)}
                disabled={!replyContent.trim()}
                className="btn-primary px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-primary-600" />
        <h5 className="text-sm font-semibold text-slate-700">
          备注与讨论
        </h5>
        {topLevelNotes.length > 0 && (
          <span className="badge bg-primary-100 text-primary-700">
            {notes.length} 条
          </span>
        )}
        {task.status === 'completed' && notes.length > 0 && (
          <span className="text-xs text-slate-400">· 历史记录已保留</span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto pr-1">
        {topLevelNotes.length > 0 ? (
          <div>
            {topLevelNotes.map((note) => (
              <div key={note.id}>
                {renderNote(note)}
                {getReplies(note.id).map((reply) => renderNote(reply, true))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-2">
            暂无备注，添加第一条留言开始讨论任务进展。
          </p>
        )}
      </div>

      {canComment ? (
        <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="添加备注或留言..."
            className="input-field text-sm"
          />
          <button
            type="submit"
            disabled={!newNote.trim()}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            发送
          </button>
        </form>
      ) : (
        <p className="text-xs text-slate-400 mt-3">
          请先选择当前家庭成员后再参与讨论。
        </p>
      )}
    </div>
  );
};
