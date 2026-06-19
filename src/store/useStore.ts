import { create } from 'zustand';
import type { Deceased, FamilyMember, Task, TaskCategory, TaskStatus, Notification, Note, SavedTemplate, TemplateTaskItem, MemorialNodeType, MemberRole, FuneralItem, FuneralItemCategory, Expense, ExpenseCategory, Guest, MemorialMessage, CondolenceGift, CeremonyStep, CeremonyStepStatus, FuneralDocument, Eulogy, EulogyStatus } from '@/types';
import { categories } from '@/data/categories';
import { createTasksFromTemplate, getDefaultTemplate, DEFAULT_TEMPLATE_ID } from '@/data/taskTemplate';
import { createDefaultItemsForDeceased } from '@/data/funeralItems';
import { DEFAULT_CEREMONY_STEPS } from '@/types';
import { saveToStorage, loadFromStorage, saveTemplatesToStorage, loadTemplatesFromStorage } from '@/utils/storage';
import { generateId, getDaysRemaining, isTaskBlocked, getTodayMemorialNodes, getMemorialTaskTitle, getMemorialTaskDescription } from '@/utils/progressUtils';

interface AppState {
  deceaseds: Deceased[];
  activeDeceasedId: string | null;
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
  savedTemplates: SavedTemplate[];
  generatedMemorialTasks: Record<string, Record<MemorialNodeType, boolean>>;
  funeralItems: FuneralItem[];
  expenses: Expense[];
  guests: Guest[];
  memorialMessages: MemorialMessage[];
  condolenceGifts: CondolenceGift[];

  ceremonySteps: CeremonyStep[];
  documents: FuneralDocument[];
  eulogies: Eulogy[];

  deceased: Deceased | null;
  activeTasks: Task[];
  activeGeneratedMemorialTasks: Record<MemorialNodeType, boolean>;
  activeFuneralItems: FuneralItem[];
  activeExpenses: Expense[];
  activeGuests: Guest[];
  activeMemorialMessages: MemorialMessage[];
  activeCondolenceGifts: CondolenceGift[];
  activeCeremonySteps: CeremonyStep[];
  activeDocuments: FuneralDocument[];
  activeEulogies: Eulogy[];

