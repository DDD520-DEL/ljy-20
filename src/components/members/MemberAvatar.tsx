import { User } from 'lucide-react';
import type { FamilyMember } from '@/types';
import { MEMBER_ROLE_LABELS } from '@/types';

interface MemberAvatarProps {
  member: FamilyMember;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
}

export const MemberAvatar = ({ member, size = 'md', showName = false }: MemberAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full text-white font-medium flex-shrink-0`}
        style={{ backgroundColor: member.color }}
      >
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>
      {showName && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">{member.name}</span>
          <span className="text-xs text-slate-500">
            {member.role}
            <span className="text-slate-300 mx-1">·</span>
            <span className={member.permissionRole === 'admin' ? 'text-gold-600' : 'text-slate-400'}>
              {MEMBER_ROLE_LABELS[member.permissionRole]}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
