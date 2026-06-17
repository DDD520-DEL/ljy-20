import type { Task, TaskStatus } from '@/types';

export const getStatusText = (status: TaskStatus): string => {
  const statusMap: Record<TaskStatus, string> = {
    pending: '待办',
    'in-progress': '进行中',
    completed: '已完成',
  };
  return statusMap[status];
};

export const getStatusClass = (status: TaskStatus): string => {
  const classMap: Record<TaskStatus, string> = {
    pending: 'badge-pending',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
  };
  return classMap[status];
};

export const getPriorityText = (priority: number): string => {
  const priorityMap: Record<number, string> = {
    1: '紧急',
    2: '重要',
    3: '一般',
  };
  return priorityMap[priority] || '一般';
};

export const getPriorityColor = (priority: number): string => {
  const colorMap: Record<number, string> = {
    1: '#c62828',
    2: '#ef6c00',
    3: '#6a1b9a',
  };
  return colorMap[priority] || '#6a1b9a';
};

export const calculateProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
};

export const getStatusCounts = (tasks: Task[]) => {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };
};

export const getCategoryProgress = (tasks: Task[], categoryId: string): number => {
  const categoryTasks = tasks.filter((t) => t.categoryId === categoryId);
  return calculateProgress(categoryTasks);
};

export const getMemberProgress = (tasks: Task[], memberId: string): number => {
  const memberTasks = tasks.filter((t) => t.assigneeId === memberId);
  return calculateProgress(memberTasks);
};

export const getMemberTaskCount = (tasks: Task[], memberId: string): number => {
  return tasks.filter((t) => t.assigneeId === memberId).length;
};

export const getUnassignedTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((t) => !t.assigneeId);
};

export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((t) => {
    if (t.status === 'completed' || !t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  });
};

export const getTodayTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks.filter((t) => {
    if (t.status === 'completed' || !t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() >= today.getTime() && dueDate.getTime() < tomorrow.getTime();
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  });
};

export const getDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const memberColors = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
];
