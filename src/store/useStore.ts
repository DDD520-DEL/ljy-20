import { create } from 'zustand';
import type { Deceased, FamilyMember, Task, TaskCategory, TaskStatus } from '@/types';
import { categories } from '@/data/categories';
import { createTasksFromTemplate } from '@/data/taskTemplate';
import { saveToStorage, loadFromStorage } from '@/utils/storage';
import { generateId } from '@/utils/progressUtils';

interface AppState {
  deceased: Deceased | null;
  members: FamilyMember[];
  tasks: Task[];
  categories: TaskCategory[];
  currentUser: FamilyMember | null;
  showSetup: boolean;
  showMemberModal: boolean;
  showTaskModal: boolean;
  showAssignModal: boolean;
  selectedTaskId: string | null;
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
  setShowSetup: (show: boolean) => void;
  setShowMemberModal: (show: boolean) => void;
  setShowTaskModal: (show: boolean) => void;
  setShowAssignModal: (show: boolean, taskId?: string) => void;
  setActiveTab: (tab: string) => void;
  resetData: () => void;
  loadFromLocalStorage: () => void;
}

interface PersistedData {
  deceased: Deceased | null;
  members: FamilyMember[];
  tasks: Task[];
  currentUser: FamilyMember | null;
}

const getInitialState = (): Omit<AppState, keyof ReturnType<typeof create>> => {
  const persisted = loadFromStorage<PersistedData>();
  if (persisted) {
    return {
      deceased: persisted.deceased,
      members: persisted.members,
      tasks: persisted.tasks,
      currentUser: persisted.currentUser,
      categories,
      showSetup: !persisted.deceased,
      showMemberModal: false,
      showTaskModal: false,
      showAssignModal: false,
      selectedTaskId: null,
      activeTab: 'dashboard',
    };
  }

  return {
    deceased: null,
    members: [],
    tasks: [],
    categories,
    currentUser: null,
    showSetup: true,
    showMemberModal: false,
    showTaskModal: false,
    showAssignModal: false,
    selectedTaskId: null,
    activeTab: 'dashboard',
  };
};

export const useStore = create<AppState>((set, get) => {
  const persist = () => {
    const { deceased, members, tasks, currentUser } = get();
    saveToStorage({ deceased, members, tasks, currentUser });
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
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      persist();
    },

    assignTask: (taskId, memberId) => {
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
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status,
                completedAt: status === 'completed' ? new Date().toISOString() : undefined,
              }
            : t
        ),
      }));
      persist();
    },

    setShowSetup: (show) => set({ showSetup: show }),
    setShowMemberModal: (show) => set({ showMemberModal: show }),
    setShowTaskModal: (show) => set({ showTaskModal: show }),
    setShowAssignModal: (show, taskId) =>
      set({ showAssignModal: show, selectedTaskId: taskId || null }),
    setActiveTab: (tab) => set({ activeTab: tab }),

    resetData: () => {
      localStorage.removeItem('funeral_planner_data');
      set({
        deceased: null,
        members: [],
        tasks: [],
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
          showSetup: !persisted.deceased,
        });
      }
    },
  };
});
