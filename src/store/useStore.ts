import { create } from 'zustand';
import type { Deceased, FamilyMember, Task, TaskCategory, TaskStatus, Notification, Note } from '@/types';
import { categories } from '@/data/categories';
import { createTasksFromTemplate } from '@/data/taskTemplate';
import { saveToStorage, loadFromStorage } from '@/utils/storage';
import { generateId, getDaysRemaining, isTaskBlocked } from '@/utils/progressUtils';

interface AppState {
  deceased: Deceased | null;
  members: FamilyMember[];
  tasks: Task[];
  categories: TaskCategory[];
  currentUser: FamilyMember | null;
  notifications: Notification[];
  showNotificationPanel: boolean;
  showSetup: boolean;
  showMemberModal: boolean;
  showTaskModal: boolean;
  showAssignModal: boolean;
  showDependencyModal: boolean;
  selectedTaskId: string | null;
  dependencyTaskId: string | null;
  activeTab: string;

  setDeceased: (deceased: Deceased) => void;
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  removeMember: (id: string) => void;
  setCurrentUser: (member: FamilyMember) => void;
  initializeFromTemplate: (deceased: Deceased) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  assignTask: (taskId: string, memberId: string) => void;
  unassignTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  setTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleTaskDependency: (taskId: string, dependsOnId: string) => void;
  setShowDependencyModal: (show: boolean, taskId?: string | null) => void;
  addNote: (taskId: string, content: string, authorId: string, parentId?: string) => void;
  deleteNote: (taskId: string, noteId: string) => void;
  setShowSetup: (show: boolean) => void;
  setShowMemberModal: (show: boolean) => void;
  setShowTaskModal: (show: boolean) => void;
  setShowAssignModal: (show: boolean, taskId?: string) => void;
  setShowNotificationPanel: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  checkDeadlineNotifications: () => void;
  resetData: () => void;
  loadFromLocalStorage: () => void;
}

interface PersistedData {
  deceased: Deceased | null;
  members: FamilyMember[];
  tasks: Task[];
  currentUser: FamilyMember | null;
  notifications: Notification[];
}

const getInitialState = () => {
  const persisted = loadFromStorage<PersistedData>();
  if (persisted) {
    return {
      deceased: persisted.deceased,
      members: persisted.members,
      tasks: persisted.tasks,
      currentUser: persisted.currentUser,
      notifications: persisted.notifications || [],
      categories,
      showSetup: !persisted.deceased,
      showMemberModal: false,
      showTaskModal: false,
      showAssignModal: false,
      showDependencyModal: false,
      showNotificationPanel: false,
      selectedTaskId: null,
      dependencyTaskId: null,
      activeTab: 'dashboard',
    };
  }

  return {
    deceased: null,
    members: [],
    tasks: [],
    notifications: [],
    categories,
    currentUser: null,
    showSetup: true,
    showMemberModal: false,
    showTaskModal: false,
    showAssignModal: false,
    showDependencyModal: false,
    showNotificationPanel: false,
    selectedTaskId: null,
    dependencyTaskId: null,
    activeTab: 'dashboard',
  };
};

