export interface Deceased {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string;
  relationship: string;
  avatar?: string;
}

export type MemberRole = 'admin' | 'assistant';

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  admin: '管理员',
  assistant: '协助者',
};

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  color: string;
  permissionRole: MemberRole;
}

export const isAdmin = (member: FamilyMember | null): boolean => {
  return member?.permissionRole === 'admin';
};

export const canManageTask = (member: FamilyMember | null, taskAssigneeId?: string): boolean => {
  if (!member) return false;
  if (member.permissionRole === 'admin') return true;
  return taskAssigneeId === member.id;
};

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  assigneeId?: string;
  deceasedId: string;
  status: TaskStatus;
  dueDate?: string;
  priority: 1 | 2 | 3;
  createdAt: string;
  completedAt?: string;
  notes?: Note[];
  dependsOn?: string[];
}

export interface Note {
  id: string;
  taskId: string;
  content: string;
  authorId: string;
  createdAt: string;
  parentId?: string;
}

export interface FuneralHome {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  services: string[];
  rating: number;
}

export interface FuneralCustom {
  id: string;
  region: string;
  title: string;
  content: string;
  procedures: string[];
}

export interface GuideItem {
  id: string;
  category: string;
  title: string;
  materials: string[];
  location: string;
  process: string[];
  tips?: string;
}

export type NotificationType = 'task_assigned' | 'deadline_approaching' | 'task_overdue';

export interface Notification {
  id: string;
  type: NotificationType;
  taskId: string;
  taskTitle: string;
  userId: string;
  read: boolean;
  createdAt: string;
  message: string;
  daysRemaining?: number;
}

export interface AppState {
  deceaseds: Deceased[];
  activeDeceasedId: string | null;
  members: FamilyMember[];
  tasks: Task[];
  categories: TaskCategory[];
  currentUser: FamilyMember | null;
}

export interface TemplateTaskItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  priority: 1 | 2 | 3;
  dueDays?: number;
  order: number;
}

export interface SavedTemplate {
  id: string;
  name: string;
  description?: string;
  tasks: TemplateTaskItem[];
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export type MemorialNodeType = 'first7' | 'third7' | 'fifth7' | 'hundredth' | 'firstYear' | 'secondYear' | 'thirdYear';

export interface MemorialNode {
  type: MemorialNodeType;
  name: string;
  description: string;
  daysAfterDeath: number;
  date: string;
  daysRemaining: number;
  icon: string;
}

export interface Appointment {
  id: string;
  funeralHomeId: string;
  funeralHomeName: string;
  contactName: string;
  contactPhone: string;
  contactRelation: string;
  deceasedName: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  remark?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
}

export type AppointmentServiceType = '遗体接运' | '遗体冷藏' | '告别仪式' | '火化' | '骨灰寄存' | '丧葬用品' | '礼仪服务' | '综合服务';

export const APPOINTMENT_SERVICE_TYPES: AppointmentServiceType[] = [
  '遗体接运',
  '遗体冷藏',
  '告别仪式',
  '火化',
  '骨灰寄存',
  '丧葬用品',
  '礼仪服务',
  '综合服务',
];

export const MEMORIAL_NODE_CONFIG: Record<MemorialNodeType, { name: string; description: string; daysAfterDeath: number; icon: string }> = {
  first7: {
    name: '头七',
    description: '逝者离世后第七天，传统习俗中魂魄回家探望的日子',
    daysAfterDeath: 7,
    icon: 'Moon',
  },
  third7: {
    name: '三七',
    description: '逝者离世后第二十一天，为逝者超度的重要节点',
    daysAfterDeath: 21,
    icon: 'MoonStar',
  },
  fifth7: {
    name: '五七',
    description: '逝者离世后第三十五天，传说中逝者最后一次回家的日子',
    daysAfterDeath: 35,
    icon: 'Stars',
  },
  hundredth: {
    name: '百日',
    description: '逝者离世后第一百天，举行百日祭祀仪式',
    daysAfterDeath: 100,
    icon: 'Sun',
  },
  firstYear: {
    name: '一周年',
    description: '逝者离世一周年纪念，举行周年祭祀',
    daysAfterDeath: 365,
    icon: 'CalendarHeart',
  },
  secondYear: {
    name: '二周年',
    description: '逝者离世两周年纪念',
    daysAfterDeath: 730,
    icon: 'CalendarHeart',
  },
  thirdYear: {
    name: '三周年',
    description: '逝者离世三周年，传统孝道守孝期满的重要纪念',
    daysAfterDeath: 1095,
    icon: 'HeartHandshake',
  },
};

export type FuneralItemCategory = 'clothing' | 'incense' | 'flowers' | 'urn' | 'paper' | 'ceremony' | 'food' | 'other';

export const FUNERAL_ITEM_CATEGORY_CONFIG: Record<FuneralItemCategory, { name: string; icon: string; color: string }> = {
  clothing: { name: '寿衣寿被', icon: 'Shirt', color: 'text-amber-600' },
  incense: { name: '香烛祭品', icon: 'Flame', color: 'text-orange-600' },
  flowers: { name: '花圈花篮', icon: 'Flower2', color: 'text-rose-600' },
  urn: { name: '骨灰盒坛', icon: 'Box', color: 'text-slate-700' },
  paper: { name: '纸钱冥品', icon: 'Scroll', color: 'text-yellow-700' },
  ceremony: { name: '仪式用品', icon: 'Sparkles', color: 'text-purple-600' },
  food: { name: '供品食物', icon: 'Apple', color: 'text-green-600' },
  other: { name: '其他物品', icon: 'Package', color: 'text-blue-600' },
};

export interface FuneralItem {
  id: string;
  name: string;
  category: FuneralItemCategory;
  description?: string;
  quantity: number;
  unit?: string;
  purchased: boolean;
  purchasedAt?: string;
  purchaserId?: string;
  deceasedId: string;
  note?: string;
  createdAt: string;
}

export interface FuneralItemTemplate {
  id: string;
  name: string;
  category: FuneralItemCategory;
  description?: string;
  defaultQuantity: number;
  unit?: string;
}
