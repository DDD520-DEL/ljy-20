import { useStore } from '@/store/useStore';
import { getMemorialNodes, formatDate } from '@/utils/progressUtils';
import {
  Moon,
  MoonStar,
  Stars,
  Sun,
  CalendarHeart,
  HeartHandshake,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { MemorialNode } from '@/types';

interface MemorialTrackerProps {
  limit?: number;
  showAll?: boolean;
}

const getNodeIcon = (iconName: string) => {
  const icons: Record<string, React.FC<{ className?: string }>> = {
    Moon,
    MoonStar,
    Stars,
    Sun,
    CalendarHeart,
    HeartHandshake,
  };
  return icons[iconName] || Moon;
};

export const MemorialTracker = ({ limit, showAll = false }: MemorialTrackerProps) => {
  const { deceased, setActiveTab } = useStore();

  if (!deceased) return null;

  const memorialNodes = getMemorialNodes(deceased.deathDate);
  const displayNodes = showAll
    ? memorialNodes
    : limit
    ? memorialNodes.filter((n) => n.daysRemaining >= 0).slice(0, limit)
    : memorialNodes.filter((n) => n.daysRemaining >= 0);

  const getStatusColor = (node: MemorialNode) => {
    if (node.daysRemaining < 0) return 'bg-slate-100 text-slate-500 border-slate-200';
    if (node.daysRemaining === 0) return 'bg-red-50 text-red-700 border-red-200';
    if (node.daysRemaining <= 7) return 'bg-gold-50 text-gold-700 border-gold-200';
    if (node.daysRemaining <= 30) return 'bg-primary-50 text-primary-700 border-primary-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getStatusIcon = (node: MemorialNode) => {
    if (node.daysRemaining < 0) return <CheckCircle2 className="w-4 h-4" />;
    if (node.daysRemaining === 0) return <AlertCircle className="w-4 h-4 animate-pulse" />;
    return <Clock className="w-4 h-4" />;
  };

  const getDaysText = (node: MemorialNode) => {
    if (node.daysRemaining < 0) return '已过';
    if (node.daysRemaining === 0) return '今天';
    if (node.daysRemaining === 1) return '明天';
    return `${node.daysRemaining} 天后`;
  };

  const getProgressPercentage = (node: MemorialNode) => {
    const totalDays = node.daysAfterDeath;
    const daysPassed = totalDays - node.daysRemaining;
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 font-serif flex items-center gap-2">
          <CalendarHeart className="w-5 h-5 text-primary-600" />
          传统纪念日
        </h3>
        {!showAll && displayNodes.length > 0 && (
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            查看全部
          </button>
        )}
      </div>

      {displayNodes.length > 0 ? (
        <div className="space-y-3">
          {displayNodes.map((node, index) => {
            const Icon = getNodeIcon(node.icon);
            const statusColor = getStatusColor(node);
            const progress = getProgressPercentage(node);
            return (
              <div
                key={node.type}
                className={`p-3 rounded-lg border ${statusColor} transition-all hover:shadow-sm animate-slide-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{node.name}</span>
                      <div className="flex items-center gap-1 text-xs font-medium">
                        {getStatusIcon(node)}
                        <span>{getDaysText(node)}</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-80 mb-2 line-clamp-1">{node.description}</p>
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>{formatDate(node.date)}</span>
                      <span>离世后第 {node.daysAfterDeath} 天</span>
                    </div>
                    {node.daysRemaining >= 0 && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-current opacity-60"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
          <p className="text-sm">所有纪念日已完成</p>
        </div>
      )}
    </div>
  );
};