export const useStore = create<AppState>((set, get) => {
  const persist = () => {
    const { deceased, members, tasks, currentUser, notifications } = get();
    saveToStorage({ deceased, members, tasks, currentUser, notifications });
  };

  return {
    ...getInitialState(),

    setDeceased: (deceased) => {
      set({ deceased, showSetup: false });
      persist();
    },

    addMember: (member) => {
      const newMember: FamilyMember = {
        ...member,
        id: generateId(),
      };
      set((state) => ({
        members: [...state.members, newMember],
        currentUser: state.currentUser || newMember,
      }));
      persist();
    },

    removeMember: (id) => {
      set((state) => ({
        members: state.members.filter((m) => m.id !== id),
        tasks: state.tasks.map((t) =>
          t.assigneeId === id ? { ...t, assigneeId: undefined } : t
        ),
      }));
      persist();
    },

    setCurrentUser: (member) => {
      set({ currentUser: member });
      persist();
    },

    initializeFromTemplate: (deceased) => {
      const taskData = createTasksFromTemplate(deceased.id, deceased.deathDate);
      const tasks: Task[] = taskData.map((t) => ({
        ...t,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }));
      set({ deceased, tasks, showSetup: false });
      persist();
    },

    addTask: (task) => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      persist();
    },

    updateTask: (id, updates) => {
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
      persist();
    },

    deleteTask: (id) => {
      set((state) => ({
        tasks: state.tasks
          .filter((t) => t.id !== id)
          .map((t) =>
            t.dependsOn && t.dependsOn.includes(id)
              ? { ...t, dependsOn: t.dependsOn.filter((depId) => depId !== id) }
              : t
          ),
      }));
      persist();
    },

    assignTask: (taskId, memberId) => {
      const task = get().tasks.find((t) => t.id === taskId);
      if (task && task.assigneeId !== memberId) {
        const newNotification: Omit<Notification, 'id' | 'createdAt'> = {
          type: 'task_assigned',
          taskId,
          taskTitle: task.title,
          userId: memberId,
          read: false,
          message: `您有新的任务需要处理：${task.title}`,
        };
        get().addNotification(newNotification);
      }
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, assigneeId: memberId } : t
        ),
      }));
      persist();
    },

    unassignTask: (taskId) => {
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, assigneeId: undefined } : t
        ),
      }));
      persist();
    },

    toggleTaskStatus: (taskId) => {
      set((state) => {
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task) return state;

        let newStatus: TaskStatus = task.status;
        if (task.status === 'pending') newStatus = 'in-progress';
        else if (task.status === 'in-progress') newStatus = 'completed';
        else newStatus = 'pending';

        if (newStatus === 'in-progress' && isTaskBlocked(task, state.tasks)) {
          return state;
        }

        return {
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
                }
              : t
          ),
        };
      });
      persist();
    },

    setTaskStatus: (taskId, status) => {
      set((state) => {
        const task = state.tasks.find((t) => t.id === taskId);
        if (status === 'in-progress' && task && isTaskBlocked(task, state.tasks)) {
          return state;
        }
        return {
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  completedAt: status === 'completed' ? new Date().toISOString() : undefined,
                }
              : t
          ),
        };
      });
      persist();
    },

    toggleTaskDependency: (taskId, dependsOnId) => {
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const deps = new Set(t.dependsOn || []);
          if (deps.has(dependsOnId)) {
            deps.delete(dependsOnId);
          } else {
            deps.add(dependsOnId);
          }
          return { ...t, dependsOn: Array.from(deps) };
        }),
      }));
      persist();
    },

    addNote: (taskId, content, authorId, parentId) => {
      const newNote: Note = {
        id: generateId(),
        taskId,
        content: content.trim(),
        authorId,
        createdAt: new Date().toISOString(),
        parentId,
      };
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, notes: [...(t.notes || []), newNote] }
            : t
        ),
      }));
      persist();
    },

    deleteNote: (taskId, noteId) => {
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const toRemove = new Set<string>([noteId]);
          (t.notes || []).forEach((n) => {
            if (n.parentId && toRemove.has(n.parentId)) {
              toRemove.add(n.id);
            }
          });
          return {
            ...t,
            notes: (t.notes || []).filter((n) => !toRemove.has(n.id)),
          };
        }),
      }));
      persist();
    },

    setShowSetup: (show) => set({ showSetup: show }),
    setShowMemberModal: (show) => set({ showMemberModal: show }),
    setShowTaskModal: (show) => set({ showTaskModal: show }),
    setShowAssignModal: (show, taskId) =>
      set({ showAssignModal: show, selectedTaskId: taskId || null }),
    setShowDependencyModal: (show, taskId) =>
      set({ showDependencyModal: show, dependencyTaskId: taskId ?? null }),
    setShowNotificationPanel: (show) => set({ showNotificationPanel: show }),
    setActiveTab: (tab) => set({ activeTab: tab }),

    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
      persist();
    },

    markNotificationRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
      persist();
    },

    markAllNotificationsRead: () => {
      const currentUser = get().currentUser;
      if (!currentUser) return;
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.userId === currentUser.id ? { ...n, read: true } : n
        ),
      }));
      persist();
    },

    checkDeadlineNotifications: () => {
      const { tasks, notifications } = get();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      tasks.forEach((task) => {
        if (task.status === 'completed' || !task.dueDate || !task.assigneeId) return;

        const daysRemaining = getDaysRemaining(task.dueDate);
        const existingNotification = notifications.find(
          (n) =>
            n.taskId === task.id &&
            n.type === (daysRemaining < 0 ? 'task_overdue' : 'deadline_approaching') &&
            n.daysRemaining === daysRemaining
        );

        if (existingNotification) return;

        if (daysRemaining < 0) {
          const overdueNotification: Omit<Notification, 'id' | 'createdAt'> = {
            type: 'task_overdue',
            taskId: task.id,
            taskTitle: task.title,
            userId: task.assigneeId,
            read: false,
            message: `任务已逾期 ${Math.abs(daysRemaining)} 天：${task.title}`,
            daysRemaining,
          };
          const hasOverdueNotif = notifications.find(
            (n) => n.taskId === task.id && n.type === 'task_overdue'
          );
          if (!hasOverdueNotif) {
            set((state) => ({
              notifications: [
                { ...overdueNotification, id: generateId(), createdAt: new Date().toISOString() },
                ...state.notifications,
              ],
            }));
          }
        } else if (daysRemaining <= 3) {
          const approachingNotification: Omit<Notification, 'id' | 'createdAt'> = {
            type: 'deadline_approaching',
            taskId: task.id,
            taskTitle: task.title,
            userId: task.assigneeId,
            read: false,
            message: `任务即将到期（还剩 ${daysRemaining} 天）：${task.title}`,
            daysRemaining,
          };
          const hasApproachingNotif = notifications.find(
            (n) => n.taskId === task.id && n.type === 'deadline_approaching' && n.daysRemaining === daysRemaining
          );
          if (!hasApproachingNotif) {
            set((state) => ({
              notifications: [
                { ...approachingNotification, id: generateId(), createdAt: new Date().toISOString() },
                ...state.notifications,
              ],
            }));
          }
        }
      });
      persist();
    },

    resetData: () => {
      localStorage.removeItem('funeral_planner_data');
      set({
        deceased: null,
        members: [],
        tasks: [],
        notifications: [],
        currentUser: null,
        showSetup: true,
      });
    },

    loadFromLocalStorage: () => {
      const persisted = loadFromStorage<PersistedData>();
      if (persisted) {
        set({
          deceased: persisted.deceased,
          members: persisted.members,
          tasks: persisted.tasks,
          currentUser: persisted.currentUser,
          notifications: persisted.notifications || [],
          showSetup: !persisted.deceased,
        });
      }
    },
  };
});
