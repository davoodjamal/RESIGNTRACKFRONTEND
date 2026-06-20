import { useState } from 'react';
import Icon from './Icon';
import HelpModal from './HelpModal';
import LogoutConfirmationModal from './admin/LogoutConfirmationModal';

import HRDashboard from './hr/HRDashboard';
import EmployeeDirectory from './hr/EmployeeDirectory';
import ResignationReview from './hr/ResignationReview';
import ExitInterviewsList from './hr/ExitInterviewsList';
import TaskManagement from './hr/TaskManagement';
import ExEmployeeDirectory from './hr/ExEmployeeDirectory';
import AssetManagement from './hr/AssetManagement';


import AttritionReports from './hr/AttritionReports';

export default function HRPortal({
  user,
  resignations,
  onUpdateStatus,
  onLogout,
  assets,
  assetAuditTrail,
  onAssignAsset,
  onReturnAsset,
  onUpdateAssetStatus,
  onCreateAsset
}) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const tabs = [
    { id: 'Dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'Directory', icon: 'groups', label: 'Directory' },
    { id: 'Assets', icon: 'inventory_2', label: 'Asset Management' },
    { id: 'ExitInterviews', icon: 'assignment_turned_in', label: 'Exit Interviews' },
    { id: 'Tasks', icon: 'assignment', label: 'Tasks' },
    { id: 'AttritionReports', icon: 'analytics', label: 'Attrition Reports' },
    { id: 'ExEmployeeDirectory', icon: 'history', label: 'Ex-Employee' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <HRDashboard resignations={resignations} setActiveTab={setActiveTab} />;
      case 'Directory':
        return <EmployeeDirectory setActiveTab={setActiveTab} setSelectedEmployee={setSelectedEmployee} />;
      case 'Resignations':
        return (
          <ResignationReview
            resignations={resignations}
            onUpdateStatus={onUpdateStatus}
            setActiveTab={setActiveTab}
            selectedEmployee={selectedEmployee}
            assets={assets}
            onReturnAsset={onReturnAsset}
          />
        );
      case 'Assets':
        return (
          <AssetManagement
            assets={assets}
            assetAuditTrail={assetAuditTrail}
            onAssignAsset={onAssignAsset}
            onReturnAsset={onReturnAsset}
            onUpdateAssetStatus={onUpdateAssetStatus}
            onCreateAsset={onCreateAsset}
          />
        );
      case 'ExitInterviews':
        return <ExitInterviewsList resignations={resignations} onUpdateStatus={onUpdateStatus} />;
      case 'Tasks':
        return <TaskManagement />;
      case 'AttritionReports':
        return <AttritionReports />;
      case 'ExEmployeeDirectory':
        return <ExEmployeeDirectory />;
      default:
        return <HRDashboard resignations={resignations} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#131318] text-[#e4e1e9] flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#00000080] z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-[#1f1f24] border-r border-[#3b494b] flex flex-col py-6 px-4 z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-12 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#00dbe9] tracking-tight">Resign Track</h1>
            <p className="text-sm text-[#b9cacb] opacity-70">HR Manager Portal</p>
          </div>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <Icon>close</Icon>
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center h-12 px-4 rounded-lg transition-colors font-medium text-[16px] tracking-[0.02em] ${
                activeTab === tab.id
                  ? 'bg-[#00dbe9]/20 text-[#00dbe9] font-bold border-r-4 border-[#00dbe9]'
                  : 'text-[#b9cacb] hover:bg-[#2a292f]'
              }`}
            >
              <Icon className={`mr-4 text-[24px] ${activeTab === tab.id ? '' : 'opacity-80'}`} style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {tab.icon}
              </Icon>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#3b494b] pt-4 space-y-1">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="w-full flex items-center h-12 px-4 text-[#b9cacb] hover:bg-[#2a292f] rounded-lg transition-colors font-medium text-[16px] tracking-[0.02em]"
          >
            <Icon className="mr-4 text-[24px]">help_outline</Icon>
            Help Center
          </button>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center h-12 px-4 text-[#ffb4ab] hover:bg-[#ffb4ab]/20 rounded-lg transition-colors font-medium text-[16px] tracking-[0.02em]"
          >
            <Icon className="mr-4 text-[24px]">logout</Icon>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#131318]">
        {/* Top App Bar */}
        <header className="sticky top-0 w-full flex justify-between items-center h-16 px-6 bg-[#1f1f24]/90 backdrop-blur-sm z-30 border-b border-[#3b494b]">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-[#b9cacb]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Icon>menu</Icon>
            </button>
            <h2 className="text-xl font-bold text-[#00dbe9]">
              {tabs.find(t => t.id === activeTab)?.label || 'HR Portal'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-[#e4e1e9]">{user?.username || 'HR Supervisor'}</p>
              <p className="text-[11px] text-[#b9cacb]">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#00dbe9] text-[#00363a] flex items-center justify-center font-bold text-sm shadow-sm neon-glow-primary">
              {user?.username?.charAt(0) || 'H'}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1">
          {renderActiveTab()}
        </main>
      </div>

      {showLogoutModal && (
        <LogoutConfirmationModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            onLogout?.();
          }}
        />
      )}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
