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
import { ItemChecklist } from '@/pages/ItemChecklist';
import { ExpenseTracker } from '@/pages/ExpenseTracker';
import { Collaboration } from '@/pages/Collaboration';
import { Reference } from '@/pages/Reference';
import { ExportReport } from '@/components/export/ExportReport';
import { useStore } from '@/store/useStore';
import { exportToPdf } from '@/utils/exportPdf';

function App() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    deceased,
    deceaseds,
    showSetup,
    showTaskModal,
    showAssignModal,
    showDependencyModal,
    showMemberModal,
    activeTab,
    checkDeadlineNotifications,
    checkMemorialAnniversaries,
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
    if (deceaseds.length === 0 && !showSetup) {
      const hasInitialized = localStorage.getItem('funeral_planner_initialized');
      if (!hasInitialized) {
        useStore.getState().setShowSetup(true);
      }
    }
  }, [deceaseds.length, showSetup]);

  useEffect(() => {
    if (deceaseds.length > 0) {
      checkDeadlineNotifications();
      checkMemorialAnniversaries();
      const interval = setInterval(() => {
        checkDeadlineNotifications();
        checkMemorialAnniversaries();
      }, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [deceaseds.length, checkDeadlineNotifications, checkMemorialAnniversaries]);

  const renderContent = () => {
    if (!deceased) {
      return null;
    }
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList />;
      case 'items':
        return <ItemChecklist />;
      case 'expenses':
        return <ExpenseTracker />;
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

      {showSetup && <SetupModal />}
      {showTaskModal && <AddTaskModal />}
      {showAssignModal && <AssignTaskModal />}
      {showDependencyModal && <DependencyModal />}
      {showMemberModal && <AddMemberModal />}

      {deceased && <ExportReport reportRef={reportRef} />}
    </div>
  );
}

export default App;
