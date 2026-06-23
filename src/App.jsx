import { useState, useEffect } from 'react';
import Login from './components/Login';
import EmployeePortal from './components/EmployeePortal';
import HRPortal from './components/HRPortal';
import AdminPortal from './components/AdminPortal';
import {
  getCurrentUser,
  logout as apiLogout,
  fetchUsers,
  fetchResignations,
  submitResignation as apiSubmitResignation,
  updateResignationStatus as apiUpdateResignationStatus,
  fetchSettings,
  updateSettings as apiUpdateSettings,
  fetchAuditLogs,
  addAuditLog as apiAddAuditLog,
  fetchProfile,
  updateProfile,
  submitExitInterview,
  fetchAssets,
  createAsset,
  updateAssetStatus,
  assignAsset,
  returnAsset
} from './api';

function App() {
  const [user, setUser] = useState(getCurrentUser());

  // System settings configured by Admin and read by other portals
  const [systemSettings, setSystemSettings] = useState({
    noticePeriod: 30,
    autoApprove: false,
    reasons: ['Career Growth', 'Better Opportunity', 'Higher Education', 'Health & Medical', 'Personal Reasons', 'Other']
  });

  // Live Audit logs
  const [auditLogs, setAuditLogs] = useState([]);

  // Shared Resignation Requests
  const [resignations, setResignations] = useState([]);

  // System Users configuration, editable by Admin
  const [users, setUsers] = useState([]);

  // Real assets state synced with database
  const [assets, setAssets] = useState([]);

  const assetAuditTrail = auditLogs
    .filter(log => log.actionType && log.actionType.startsWith('Asset'))
    .map(log => ({
      id: log.id,
      action: log.message,
      time: log.time || new Date(log.timestamp).toLocaleTimeString()
    }));

  const handleAssignAsset = async (assetId, employee) => {
    try {
      const email = employee?.email || employee;
      await assignAsset(assetId, email);
      const [assetsData, logsData] = await Promise.all([fetchAssets(), fetchAuditLogs()]);
      setAssets(assetsData);
      setAuditLogs(logsData);
    } catch (err) {
      alert(err.message || 'Failed to assign asset');
    }
  };

  const handleReturnAsset = async (assetId, returnDetails = {}) => {
    try {
      await returnAsset(assetId, returnDetails);
      const [assetsData, logsData] = await Promise.all([fetchAssets(), fetchAuditLogs()]);
      setAssets(assetsData);
      setAuditLogs(logsData);
    } catch (err) {
      alert(err.message || 'Failed to return asset');
    }
  };

  const handleUpdateAssetStatus = async (assetId, status) => {
    try {
      await updateAssetStatus(assetId, status);
      const [assetsData, logsData] = await Promise.all([fetchAssets(), fetchAuditLogs()]);
      setAssets(assetsData);
      setAuditLogs(logsData);
    } catch (err) {
      alert(err.message || 'Failed to update asset status');
    }
  };

  const handleCreateAsset = async (newAsset) => {
    try {
      await createAsset(newAsset);
      const [assetsData, logsData] = await Promise.all([fetchAssets(), fetchAuditLogs()]);
      setAssets(assetsData);
      setAuditLogs(logsData);
    } catch (err) {
      alert(err.message || 'Failed to create asset');
    }
  };

  // Load data when user state changes
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [settingsData, resignationsData, logsData, profileData] = await Promise.all([
          fetchSettings(),
          fetchResignations(),
          fetchAuditLogs(),
          fetchProfile().catch(() => null),
        ]);
        setSystemSettings(settingsData);
        setResignations(resignationsData);
        setAuditLogs(logsData);

        if (profileData?.role === 'hr' || profileData?.role === 'admin' || user.role === 'hr' || user.role === 'admin') {
          const assetsData = await fetchAssets();
          setAssets(assetsData);
        }

        if (profileData) {
          const updatedUser = {
            ...user,
            email: profileData.email || user.email,
            username: profileData.username || user.username,
            role: profileData.role || user.role,
            fullName: profileData.fullName || profileData.full_name,
            phone: profileData.phone,
            dob: profileData.dob,
            designation: profileData.designation,
            address: profileData.address,
          };

          const hasChanged =
            user.email !== updatedUser.email ||
            user.username !== updatedUser.username ||
            user.role !== updatedUser.role ||
            user.fullName !== updatedUser.fullName ||
            user.phone !== updatedUser.phone ||
            user.dob !== updatedUser.dob ||
            user.designation !== updatedUser.designation ||
            user.address !== updatedUser.address;

          if (hasChanged) {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }

        if (user.role === 'admin' || user.role === 'hr') {
          const usersData = await fetchUsers();
          setUsers(usersData);
        }
      } catch (err) {
        console.error('Failed to load data from backend:', err);
      }
    };

    loadData();
  }, [user]);

  // Add a log to the audit stream
  const addAuditLog = async (message) => {
    try {
      const newLog = await apiAddAuditLog(message);
      setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
    } catch (err) {
      console.error('Failed to add audit log:', err);
    }
  };

  // Login handler
  const handleLoginSuccess = (role, email) => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    addAuditLog(`User session opened: [${email}] logged in as ${role.toUpperCase()}.`);
  };

  // Logout handler
  const handleLogout = () => {
    if (user) {
      addAuditLog(`User session closed: [${user.email}] signed out.`);
    }
    apiLogout();
    setUser(null);
  };

  // Submit new Resignation (Employee Portal)
  const handleSubmitResignation = (createdResignation) => {
    setResignations((prev) => {
      const filtered = prev.filter(r => r.id !== createdResignation.id && r.email !== createdResignation.email);
      return [createdResignation, ...filtered];
    });
    addAuditLog(`Exit request submitted: Employee [${createdResignation.email}] filed resignation (${createdResignation.reason}).`);
  };

  const handleWithdrawResignation = async (resignationId) => {
    try {
      const updated = await withdrawResignation(resignationId);
      setResignations(prev => prev.map(r => r.id === resignationId ? updated : r));
      addAuditLog(`Exit request withdrawn: Employee [${updated.email}] withdrew resignation.`);
      alert('Resignation withdrawn successfully.');
    } catch (err) {
      alert(err.message || 'Failed to withdraw resignation');
    }
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const updated = await updateProfile(profileData);
      const updatedUser = {
        ...user,
        email: updated.email || user.email,
        username: updated.username || user.username,
        fullName: updated.fullName || updated.full_name,
        phone: updated.phone,
        dob: updated.dob,
        designation: updated.designation,
        address: updated.address,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      addAuditLog(`User profile updated: [${user.email}].`);
      alert('Profile updated successfully.');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleSaveExitInterview = async (resignationId, exitFeedback) => {
    try {
      const updated = await submitExitInterview(resignationId, exitFeedback);
      setResignations(prev => prev.map(r => r.id === resignationId ? updated : r));
      addAuditLog(`Exit interview feedback updated for [${updated.email}].`);
    } catch (err) {
      alert(err.message || 'Failed to save exit interview');
    }
  };

  // Approve or Reject Resignation (HR Portal)
  const handleUpdateStatus = async (idOrEmail, status) => {
    try {
      // Find by id if possible, otherwise fall back to matching email
      const target = resignations.find(r => r.id === idOrEmail || r.email === idOrEmail);
      if (!target) return;

      const updated = await apiUpdateResignationStatus(target.id, status);
      setResignations((prev) =>
        prev.map((r) => r.id === target.id ? updated : r)
      );
      addAuditLog(`Exit status review: HR set [${updated.email}] resignation status to ${status.toUpperCase()}.`);
    } catch (err) {
      alert(err.message || 'Failed to update resignation status');
    }
  };

  // Update System Settings (Admin Portal)
  const handleUpdateSettings = async (newSettings) => {
    try {
      const updated = await apiUpdateSettings(newSettings);
      setSystemSettings(updated);
      addAuditLog('System configurations updated by Admin.');
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const handleRefreshUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to refresh users:', err);
    }
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminPortal
        systemSettings={systemSettings}
        onUpdateSettings={handleUpdateSettings}
        users={users}
        onRefreshUsers={handleRefreshUsers}
        auditLogs={auditLogs}
        onLogout={handleLogout}
        resignations={resignations}
        assets={assets}
        assetAuditTrail={assetAuditTrail}
        onAssignAsset={handleAssignAsset}
        onReturnAsset={handleReturnAsset}
        onUpdateAssetStatus={handleUpdateAssetStatus}
        onCreateAsset={handleCreateAsset}
      />
    );
  }

  if (user.role === 'employee') {
    return (
      <EmployeePortal
        user={user}
        resignations={resignations}
        onSubmitResignation={handleSubmitResignation}
        onWithdrawResignation={handleWithdrawResignation}
        systemSettings={systemSettings}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
        onSaveExitInterview={handleSaveExitInterview}
      />
    );
  }

  if (user.role === 'hr') {
    return (
      <HRPortal
        user={user}
        resignations={resignations}
        onUpdateStatus={handleUpdateStatus}
        onLogout={handleLogout}
        assets={assets}
        assetAuditTrail={assetAuditTrail}
        onAssignAsset={handleAssignAsset}
        onReturnAsset={handleReturnAsset}
        onUpdateAssetStatus={handleUpdateAssetStatus}
        onCreateAsset={handleCreateAsset}
      />
    );
  }

  return (
    <div className="text-center py-12 text-sm text-red-500 font-bold">Access role unknown.</div>
  );
}

export default App;
