import type { TaskCategory } from '@/types';

export const categories: TaskCategory[] = [
  {
    id: 'gov',
    name: '政务事务',
    icon: 'Building2',
    color: '#1976d2',
  },
  {
    id: 'funeral',
    name: '丧葬事务',
    icon: 'HeartHandshake',
    color: '#c62828',
  },
  {
    id: 'finance',
    name: '财务事务',
    icon: 'Wallet',
    color: '#2e7d32',
  },
  {
    id: 'other',
    name: '其他事务',
    icon: 'MoreHorizontal',
    color: '#6a1b9a',
  },
];
