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
  submitExitInterview
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

  // Simulated assets state to prevent reference errors in Admin and HR portals
  const [assets, setAssets] = useState([
    { id: '1', name: 'MacBook Pro 16"', type: 'Laptop', serial: 'C02F2345Q6W7', status: 'Assigned', assignedTo: 'davood@resigntrack.com' },
    { id: '2', name: 'Dell UltraSharp 27"', type: 'Monitor', serial: 'CN-098765-ABCD', status: 'Available', assignedTo: '' },
    { id: '3', name: 'iPhone 15 Pro', type: 'Mobile', serial: 'DNP987654321', status: 'Available', assignedTo: '' }
  ]);

  const [assetAuditTrail, setAssetAuditTrail] = useState([
    { id: '1', assetId: '1', action: 'Assign', performedBy: 'hr@resigntrack.com', date: '2026-06-10', notes: 'Assigned to Davood jamal' }
  ]);

  const handleAssignAsset = (assetId, email) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'Assigned', assignedTo: email } : a));
    setAssetAuditTrail(prev => [
      { id: Date.now().toString(), assetId, action: 'Assign', performedBy: user?.email || 'System', date: new Date().toISOString().split('T')[0], notes: `Assigned to ${email}` },
      ...prev
    ]);
  };

  const handleReturnAsset = (assetId) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'Available', assignedTo: '' } : a));
    setAssetAuditTrail(prev => [
      { id: Date.now().toString(), assetId, action: 'Return', performedBy: user?.email || 'System', date: new Date().toISOString().split('T')[0], notes: 'Returned to inventory' },
      ...prev
    ]);
  };

  const handleUpdateAssetStatus = (assetId, status) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status } : a));
  };

  const handleCreateAsset = (newAsset) => {
    setAssets(prev => [...prev, { ...newAsset, id: (prev.length + 1).toString() }]);
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
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
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
  const handleSubmitResignation = async (newResignation) => {
    try {
      const createdResignation = await apiSubmitResignation(newResignation);
      setResignations((prev) => [createdResignation, ...prev]);
      addAuditLog(`Exit request submitted: Employee [${createdResignation.email}] filed resignation (${createdResignation.reason}).`);
    } catch (err) {
      alert(err.message || 'Failed to submit resignation');
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
