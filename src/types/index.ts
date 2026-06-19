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

export type ExpenseCategory = 'funeral_home' | 'cemetery' | 'banquet' | 'clothing' | 'incense' | 'flowers' | 'urn' | 'paper' | 'ceremony' | 'transport' | 'religious' | 'medical' | 'legal' | 'other';

export const EXPENSE_CATEGORY_CONFIG: Record<ExpenseCategory, { name: string; icon: string; color: string; bgColor: string }> = {
  funeral_home: { name: '殡仪馆费用', icon: 'Building2', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  cemetery: { name: '墓地费用', icon: 'TreePine', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  banquet: { name: '宴请费用', icon: 'UtensilsCrossed', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  clothing: { name: '寿衣寿被', icon: 'Shirt', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  incense: { name: '香烛祭品', icon: 'Flame', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  flowers: { name: '花圈花篮', icon: 'Flower2', color: 'text-rose-700', bgColor: 'bg-rose-100' },
  urn: { name: '骨灰盒坛', icon: 'Box', color: 'text-slate-800', bgColor: 'bg-slate-200' },
  paper: { name: '纸钱冥品', icon: 'Scroll', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  ceremony: { name: '仪式服务', icon: 'Sparkles', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  transport: { name: '交通出行', icon: 'Car', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  religious: { name: '宗教法事', icon: 'Church', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  medical: { name: '医疗相关', icon: 'HeartPulse', color: 'text-red-700', bgColor: 'bg-red-100' },
  legal: { name: '法律手续', icon: 'FileText', color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
  other: { name: '其他费用', icon: 'Wallet', color: 'text-slate-600', bgColor: 'bg-slate-100' },
};

export interface Expense {
  id: string;
  category: ExpenseCategory;
  title: string;
  description?: string;
  amount: number;
  date: string;
  payerId?: string;
  deceasedId: string;
  receipt?: string;
  note?: string;
  createdAt: string;
}

export interface Guest {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  deceasedId: string;
  createdAt: string;
  note?: string;
}

export interface MemorialMessage {
  id: string;
  authorName: string;
  authorRelationship: string;
  content: string;
  deceasedId: string;
  createdAt: string;
  authorId?: string;
}

export type CondolenceGiftType = 'cash' | 'gift';

export const CONDOLENCE_GIFT_TYPE_CONFIG: Record<CondolenceGiftType, { name: string; icon: string; color: string; bgColor: string }> = {
  cash: { name: '礼金', icon: 'Banknote', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  gift: { name: '礼品', icon: 'Gift', color: 'text-rose-700', bgColor: 'bg-rose-100' },
};

export interface CondolenceGift {
  id: string;
  type: CondolenceGiftType;
  guestName: string;
  relationship: string;
  amount?: number;
  giftName?: string;
  quantity?: number;
  date: string;
  note?: string;
  deceasedId: string;
  createdAt: string;
}

export type CeremonyStepStatus = 'pending' | 'in-progress' | 'completed';

export const CEREMONY_STEP_STATUS_CONFIG: Record<CeremonyStepStatus, { name: string; color: string; bgColor: string }> = {
  pending: { name: '待开始', color: 'text-slate-500', bgColor: 'bg-slate-100' },
  'in-progress': { name: '进行中', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  completed: { name: '已完成', color: 'text-green-600', bgColor: 'bg-green-100' },
};

export type CeremonyStepType = 'arrival' | 'condolence' | 'eulogy' | 'family_speech' | 'bowing' | 'viewing' | 'cremation' | 'other';

export const CEREMONY_STEP_TYPE_CONFIG: Record<CeremonyStepType, { name: string; icon: string; color: string; bgColor: string }> = {
  arrival: { name: '签到入场', icon: 'LogIn', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  condolence: { name: '遗体告别', icon: 'Heart', color: 'text-rose-600', bgColor: 'bg-rose-100' },
  eulogy: { name: '致悼词', icon: 'BookOpen', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  family_speech: { name: '家属致辞', icon: 'Users', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  bowing: { name: '鞠躬行礼', icon: 'PersonStanding', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  viewing: { name: '瞻仰遗容', icon: 'Eye', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  cremation: { name: '火化仪式', icon: 'Flame', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  other: { name: '其他环节', icon: 'MoreHorizontal', color: 'text-slate-600', bgColor: 'bg-slate-100' },
};

export interface CeremonyStep {
  id: string;
  deceasedId: string;
  type: CeremonyStepType;
  title: string;
  description?: string;
  startTime: string;
  duration: number;
  order: number;
  status: CeremonyStepStatus;
  location?: string;
  host?: string;
  note?: string;
  createdAt: string;
}

export const DEFAULT_CEREMONY_STEPS: Omit<CeremonyStep, 'id' | 'deceasedId' | 'createdAt'>[] = [
  {
    type: 'arrival',
    title: '签到入场',
    description: '来宾签到、佩戴白花、领取礼单',
    startTime: '08:00',
    duration: 60,
    order: 1,
    status: 'pending',
  },
  {
    type: 'condolence',
    title: '遗体告别仪式开始',
    description: '全体肃立、默哀',
    startTime: '09:00',
    duration: 10,
    order: 2,
    status: 'pending',
  },
  {
    type: 'eulogy',
    title: '致悼词',
    description: '单位领导/主持人致悼词',
    startTime: '09:10',
    duration: 20,
    order: 3,
    status: 'pending',
  },
  {
    type: 'family_speech',
    title: '家属致谢词',
    description: '家属代表致答谢词',
    startTime: '09:30',
    duration: 15,
    order: 4,
    status: 'pending',
  },
  {
    type: 'bowing',
    title: '向逝者三鞠躬',
    description: '全体来宾向逝者行三鞠躬礼',
    startTime: '09:45',
    duration: 5,
    order: 5,
    status: 'pending',
  },
  {
    type: 'viewing',
    title: '瞻仰遗容',
    description: '来宾依次瞻仰遗容并慰问家属',
    startTime: '09:50',
    duration: 40,
    order: 6,
    status: 'pending',
  },
  {
    type: 'cremation',
    title: '送别火化',
    description: '送别遗体至火化炉',
    startTime: '10:30',
    duration: 30,
    order: 7,
    status: 'pending',
  },
];
