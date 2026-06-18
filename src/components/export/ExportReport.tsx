import { useStore } from '@/store/useStore';
import {
  calculateProgress,
  getStatusCounts,
  getOverdueTasks,
  formatDate,
  getDaysRemaining,
  getStatusText,
  getPriorityText,
  formatDateShort,
} from '@/utils/progressUtils';
import {
  Feather,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  ListTodo,
} from 'lucide-react';

interface ExportReportProps {
  reportRef: React.RefObject<HTMLDivElement>;
}

export const ExportReport = ({ reportRef }: ExportReportProps) => {
  const { deceased, members, activeTasks: tasks, categories } = useStore();

  if (!deceased) return null;

  const progress = calculateProgress(tasks);
  const statusCounts = getStatusCounts(tasks);
  const overdueTasks = getOverdueTasks(tasks);

  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.categoryId === cat.id);
    const catProgress = Math.round(
      (catTasks.filter((t) => t.status === 'completed').length / (catTasks.length || 1)) * 100
    );
    return {
      ...cat,
      count: catTasks.length,
      completed: catTasks.filter((t) => t.status === 'completed').length,
      progress: catProgress,
    };
  });

  const memberStats = members.map((member) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
    const completedCount = memberTasks.filter((t) => t.status === 'completed').length;
    const inProgressCount = memberTasks.filter((t) => t.status === 'in-progress').length;
    const pendingCount = memberTasks.filter((t) => t.status === 'pending').length;
    const memberProgress = memberTasks.length > 0
      ? Math.round((completedCount / memberTasks.length) * 100)
      : 0;
    return {
      ...member,
      total: memberTasks.length,
      completed: completedCount,
      inProgress: inProgressCount,
      pending: pendingCount,
      progress: memberProgress,
    };
  });

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { 'in-progress': 0, pending: 1, completed: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });

  const generateDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      ref={reportRef}
      className="export-report"
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '40px 50px',
        background: 'white',
        fontFamily: '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif',
        color: '#1e293b',
        position: 'fixed',
        left: '-9999px',
        top: '-9999px',
        zIndex: -1,
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          paddingBottom: '20px',
          borderBottom: '3px solid #1e3a5f',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e3a5f, #3f51b5)',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather style={{ width: '30px', height: '30px', color: 'white' }} />
        </div>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            margin: '0 0 8px',
          }}
        >
          治丧事务进度报告
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          生成时间：{generateDate}
        </p>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '4px',
              height: '20px',
              background: '#3f51b5',
              borderRadius: '2px',
            }}
          />
          逝者信息
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
              {deceased.name} 老人
            </p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px' }}>
              {formatDate(deceased.birthDate)} — {formatDate(deceased.deathDate)}
            </p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              与您的关系：{deceased.relationship}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px' }}>
              离开我们
            </p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e3a5f', margin: 0 }}>
              {Math.abs(getDaysRemaining(deceased.deathDate))}
            </p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>天</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '4px',
              height: '20px',
              background: '#3f51b5',
              borderRadius: '2px',
            }}
          />
          整体进度
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div style={{ flex: '0 0 120px', textAlign: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                margin: '0 auto',
              }}
            >
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#3f51b5"
                  strokeWidth="8"
                  strokeDasharray={`${progress * 2.64} 264`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1e3a5f',
                }}
              >
                {progress}%
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              完成进度
            </p>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#16a34a' }} />
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>
                  {statusCounts.completed}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>已完成</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock style={{ width: '20px', height: '20px', color: '#d97706' }} />
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>
                  {statusCounts.inProgress}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>进行中</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ListTodo style={{ width: '20px', height: '20px', color: '#64748b' }} />
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#64748b', margin: 0 }}>
                  {statusCounts.pending}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>待办</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                  {overdueTasks.length}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>已逾期</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '4px',
              height: '20px',
              background: '#3f51b5',
              borderRadius: '2px',
            }}
          />
          分类进度
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {categoryStats.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                  {cat.name}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: cat.color }}>
                  {cat.progress}%
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${cat.progress}%`,
                    background: cat.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                已完成 {cat.completed} / {cat.count} 项
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '4px',
              height: '20px',
              background: '#3f51b5',
              borderRadius: '2px',
            }}
          />
          <Users style={{ width: '18px', height: '18px' }} />
          家庭成员任务统计
        </h2>
        {memberStats.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {memberStats.map((member) => (
              <div
                key={member.id}
                style={{
                  background: '#f8fafc',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: member.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                        {member.name}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: member.color }}>
                        {member.progress}%
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                      {member.role}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${member.progress}%`,
                      background: member.color,
                      borderRadius: '3px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', color: '#16a34a', margin: '0 0 2px' }}>
                      {member.completed}
                    </p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '11px' }}>已完成</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', color: '#d97706', margin: '0 0 2px' }}>
                      {member.inProgress}
                    </p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '11px' }}>进行中</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', color: '#64748b', margin: '0 0 2px' }}>
                      {member.pending}
                    </p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '11px' }}>待办</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', color: '#1e3a5f', margin: '0 0 2px' }}>
                      {member.total}
                    </p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '11px' }}>总计</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
            暂无家庭成员数据
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '4px',
              height: '20px',
              background: '#3f51b5',
              borderRadius: '2px',
            }}
          />
          <Calendar style={{ width: '18px', height: '18px' }} />
          任务清单
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontWeight: '600',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  状态
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontWeight: '600',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  任务名称
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontWeight: '600',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  分类
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontWeight: '600',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  负责人
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontWeight: '600',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  优先级
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontWeight: '600',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  截止日期
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task, index) => {
                const category = categories.find((c) => c.id === task.categoryId);
                const assignee = members.find((m) => m.id === task.assigneeId);
                const isOverdue = task.dueDate
                  ? getDaysRemaining(task.dueDate) < 0 && task.status !== 'completed'
                  : false;

                return (
                  <tr
                    key={task.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: index % 2 === 0 ? '#ffffff' : '#fafafa',
                    }}
                  >
                    <td style={{ padding: '8px 12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                          background:
                            task.status === 'completed'
                              ? '#dcfce7'
                              : task.status === 'in-progress'
                              ? '#fef3c7'
                              : '#f1f5f9',
                          color:
                            task.status === 'completed'
                              ? '#16a34a'
                              : task.status === 'in-progress'
                              ? '#d97706'
                              : '#64748b',
                        }}
                      >
                        {getStatusText(task.status)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        color: task.status === 'completed' ? '#94a3b8' : '#334155',
                        maxWidth: '180px',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: category ? category.color + '20' : '#f1f5f9',
                          color: category ? category.color : '#64748b',
                        }}
                      >
                        {category?.name || '未分类'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>
                      {assignee ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: assignee.color,
                              display: 'inline-block',
                            }}
                          />
                          {assignee.name}
                        </span>
                      ) : (
                        '未分配'
                      )}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span
                        style={{
                          color:
                            task.priority === 1
                              ? '#dc2626'
                              : task.priority === 2
                              ? '#ea580c'
                              : '#7c3aed',
                          fontSize: '11px',
                          fontWeight: '500',
                        }}
                      >
                        {getPriorityText(task.priority)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        color: isOverdue ? '#dc2626' : '#64748b',
                        fontSize: '11px',
                      }}
                    >
                      {task.dueDate ? formatDateShort(task.dueDate) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#94a3b8',
        }}
      >
        <p style={{ margin: 0 }}>本报告由治丧事务管理系统自动生成</p>
        <p style={{ margin: '4px 0 0' }}>
          共 {statusCounts.total} 项任务 · {members.length} 位家庭成员
        </p>
      </div>
    </div>
  );
};
