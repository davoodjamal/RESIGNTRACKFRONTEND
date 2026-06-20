import { useState } from 'react';
import Icon from './Icon';
import HelpModal from './HelpModal';

// Import child components
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import ResignationsOversight from './admin/ResignationsOversight';
import PlatformSettings from './admin/PlatformSettings';
import ReportsAnalytics from './admin/ReportsAnalytics';
import SystemHealth from './admin/SystemHealth';
import AuditTrailModal from './admin/AuditTrailModal';
import LogoutConfirmationModal from './admin/LogoutConfirmationModal';
import AssetManagement from './hr/AssetManagement';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'users', label: 'User Management', icon: 'group' },
  { id: 'resignations', label: 'Resignations', icon: 'exit_to_app' },
  { id: 'assets', label: 'Assets', icon: 'inventory_2' },
  { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
  { id: 'health', label: 'System Health', icon: 'health_and_safety' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export default function AdminPortal({
  systemSettings,
  onUpdateSettings,
  users,
  auditLogs,
  onLogout,
  resignations,
  assets,
  assetAuditTrail,
  onAssignAsset,
  onReturnAsset,
  onUpdateAssetStatus,
  onCreateAsset
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex font-sans">
      {/* SideNavBar */}
      <aside className="bg-[#131318] border-r border-[#3b494b]/40 h-screen w-64 fixed left-0 top-0 flex flex-col py-4 px-2 z-50">
        <div className="flex flex-col items-start mb-12 mt-6 px-6">
          <h1 className="text-xl font-bold text-[#00dbe9] tracking-tight text-left">
            RESIGNTRACK
          </h1>
          <p className="text-[#64748b] text-xs font-medium">Admin Portal</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-4 h-10 rounded-[8px] text-sm transition-all duration-150 ${
                activeTab === item.id
                  ? 'bg-[#00dbe9] text-[#131318] font-bold scale-[0.98]'
                  : 'text-[#b9cacb] hover:bg-[#2a292f] font-normal'
              }`}
            >
              <Icon fill={activeTab === item.id}>{item.icon}</Icon>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-4 px-4 h-10 rounded-[8px] text-[#b9cacb] text-sm hover:bg-[#2a292f] transition-colors w-full"
          >
            <Icon>help_outline</Icon>
            Help Center
          </button>
          {onLogout && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-4 px-4 h-10 rounded-[8px] text-[#ffb4ab] text-sm hover:bg-[#ffb4ab]/50 transition-colors w-full"
            >
              <Icon>logout</Icon>
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        {/* TopAppBar */}
        <header className="bg-[#00dbe9] flex items-center px-6 h-16 sticky top-0 z-40 w-full">
          <h1 className="text-black text-xl font-bold">
            {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 p-8 bg-[#2a292f] overflow-auto">
          {activeTab === 'dashboard' && <AdminDashboard users={users} resignations={resignations} />}
          {activeTab === 'users' && (
            <UserManagement users={users} onSetActiveTab={setActiveTab} />
          )}
          {activeTab === 'resignations' && <ResignationsOversight resignations={resignations} />}
          {activeTab === 'assets' && (
            <AssetManagement
              assets={assets}
              assetAuditTrail={assetAuditTrail}
              onAssignAsset={onAssignAsset}
              onReturnAsset={onReturnAsset}
              onUpdateAssetStatus={onUpdateAssetStatus}
              onCreateAsset={onCreateAsset}
              embedded
            />
          )}
          {activeTab === 'analytics' && <ReportsAnalytics />}
          {activeTab === 'health' && (
            <SystemHealth
              auditLogs={auditLogs}
              onOpenAuditTrail={() => setShowAuditTrail(true)}
            />
          )}
          {activeTab === 'settings' && (
            <PlatformSettings
              systemSettings={systemSettings}
              onUpdateSettings={onUpdateSettings}
              user={users?.[0]}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {showAuditTrail && (
        <AuditTrailModal
          auditLogs={auditLogs}
          onClose={() => setShowAuditTrail(false)}
        />
      )}
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