  addDeceased: (deceased: Deceased, templateTasks?: TemplateTaskItem[]) => void;
  switchDeceased: (deceasedId: string) => void;
  deleteDeceased: (deceasedId: string) => void;
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  removeMember: (id: string) => void;
  updateMemberRole: (id: string, permissionRole: MemberRole) => void;
  setCurrentUser: (member: FamilyMember) => void;
  initializeFromTemplate: (deceased: Deceased, templateTasks?: TemplateTaskItem[]) => void;
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
  saveTemplate: (name: string, description: string, tasks: TemplateTaskItem[]) => SavedTemplate;
  deleteTemplate: (templateId: string) => void;
  updateTemplate: (templateId: string, updates: Partial<SavedTemplate>) => void;
  loadSavedTemplates: () => void;
  checkMemorialAnniversaries: () => void;
  addFuneralItem: (item: Omit<FuneralItem, 'id' | 'createdAt'>) => void;
  updateFuneralItem: (id: string, updates: Partial<FuneralItem>) => void;
  deleteFuneralItem: (id: string) => void;
  toggleFuneralItemPurchased: (id: string) => void;
  resetFuneralItems: (deceasedId: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  addMemorialMessage: (message: Omit<MemorialMessage, 'id' | 'createdAt'>) => void;
  deleteMemorialMessage: (id: string) => void;
  addCondolenceGift: (gift: Omit<CondolenceGift, 'id' | 'createdAt'>) => void;
  updateCondolenceGift: (id: string, updates: Partial<CondolenceGift>) => void;
  deleteCondolenceGift: (id: string) => void;

  addCeremonyStep: (step: Omit<CeremonyStep, 'id' | 'createdAt'>) => void;
  updateCeremonyStep: (id: string, updates: Partial<CeremonyStep>) => void;
  deleteCeremonyStep: (id: string) => void;
  setCeremonyStepStatus: (id: string, status: CeremonyStepStatus) => void;
  reorderCeremonySteps: (steps: CeremonyStep[]) => void;
  resetCeremonySteps: (deceasedId: string) => void;

  addDocument: (doc: Omit<FuneralDocument, 'id' | 'uploadDate'>) => void;
  updateDocument: (id: string, updates: Partial<FuneralDocument>) => void;
  deleteDocument: (id: string) => void;

  addEulogy: (eulogy: Omit<Eulogy, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEulogy: (id: string, updates: Partial<Eulogy>) => void;
  deleteEulogy: (id: string) => void;
  setEulogyStatus: (id: string, status: EulogyStatus) => void;
}

interface PersistedData {
  deceaseds: Deceased[];
  activeDeceasedId: string | null;
  members: FamilyMember[];
  tasks: Task[];
  currentUser: FamilyMember | null;
  notifications: Notification[];
  generatedMemorialTasks: Record<string, Record<MemorialNodeType, boolean>>;
  funeralItems: FuneralItem[];
  expenses: Expense[];
  guests: Guest[];
  memorialMessages: MemorialMessage[];
  condolenceGifts: CondolenceGift[];
  ceremonySteps: CeremonyStep[];
  documents: FuneralDocument[];
  eulogies: Eulogy[];
}

const getInitialSavedTemplates = (): SavedTemplate[] => {
  const persistedTemplates = loadTemplatesFromStorage<SavedTemplate[]>();
  const defaultTemplate = getDefaultTemplate();
  if (persistedTemplates && Array.isArray(persistedTemplates)) {
    const hasDefault = persistedTemplates.some((t) => t.id === DEFAULT_TEMPLATE_ID);
    if (!hasDefault) {
      return [defaultTemplate, ...persistedTemplates];
    }
    return persistedTemplates;
  }
  return [defaultTemplate];
};

const getInitialGeneratedMemorialTasks = (): Record<string, Record<MemorialNodeType, boolean>> => ({});

const getEmptyGeneratedMemorialTasks = (): Record<MemorialNodeType, boolean> => ({
  first7: false,
  third7: false,
  fifth7: false,
  hundredth: false,
  firstYear: false,
  secondYear: false,
  thirdYear: false,
});

const createDefaultCeremonyStepsForDeceased = (deceasedId: string): CeremonyStep[] => {
  return DEFAULT_CEREMONY_STEPS.map((step, index) => ({
    ...step,
    id: generateId(),
    deceasedId,
    order: index + 1,
    createdAt: new Date().toISOString(),
  }));
};

const ensureMemberRoles = (members: FamilyMember[]): FamilyMember[] => {
  return members.map((m) =>
    m.permissionRole ? m : { ...m, permissionRole: 'admin' as MemberRole }
  );
};

const migrateOldData = (persisted: any): PersistedData | null => {
  if (!persisted) return null;

  if ('deceaseds' in persisted && Array.isArray(persisted.deceaseds)) {
    const migratedTasks = (persisted.tasks || []).map((t: Task) => {
      if (t.deceasedId) return t;
      const onlyDeceased = persisted.deceaseds.length === 1 ? persisted.deceaseds[0] : null;
      return onlyDeceased ? { ...t, deceasedId: onlyDeceased.id } : t;
    });
    return {
      ...persisted,
      tasks: migratedTasks,
      members: ensureMemberRoles(persisted.members || []),
      currentUser: persisted.currentUser
        ? { ...persisted.currentUser, permissionRole: persisted.currentUser.permissionRole || 'admin' as MemberRole }
        : null,
      funeralItems: persisted.funeralItems || [],
      expenses: persisted.expenses || [],
      guests: persisted.guests || [],
      memorialMessages: persisted.memorialMessages || [],
      condolenceGifts: persisted.condolenceGifts || [],
      ceremonySteps: persisted.ceremonySteps || [],
      documents: persisted.documents || [],
      eulogies: persisted.eulogies || [],
    } as PersistedData;
  }

  if ('deceased' in persisted && persisted.deceased) {
    const oldDeceased: Deceased = persisted.deceased;
    const migratedTasks = (persisted.tasks || []).map((t: Task) => ({
      ...t,
      deceasedId: oldDeceased.id,
    }));
    return {
      deceaseds: [oldDeceased],
      activeDeceasedId: oldDeceased.id,
      members: ensureMemberRoles(persisted.members || []),
      tasks: migratedTasks,
      currentUser: persisted.currentUser
        ? { ...persisted.currentUser, permissionRole: persisted.currentUser.permissionRole || 'admin' as MemberRole }
        : null,
      notifications: persisted.notifications || [],
      generatedMemorialTasks: {
        [oldDeceased.id]: persisted.generatedMemorialTasks || getEmptyGeneratedMemorialTasks(),
      },
      funeralItems: [],
      expenses: [],
      guests: [],
      memorialMessages: [],
      condolenceGifts: [],
      ceremonySteps: [],
      documents: [],
      eulogies: [],
    };
  }

  return null;
};

const fixOrphanTasks = (deceaseds: Deceased[], tasks: Task[]): Task[] => {
  const hasOrphan = tasks.some((t) => !t.deceasedId);
  if (!hasOrphan) return tasks;
  const onlyDeceased = deceaseds.length === 1 ? deceaseds[0] : null;
  if (!onlyDeceased) return tasks;
  return tasks.map((t) =>
    t.deceasedId ? t : { ...t, deceasedId: onlyDeceased.id }
  );
};

const getInitialState = () => {
  const persistedRaw = loadFromStorage<any>();
  const persisted = migrateOldData(persistedRaw);
  const savedTemplates = getInitialSavedTemplates();

  if (persisted) {
    const fixedTasks = fixOrphanTasks(persisted.deceaseds, persisted.tasks);
    const activeDeceased = persisted.deceaseds.find((d) => d.id === persisted.activeDeceasedId) || null;
    return {
      deceaseds: persisted.deceaseds,
      activeDeceasedId: persisted.activeDeceasedId,
      deceased: activeDeceased,
      members: persisted.members,
      tasks: fixedTasks,
      activeTasks: activeDeceased
        ? fixedTasks.filter((t) => t.deceasedId === activeDeceased.id)
        : [],
      currentUser: persisted.currentUser,
      notifications: persisted.notifications || [],
      generatedMemorialTasks: persisted.generatedMemorialTasks || getInitialGeneratedMemorialTasks(),
      activeGeneratedMemorialTasks: activeDeceased
        ? (persisted.generatedMemorialTasks || {})[activeDeceased.id] || getEmptyGeneratedMemorialTasks()
        : getEmptyGeneratedMemorialTasks(),
      funeralItems: persisted.funeralItems || [],
      activeFuneralItems: activeDeceased
        ? (persisted.funeralItems || []).filter((i) => i.deceasedId === activeDeceased.id)
        : [],
      expenses: persisted.expenses || [],
      activeExpenses: activeDeceased
        ? (persisted.expenses || []).filter((e) => e.deceasedId === activeDeceased.id)
        : [],
      guests: persisted.guests || [],
      activeGuests: activeDeceased
        ? (persisted.guests || []).filter((g) => g.deceasedId === activeDeceased.id)
        : [],
      memorialMessages: persisted.memorialMessages || [],
      activeMemorialMessages: activeDeceased
        ? (persisted.memorialMessages || []).filter((m) => m.deceasedId === activeDeceased.id)
        : [],
      condolenceGifts: persisted.condolenceGifts || [],
      activeCondolenceGifts: activeDeceased
        ? (persisted.condolenceGifts || []).filter((c) => c.deceasedId === activeDeceased.id)
        : [],
      ceremonySteps: persisted.ceremonySteps || [],
      activeCeremonySteps: activeDeceased
        ? (persisted.ceremonySteps || []).filter((s) => s.deceasedId === activeDeceased.id).sort((a, b) => a.order - b.order)
        : [],
      documents: persisted.documents || [],
      activeDocuments: activeDeceased
        ? (persisted.documents || []).filter((d) => d.deceasedId === activeDeceased.id)
        : [],
      eulogies: persisted.eulogies || [],
      activeEulogies: activeDeceased
        ? (persisted.eulogies || []).filter((e) => e.deceasedId === activeDeceased.id)
        : [],
      categories,
      showSetup: persisted.deceaseds.length === 0,
      showMemberModal: false,
      showTaskModal: false,
      showAssignModal: false,
      showDependencyModal: false,
      showNotificationPanel: false,
      selectedTaskId: null,
      dependencyTaskId: null,
      activeTab: 'dashboard',
      savedTemplates,
    };
  }

  return {
    deceaseds: [],
    activeDeceasedId: null,
    deceased: null,
    members: [],
    tasks: [],
    activeTasks: [],
    notifications: [],
    generatedMemorialTasks: getInitialGeneratedMemorialTasks(),
    activeGeneratedMemorialTasks: getEmptyGeneratedMemorialTasks(),
    funeralItems: [],
    activeFuneralItems: [],
    expenses: [],
    activeExpenses: [],
    guests: [],
    activeGuests: [],
    memorialMessages: [],
    activeMemorialMessages: [],
    condolenceGifts: [],
    activeCondolenceGifts: [],
    ceremonySteps: [],
    activeCeremonySteps: [],
    documents: [],
    activeDocuments: [],
    eulogies: [],
    activeEulogies: [],
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
    savedTemplates,
  };
};

export const useStore = create<AppState>((set, get) => {
  const persist = () => {
    const { deceaseds, activeDeceasedId, members, tasks, currentUser, notifications, generatedMemorialTasks, funeralItems, expenses, guests, memorialMessages, condolenceGifts, ceremonySteps, documents, eulogies } = get();
    saveToStorage({ deceaseds, activeDeceasedId, members, tasks, currentUser, notifications, generatedMemorialTasks, funeralItems, expenses, guests, memorialMessages, condolenceGifts, ceremonySteps, documents, eulogies });
  };

  const persistTemplates = () => {
    const { savedTemplates } = get();
    const templatesToSave = savedTemplates.filter((t) => !t.isDefault);
    saveTemplatesToStorage(templatesToSave);
  };

  const computeDerived = (state: Partial<AppState>): Partial<AppState> => {
    const deceaseds = state.deceaseds ?? get().deceaseds;
    const activeDeceasedId = state.activeDeceasedId ?? get().activeDeceasedId;
    const tasks = state.tasks ?? get().tasks;
    const generatedMemorialTasks = state.generatedMemorialTasks ?? get().generatedMemorialTasks;
    const funeralItems = state.funeralItems ?? get().funeralItems;
    const expenses = state.expenses ?? get().expenses;
    const guests = state.guests ?? get().guests;
    const memorialMessages = state.memorialMessages ?? get().memorialMessages;
    const condolenceGifts = state.condolenceGifts ?? get().condolenceGifts;
    const ceremonySteps = state.ceremonySteps ?? get().ceremonySteps;
    const documents = state.documents ?? get().documents;
    const eulogies = state.eulogies ?? get().eulogies;

    const activeDeceased = deceaseds.find((d) => d.id === activeDeceasedId) || null;
    return {
      deceased: activeDeceased,
      activeTasks: activeDeceased ? tasks.filter((t) => t.deceasedId === activeDeceased.id) : [],
      activeGeneratedMemorialTasks: activeDeceased
        ? generatedMemorialTasks[activeDeceased.id] || getEmptyGeneratedMemorialTasks()
        : getEmptyGeneratedMemorialTasks(),
      activeFuneralItems: activeDeceased
        ? funeralItems.filter((i) => i.deceasedId === activeDeceased.id)
        : [],
      activeExpenses: activeDeceased
        ? expenses.filter((e) => e.deceasedId === activeDeceased.id)
        : [],
      activeGuests: activeDeceased
        ? guests.filter((g) => g.deceasedId === activeDeceased.id)
        : [],
      activeMemorialMessages: activeDeceased
        ? memorialMessages.filter((m) => m.deceasedId === activeDeceased.id)
        : [],
      activeCondolenceGifts: activeDeceased
        ? condolenceGifts.filter((c) => c.deceasedId === activeDeceased.id)
        : [],
      activeCeremonySteps: activeDeceased
        ? ceremonySteps.filter((s) => s.deceasedId === activeDeceased.id).sort((a, b) => a.order - b.order)
        : [],
      activeDocuments: activeDeceased
        ? documents.filter((d) => d.deceasedId === activeDeceased.id)
        : [],
      activeEulogies: activeDeceased
        ? eulogies.filter((e) => e.deceasedId === activeDeceased.id)
        : [],
    };
  };

  return {
    ...getInitialState(),

    addDeceased: (deceased, templateTasks) => {
      const taskData = templateTasks
        ? createTasksFromTemplate(deceased.id, deceased.deathDate, templateTasks)
        : [];
      const newTasks: Task[] = taskData.map((t) => ({
        ...t,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }));
      const newFuneralItems = createDefaultItemsForDeceased(deceased.id);
      const newCeremonySteps = createDefaultCeremonyStepsForDeceased(deceased.id);

      set((state) => {
        const newState = {
          deceaseds: [...state.deceaseds, deceased],
          activeDeceasedId: deceased.id,
          tasks: [...state.tasks, ...newTasks],
          funeralItems: [...state.funeralItems, ...newFuneralItems],
          ceremonySteps: [...state.ceremonySteps, ...newCeremonySteps],
          generatedMemorialTasks: {
            ...state.generatedMemorialTasks,
            [deceased.id]: getEmptyGeneratedMemorialTasks(),
          },
          showSetup: false,
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    switchDeceased: (deceasedId) => {
      set((state) => {
        const newState = { activeDeceasedId: deceasedId };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteDeceased: (deceasedId) => {
      set((state) => {
        const newDeceaseds = state.deceaseds.filter((d) => d.id !== deceasedId);
        const newTasks = state.tasks.filter((t) => t.deceasedId !== deceasedId);
        const newFuneralItems = state.funeralItems.filter((i) => i.deceasedId !== deceasedId);
        const newExpenses = state.expenses.filter((e) => e.deceasedId !== deceasedId);
        const newGuests = state.guests.filter((g) => g.deceasedId !== deceasedId);
        const newMemorialMessages = state.memorialMessages.filter((m) => m.deceasedId !== deceasedId);
        const newCondolenceGifts = state.condolenceGifts.filter((c) => c.deceasedId !== deceasedId);
        const newCeremonySteps = state.ceremonySteps.filter((s) => s.deceasedId !== deceasedId);
        const newDocuments = state.documents.filter((d) => d.deceasedId !== deceasedId);
        const newEulogies = state.eulogies.filter((e) => e.deceasedId !== deceasedId);
        const newGeneratedMemorialTasks = { ...state.generatedMemorialTasks };
        delete newGeneratedMemorialTasks[deceasedId];

        const newActiveId =
          state.activeDeceasedId === deceasedId
            ? newDeceaseds.length > 0
              ? newDeceaseds[0].id
              : null
            : state.activeDeceasedId;

        const newState = {
          deceaseds: newDeceaseds,
          tasks: newTasks,
          funeralItems: newFuneralItems,
          expenses: newExpenses,
          guests: newGuests,
          memorialMessages: newMemorialMessages,
          condolenceGifts: newCondolenceGifts,
          ceremonySteps: newCeremonySteps,
          documents: newDocuments,
          eulogies: newEulogies,
          activeDeceasedId: newActiveId,
          generatedMemorialTasks: newGeneratedMemorialTasks,
          showSetup: newDeceaseds.length === 0,
        };
        return { ...newState, ...computeDerived(newState) };
      });
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

    updateMemberRole: (id, permissionRole) => {
      set((state) => {
        const updatedMembers = state.members.map((m) =>
          m.id === id ? { ...m, permissionRole } : m
        );
        const updatedCurrentUser =
          state.currentUser?.id === id
            ? { ...state.currentUser, permissionRole }
            : state.currentUser;
        return {
          members: updatedMembers,
          currentUser: updatedCurrentUser,
        };
      });
      persist();
    },

    setCurrentUser: (member) => {
      set({ currentUser: member });
      persist();
    },

    initializeFromTemplate: (deceased, templateTasks) => {
      get().addDeceased(deceased, templateTasks);
    },

    addTask: (task) => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newState = { tasks: [...state.tasks, newTask] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateTask: (id, updates) => {
      set((state) => {
        const newState = {
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteTask: (id) => {
      set((state) => {
        const newState = {
          tasks: state.tasks
            .filter((t) => t.id !== id)
            .map((t) =>
              t.dependsOn && t.dependsOn.includes(id)
                ? { ...t, dependsOn: t.dependsOn.filter((depId) => depId !== id) }
                : t
            ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
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
      set((state) => {
        const newState = {
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, assigneeId: memberId } : t
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    unassignTask: (taskId) => {
      set((state) => {
        const newState = {
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, assigneeId: undefined } : t
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
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

        const newState = {
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
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    setTaskStatus: (taskId, status) => {
      set((state) => {
        const task = state.tasks.find((t) => t.id === taskId);
        if (status === 'in-progress' && task && isTaskBlocked(task, state.tasks)) {
          return state;
        }
        const newState = {
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
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    toggleTaskDependency: (taskId, dependsOnId) => {
      set((state) => {
        const newState = {
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
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    setShowDependencyModal: (show, taskId) =>
      set({ showDependencyModal: show, dependencyTaskId: taskId ?? null }),

    addNote: (taskId, content, authorId, parentId) => {
      const newNote: Note = {
        id: generateId(),
        taskId,
        content: content.trim(),
        authorId,
        createdAt: new Date().toISOString(),
        parentId,
      };
      set((state) => {
        const newState = {
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, notes: [...(t.notes || []), newNote] }
              : t
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteNote: (taskId, noteId) => {
      set((state) => {
        const newState = {
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
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    setShowSetup: (show) => set({ showSetup: show }),
    setShowMemberModal: (show) => set({ showMemberModal: show }),
    setShowTaskModal: (show) => set({ showTaskModal: show }),
    setShowAssignModal: (show, taskId) =>
      set({ showAssignModal: show, selectedTaskId: taskId || null }),
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
      const { tasks, notifications, activeDeceasedId } = get();
      if (!activeDeceasedId) return;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeTasks = tasks.filter((t) => t.deceasedId === activeDeceasedId);

      activeTasks.forEach((task) => {
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

    checkMemorialAnniversaries: () => {
      const { deceaseds, tasks, currentUser, generatedMemorialTasks } = get();

      deceaseds.forEach((deceased) => {
        const todayNodes = getTodayMemorialNodes(deceased.deathDate);
        if (todayNodes.length === 0) return;

        const funeralCategory = categories.find((c) => c.id === 'funeral');
        if (!funeralCategory) return;

        const deceasedGenTasks = generatedMemorialTasks[deceased.id] || getEmptyGeneratedMemorialTasks();
        let needsUpdate = false;
        const newGenTasks = { ...deceasedGenTasks };

        todayNodes.forEach((node) => {
          if (newGenTasks[node.type]) return;

          const taskTitle = getMemorialTaskTitle(deceased.name, node.name);
          const taskDescription = getMemorialTaskDescription(deceased.name, node.name, node.description);

          const existingTask = tasks.find(
            (t) => t.deceasedId === deceased.id && t.title === taskTitle && t.dueDate === node.date
          );
          if (existingTask) {
            newGenTasks[node.type] = true;
            needsUpdate = true;
            return;
          }

          const newTask: Task = {
            id: generateId(),
            title: taskTitle,
            description: taskDescription,
            categoryId: funeralCategory.id,
            deceasedId: deceased.id,
            status: 'pending',
            dueDate: node.date,
            priority: 2,
            createdAt: new Date().toISOString(),
            notes: [],
            assigneeId: currentUser?.id,
          };

          set((state) => {
            const newState = {
              tasks: [...state.tasks, newTask],
              generatedMemorialTasks: {
                ...state.generatedMemorialTasks,
                [deceased.id]: {
                  ...(state.generatedMemorialTasks[deceased.id] || getEmptyGeneratedMemorialTasks()),
                  [node.type]: true,
                },
              },
            };
            return { ...newState, ...computeDerived(newState) };
          });

          if (currentUser) {
            const newNotification: Omit<Notification, 'id' | 'createdAt'> = {
              type: 'deadline_approaching',
              taskId: newTask.id,
              taskTitle: newTask.title,
              userId: currentUser.id,
              read: false,
              message: `今天是${deceased.name}老人的${node.name}纪念日，请安排好祭祀事宜。`,
              daysRemaining: 0,
            };
            get().addNotification(newNotification);
          }
        });

        if (needsUpdate) {
          set((state) => ({
            generatedMemorialTasks: {
              ...state.generatedMemorialTasks,
              [deceased.id]: newGenTasks,
            },
          }));
        }
      });

      persist();
    },

    saveTemplate: (name, description, tasks) => {
      const now = new Date().toISOString();
      const newTemplate: SavedTemplate = {
        id: generateId(),
        name,
        description,
        tasks,
        createdAt: now,
        updatedAt: now,
      };
      set((state) => ({
        savedTemplates: [...state.savedTemplates, newTemplate],
      }));
      persistTemplates();
      return newTemplate;
    },

    deleteTemplate: (templateId) => {
      set((state) => ({
        savedTemplates: state.savedTemplates.filter(
          (t) => t.id !== templateId || t.isDefault
        ),
      }));
      persistTemplates();
    },

    updateTemplate: (templateId, updates) => {
      set((state) => ({
        savedTemplates: state.savedTemplates.map((t) =>
          t.id === templateId && !t.isDefault
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t
        ),
      }));
      persistTemplates();
    },

    loadSavedTemplates: () => {
      set({ savedTemplates: getInitialSavedTemplates() });
    },

    resetData: () => {
      localStorage.removeItem('funeral_planner_data');
      set({
        deceaseds: [],
        activeDeceasedId: null,
        deceased: null,
        members: [],
        tasks: [],
        activeTasks: [],
        notifications: [],
        currentUser: null,
        showSetup: true,
        generatedMemorialTasks: getInitialGeneratedMemorialTasks(),
        activeGeneratedMemorialTasks: getEmptyGeneratedMemorialTasks(),
        funeralItems: [],
        activeFuneralItems: [],
        expenses: [],
        activeExpenses: [],
        guests: [],
        activeGuests: [],
        memorialMessages: [],
        activeMemorialMessages: [],
        condolenceGifts: [],
        activeCondolenceGifts: [],
        ceremonySteps: [],
        activeCeremonySteps: [],
        documents: [],
        activeDocuments: [],
        eulogies: [],
        activeEulogies: [],
      });
    },

    loadFromLocalStorage: () => {
      const persistedRaw = loadFromStorage<any>();
      const persisted = migrateOldData(persistedRaw);
      if (persisted) {
        const fixedTasks = fixOrphanTasks(persisted.deceaseds, persisted.tasks);
        set((state) => {
          const newState = {
            deceaseds: persisted.deceaseds,
            activeDeceasedId: persisted.activeDeceasedId,
            members: persisted.members,
            tasks: fixedTasks,
            funeralItems: persisted.funeralItems || [],
            expenses: persisted.expenses || [],
            guests: persisted.guests || [],
            memorialMessages: persisted.memorialMessages || [],
            condolenceGifts: persisted.condolenceGifts || [],
            ceremonySteps: persisted.ceremonySteps || [],
            documents: persisted.documents || [],
            eulogies: persisted.eulogies || [],
            currentUser: persisted.currentUser,
            notifications: persisted.notifications || [],
            generatedMemorialTasks: persisted.generatedMemorialTasks || getInitialGeneratedMemorialTasks(),
            showSetup: persisted.deceaseds.length === 0,
          };
          return { ...newState, ...computeDerived(newState) };
        });
      }
    },

    addFuneralItem: (item) => {
      const newItem: FuneralItem = {
        ...item,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newState = { funeralItems: [...state.funeralItems, newItem] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateFuneralItem: (id, updates) => {
      set((state) => {
        const newState = {
          funeralItems: state.funeralItems.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteFuneralItem: (id) => {
      set((state) => {
        const newState = {
          funeralItems: state.funeralItems.filter((i) => i.id !== id),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    toggleFuneralItemPurchased: (id) => {
      const { currentUser } = get();
      set((state) => {
        const newState = {
          funeralItems: state.funeralItems.map((i) => {
            if (i.id !== id) return i;
            const newPurchased = !i.purchased;
            return {
              ...i,
              purchased: newPurchased,
              purchasedAt: newPurchased ? new Date().toISOString() : undefined,
              purchaserId: newPurchased ? currentUser?.id : undefined,
            };
          }),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    resetFuneralItems: (deceasedId) => {
      const defaultItems = createDefaultItemsForDeceased(deceasedId);
      set((state) => {
        const filteredItems = state.funeralItems.filter((i) => i.deceasedId !== deceasedId);
        const newState = { funeralItems: [...filteredItems, ...defaultItems] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    addExpense: (expense) => {
      const newExpense: Expense = {
        ...expense,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newState = { expenses: [...state.expenses, newExpense] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateExpense: (id, updates) => {
      set((state) => {
        const newState = {
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteExpense: (id) => {
      set((state) => {
        const newState = {
          expenses: state.expenses.filter((e) => e.id !== id),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    addGuest: (guest) => {
      const newGuest: Guest = {
        ...guest,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newState = { guests: [...state.guests, newGuest] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateGuest: (id, updates) => {
      set((state) => {
        const newState = {
          guests: state.guests.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteGuest: (id) => {
      set((state) => {
        const newState = {
          guests: state.guests.filter((g) => g.id !== id),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    addMemorialMessage: (message) => {
      const newMessage: MemorialMessage = {
        ...message,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newState = { memorialMessages: [...state.memorialMessages, newMessage] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteMemorialMessage: (id) => {
      set((state) => {
        const newState = {
          memorialMessages: state.memorialMessages.filter((m) => m.id !== id),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    addCondolenceGift: (gift) => {
      const newGift: CondolenceGift = {
        ...gift,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newState = { condolenceGifts: [...state.condolenceGifts, newGift] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateCondolenceGift: (id, updates) => {
      set((state) => {
        const newState = {
          condolenceGifts: state.condolenceGifts.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteCondolenceGift: (id) => {
      set((state) => {
        const newState = {
          condolenceGifts: state.condolenceGifts.filter((g) => g.id !== id),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    addCeremonyStep: (step) => {
      const newStep: CeremonyStep = {
        ...step,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newState = { ceremonySteps: [...state.ceremonySteps, newStep] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateCeremonyStep: (id, updates) => {
      set((state) => {
        const newState = {
          ceremonySteps: state.ceremonySteps.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteCeremonyStep: (id) => {
      set((state) => {
        const remainingSteps = state.ceremonySteps.filter((s) => s.id !== id);
        const deceasedStep = remainingSteps.find((s) => s.deceasedId === state.ceremonySteps.find((step) => step.id === id)?.deceasedId);
        const deceasedId = state.ceremonySteps.find((step) => step.id === id)?.deceasedId;
        const reorderedSteps = remainingSteps
          .filter((s) => s.deceasedId === deceasedId)
          .sort((a, b) => a.order - b.order)
          .map((s, index) => ({ ...s, order: index + 1 }));
        const otherSteps = remainingSteps.filter((s) => s.deceasedId !== deceasedId);
        const newState = {
          ceremonySteps: [...otherSteps, ...reorderedSteps],
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    setCeremonyStepStatus: (id, status) => {
      set((state) => {
        const newState = {
          ceremonySteps: state.ceremonySteps.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    reorderCeremonySteps: (steps) => {
      set((state) => {
        const reorderedSteps = steps.map((s, index) => ({ ...s, order: index + 1 }));
        const otherSteps = state.ceremonySteps.filter(
          (s) => !steps.find((step) => step.id === s.id)
        );
        const newState = {
          ceremonySteps: [...otherSteps, ...reorderedSteps],
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    resetCeremonySteps: (deceasedId) => {
      const defaultSteps = createDefaultCeremonyStepsForDeceased(deceasedId);
      set((state) => {
        const filteredSteps = state.ceremonySteps.filter((s) => s.deceasedId !== deceasedId);
        const newState = { ceremonySteps: [...filteredSteps, ...defaultSteps] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    addDocument: (doc) => {
      const newDoc: FuneralDocument = {
        ...doc,
        id: generateId(),
        uploadDate: new Date().toISOString(),
      };
      set((state) => {
        const newState = { documents: [...state.documents, newDoc] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateDocument: (id, updates) => {
      set((state) => {
        const newState = {
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteDocument: (id) => {
      set((state) => {
        const newState = {
          documents: state.documents.filter((d) => d.id !== id),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    addEulogy: (eulogy) => {
      const now = new Date().toISOString();
      const newEulogy: Eulogy = {
        ...eulogy,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      set((state) => {
        const newState = { eulogies: [...state.eulogies, newEulogy] };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    updateEulogy: (id, updates) => {
      set((state) => {
        const newState = {
          eulogies: state.eulogies.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    deleteEulogy: (id) => {
      set((state) => {
        const newState = {
          eulogies: state.eulogies.filter((e) => e.id !== id),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },

    setEulogyStatus: (id, status) => {
      set((state) => {
        const newState = {
          eulogies: state.eulogies.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status,
                  updatedAt: new Date().toISOString(),
                  finalizedAt: status === 'finalized' ? new Date().toISOString() : undefined,
                }
              : e
          ),
        };
        return { ...newState, ...computeDerived(newState) };
      });
      persist();
    },
  };
});
