import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SetupModal } from '@/components/common/SetupModal';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { AssignTaskModal } from '@/components/tasks/AssignTaskModal';
import { AddMemberModal } from '@/components/members/AddMemberModal';
import { Dashboard } from '@/pages/Dashboard';
import { TaskList } from '@/pages/TaskList';
import { Collaboration } from '@/pages/Collaboration';
import { Reference } from '@/pages/Reference';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/progressUtils';

function App() {
  const {
    deceased,
    currentUser,
    showSetup,
    showTaskModal,
    showAssignModal,
    showMemberModal,
    activeTab,
    initializeFromTemplate,
    addMember,
    setShowSetup,
    setCurrentUser,
  } = useStore();

  useEffect(() => {
    const hasInitialized = localStorage.getItem('funeral_planner_initialized');
    if (!deceased && !hasInitialized) {
      setShowSetup(true);
    }
  }, [deceased, setShowSetup]);

  const handleSetupComplete = (
    deceasedInfo: { name: string; birthDate: string; deathDate: string; relationship: string },
    currentUserInfo: { name: string; role: string }
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
    initializeFromTemplate(deceasedData);
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
          <Header />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {showSetup && <SetupModal onComplete={handleSetupComplete} />}
      {showTaskModal && <AddTaskModal />}
      {showAssignModal && <AssignTaskModal />}
      {showMemberModal && <AddMemberModal />}
    </div>
  );
}

export default App;
