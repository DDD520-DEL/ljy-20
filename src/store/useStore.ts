import { create } from 'zustand';
import type { Deceased, FamilyMember, Task, TaskCategory, TaskStatus, Notification, Note, SavedTemplate, TemplateTaskItem, MemorialNodeType } from '@/types';
import { categories } from '@/data/categories';
import { createTasksFromTemplate, getDefaultTemplate, DEFAULT_TEMPLATE_ID } from '@/data/taskTemplate';
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

  deceased: Deceased | null;
  activeTasks: Task[];
  activeGeneratedMemorialTasks: Record<MemorialNodeType, boolean>;

  addDeceased: (deceased: Deceased, templateTasks?: TemplateTaskItem[]) => void;
  switchDeceased: (deceasedId: string) => void;
  deleteDeceased: (deceasedId: string) => void;
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  removeMember: (id: string) => void;
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
}

interface PersistedData {
  deceaseds: Deceased[];
  activeDeceasedId: string | null;
  members: FamilyMember[];
  tasks: Task[];
  currentUser: FamilyMember | null;
  notifications: Notification[];
  generatedMemorialTasks: Record<string, Record<MemorialNodeType, boolean>>;
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
      members: persisted.members || [],
      tasks: migratedTasks,
      currentUser: persisted.currentUser || null,
      notifications: persisted.notifications || [],
      generatedMemorialTasks: {
        [oldDeceased.id]: persisted.generatedMemorialTasks || getEmptyGeneratedMemorialTasks(),
      },
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
    const { deceaseds, activeDeceasedId, members, tasks, currentUser, notifications, generatedMemorialTasks } = get();
    saveToStorage({ deceaseds, activeDeceasedId, members, tasks, currentUser, notifications, generatedMemorialTasks });
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

    const activeDeceased = deceaseds.find((d) => d.id === activeDeceasedId) || null;
    return {
      deceased: activeDeceased,
      activeTasks: activeDeceased ? tasks.filter((t) => t.deceasedId === activeDeceased.id) : [],
      activeGeneratedMemorialTasks: activeDeceased
        ? generatedMemorialTasks[activeDeceased.id] || getEmptyGeneratedMemorialTasks()
        : getEmptyGeneratedMemorialTasks(),
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

      set((state) => {
        const newState = {
          deceaseds: [...state.deceaseds, deceased],
          activeDeceasedId: deceased.id,
          tasks: [...state.tasks, ...newTasks],
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
            currentUser: persisted.currentUser,
            notifications: persisted.notifications || [],
            generatedMemorialTasks: persisted.generatedMemorialTasks || getInitialGeneratedMemorialTasks(),
            showSetup: persisted.deceaseds.length === 0,
          };
          return { ...newState, ...computeDerived(newState) };
        });
      }
    },
  };
});
