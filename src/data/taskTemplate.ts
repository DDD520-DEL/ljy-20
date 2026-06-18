import type { Task, TemplateTaskItem, SavedTemplate } from '@/types';

export interface TaskTemplate {
  title: string;
  description: string;
  categoryId: string;
  priority: 1 | 2 | 3;
  dueDays?: number;
}

export const taskTemplates: TaskTemplate[] = [
  {
    title: '开具死亡证明',
    description: '到医院或当地派出所开具死亡证明，一式三份。在医院死亡由医院出具，在家中死亡由社区医院或派出所出具。',
    categoryId: 'gov',
    priority: 1,
    dueDays: 1,
  },
  {
    title: '注销户口',
    description: '携带死亡证明、户口本、身份证到户籍所在地派出所办理户口注销手续。',
    categoryId: 'gov',
    priority: 1,
    dueDays: 3,
  },
  {
    title: '停办医保社保',
    description: '到社保中心办理医保、社保停保手续，申请丧葬费和抚恤金。需携带死亡证明、身份证、户口本。',
    categoryId: 'gov',
    priority: 2,
    dueDays: 15,
  },
  {
    title: '注销身份证',
    description: '到派出所办理身份证注销，上缴身份证原件。',
    categoryId: 'gov',
    priority: 2,
    dueDays: 15,
  },
  {
    title: '办理丧葬费/抚恤金',
    description: '到社保中心申请丧葬费和抚恤金，需要提供死亡证明、火化证明、亲属关系证明等材料。',
    categoryId: 'gov',
    priority: 2,
    dueDays: 30,
  },
  {
    title: '联系殡仪馆',
    description: '联系殡仪馆电话咨询服务项目、价格，预约接运遗体服务。建议提前了解各殡仪馆的服务内容和收费标准。',
    categoryId: 'funeral',
    priority: 1,
    dueDays: 1,
  },
  {
    title: '预约火化时间',
    description: '与殡仪馆确认火化日期和时间段，通常需要提前1-3天预约。',
    categoryId: 'funeral',
    priority: 1,
    dueDays: 2,
  },
  {
    title: '安排告别仪式',
    description: '选择告别厅室，设计仪式流程，准备悼词、哀乐等。确认是否需要礼仪服务。',
    categoryId: 'funeral',
    priority: 1,
    dueDays: 3,
  },
  {
    title: '选购骨灰盒/寿衣',
    description: '根据家庭意愿和经济条件选择寿衣、骨灰盒。殡仪馆通常提供相关服务，也可自行购买。',
    categoryId: 'funeral',
    priority: 1,
    dueDays: 2,
  },
  {
    title: '选购墓地/骨灰堂',
    description: '联系陵园或骨灰堂，了解位置、价格、手续等。考虑交通便利性、环境、价格等因素。',
    categoryId: 'funeral',
    priority: 2,
    dueDays: 7,
  },
  {
    title: '准备遗像/挽联/花圈',
    description: '准备逝者遗像（通常为黑白12寸），撰写挽联，订购花圈。',
    categoryId: 'funeral',
    priority: 1,
    dueDays: 2,
  },
  {
    title: '通知亲友',
    description: '通过电话、微信等方式发送讣告，告知告别仪式时间和地点。',
    categoryId: 'funeral',
    priority: 1,
    dueDays: 2,
  },
  {
    title: '安排接送车辆',
    description: '安排亲友接送车辆，预订大巴或协调车辆。',
    categoryId: 'funeral',
    priority: 2,
    dueDays: 3,
  },
  {
    title: '注销银行账户',
    description: '携带死亡证明、亲属关系证明、继承人身份证到各银行网点办理账户注销和资金取出。',
    categoryId: 'finance',
    priority: 2,
    dueDays: 30,
  },
  {
    title: '处理房产过户',
    description: '到不动产登记中心办理房产继承过户手续，需要办理继承公证。',
    categoryId: 'finance',
    priority: 3,
    dueDays: 90,
  },
  {
    title: '办理车辆过户',
    description: '到车管所办理车辆继承过户手续。',
    categoryId: 'finance',
    priority: 3,
    dueDays: 60,
  },
  {
    title: '处理股票/基金/保险',
    description: '联系证券公司、基金公司、保险公司办理资产过户或理赔。',
    categoryId: 'finance',
    priority: 2,
    dueDays: 60,
  },
  {
    title: '结清水电燃气物业费用',
    description: '结清各项生活费用，办理水电燃气过户或销户。',
    categoryId: 'finance',
    priority: 2,
    dueDays: 30,
  },
  {
    title: '注销手机号/宽带',
    description: '到运营商营业厅办理手机号和宽带注销或过户。',
    categoryId: 'finance',
    priority: 2,
    dueDays: 30,
  },
  {
    title: '处理社交账号/邮箱',
    description: '注销或 memorialize 逝者的社交账号、邮箱等网络账号。',
    categoryId: 'other',
    priority: 3,
    dueDays: 60,
  },
  {
    title: '归还借阅物品',
    description: '归还图书馆书籍、亲友物品等。',
    categoryId: 'other',
    priority: 3,
    dueDays: 30,
  },
  {
    title: '处理宠物安置',
    description: '如逝者有宠物，协商安排新的抚养人。',
    categoryId: 'other',
    priority: 2,
    dueDays: 7,
  },
  {
    title: '感谢答谢亲友',
    description: '制作答谢礼品，登门或通过其他方式答谢前来吊唁的亲友。',
    categoryId: 'other',
    priority: 2,
    dueDays: 15,
  },
  {
    title: '整理遗物',
    description: '整理逝者遗物，分类处理保留、捐赠或丢弃的物品。',
    categoryId: 'other',
    priority: 3,
    dueDays: 90,
  },
];

export const DEFAULT_TEMPLATE_ID = 'default-template';

export const getDefaultTemplate = (): SavedTemplate => {
  const now = new Date().toISOString();
  return {
    id: DEFAULT_TEMPLATE_ID,
    name: '系统默认模板',
    description: '包含身后事办理所需的全部标准任务',
    tasks: taskTemplates.map((tpl, index) => ({
      id: `default-task-${index}`,
      title: tpl.title,
      description: tpl.description,
      categoryId: tpl.categoryId,
      priority: tpl.priority,
      dueDays: tpl.dueDays,
      order: index,
    })),
    createdAt: now,
    updatedAt: now,
    isDefault: true,
  };
};

export const createTasksFromTemplate = (
  deceasedId: string,
  deathDate: string,
  templateTasks?: TemplateTaskItem[]
): Omit<Task, 'id' | 'createdAt'>[] => {
  const death = new Date(deathDate);
  const tasks = templateTasks || taskTemplates.map((tpl, index) => ({
    id: `default-${index}`,
    title: tpl.title,
    description: tpl.description,
    categoryId: tpl.categoryId,
    priority: tpl.priority,
    dueDays: tpl.dueDays,
    order: index,
  }));

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return sortedTasks.map((template) => ({
    title: template.title,
    description: template.description,
    categoryId: template.categoryId,
    deceasedId,
    status: 'pending' as const,
    priority: template.priority,
    dueDate: template.dueDays
      ? new Date(death.getTime() + template.dueDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : undefined,
    notes: [],
  }));
};
