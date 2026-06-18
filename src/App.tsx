import { useEffect, useRef, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SetupModal } from '@/components/common/SetupModal';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { AssignTaskModal } from '@/components/tasks/AssignTaskModal';
import { DependencyModal } from '@/components/tasks/DependencyModal';
import { AddMemberModal } from '@/components/members/AddMemberModal';
import { Dashboard } from '@/pages/Dashboard';
import { TaskList } from '@/pages/TaskList';
import { Collaboration } from '@/pages/Collaboration';
import { Reference } from '@/pages/Reference';
import { ExportReport } from '@/components/export/ExportReport';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/progressUtils';
import { exportToPdf } from '@/utils/exportPdf';
import type { TemplateTaskItem } from '@/types';

function App() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    deceased,
    showSetup,
    showTaskModal,
    showAssignModal,
    showDependencyModal,
    showMemberModal,
    activeTab,
    initializeFromTemplate,
    addMember,
    setShowSetup,
    setCurrentUser,
    checkDeadlineNotifications,
  } = useStore();

  const handleExportPdf = async () => {
    if (!reportRef.current || !deceased) return;

    setIsExporting(true);
    try {
      const filename = `${deceased.name}老人治丧事务进度报告_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}`;
      await exportToPdf(reportRef.current, filename);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const hasInitialized = localStorage.getItem('funeral_planner_initialized');
    if (!deceased && !hasInitialized) {
      setShowSetup(true);
    }
  }, [deceased, setShowSetup]);

  useEffect(() => {
    if (deceased) {
      checkDeadlineNotifications();
      const interval = setInterval(() => {
        checkDeadlineNotifications();
      }, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [deceased, checkDeadlineNotifications]);

  const handleSetupComplete = (
    deceasedInfo: { name: string; birthDate: string; deathDate: string; relationship: string },
    currentUserInfo: { name: string; role: string },
    templateTasks: TemplateTaskItem[]
  ) => {
    const deceasedData = {
      id: generateId(),
      name: deceasedInfo.name,
      birthDate: deceasedInfo.birthDate,
      deathDate: deceasedInfo.deathDate,
      relationship: deceasedInfo.relationship,
    };

    const memberId = generateId();
    const newMember = {
      id: memberId,
      name: currentUserInfo.name,
      role: currentUserInfo.role || '家庭成员',
      color: '#3f51b5',
    };

    addMember(newMember);
    setCurrentUser(newMember);
    initializeFromTemplate(deceasedData, templateTasks);
    localStorage.setItem('funeral_planner_initialized', 'true');
    setShowSetup(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList />;
      case 'collaboration':
        return <Collaboration />;
      case 'reference':
        return <Reference />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col lg:ml-64">
          <Header onExportPdf={handleExportPdf} isExporting={isExporting} />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {showSetup && <SetupModal onComplete={handleSetupComplete} />}
      {showTaskModal && <AddTaskModal />}
      {showAssignModal && <AssignTaskModal />}
      {showDependencyModal && <DependencyModal />}
      {showMemberModal && <AddMemberModal />}

      {deceased && <ExportReport reportRef={reportRef} />}
    </div>
  );
}

export default App;
