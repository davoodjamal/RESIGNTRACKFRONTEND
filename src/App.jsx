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
  returnAsset,
  fetchNoticePeriod,
  withdrawResignation,
  fetchChecklistTasks,
  updateChecklistTaskStatus,
  fetchAssetAuditTrail,
  createRescheduleRequest,
  fetchRescheduleRequests,
  decideRescheduleRequest,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from './api';

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [loadingData, setLoadingData] = useState(true);

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

  const [noticePeriodData, setNoticePeriodData] = useState(null);

  const [checklistTasks, setChecklistTasks] = useState([]);

  // System Users configuration, editable by Admin
  const [users, setUsers] = useState([]);

  // Real assets state synced with database
  const [assets, setAssets] = useState([]);
  const [assetAuditTrail, setAssetAuditTrail] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleAssignAsset = async (assetId, employee) => {
    try {
      const email = employee?.email || employee;
      await assignAsset(assetId, email);
      const [assetsData, auditData] = await Promise.all([
        fetchAssets(),
        fetchAssetAuditTrail()
      ]);
      setAssets(assetsData);
      setAssetAuditTrail(auditData);
    } catch (err) {
      alert(err.message || 'Failed to assign asset');
    }
  };

  const handleReturnAsset = async (assetId, returnDetails = {}) => {
    try {
      await returnAsset(assetId, returnDetails);
      const [assetsData, auditData] = await Promise.all([
        fetchAssets(),
        fetchAssetAuditTrail()
      ]);
      setAssets(assetsData);
      setAssetAuditTrail(auditData);
    } catch (err) {
      alert(err.message || 'Failed to return asset');
    }
  };

  const handleUpdateAssetStatus = async (assetId, status) => {
    try {
      await updateAssetStatus(assetId, status);
      const assetsData = await fetchAssets();
      setAssets(assetsData);
    } catch (err) {
      alert(err.message || 'Failed to update asset status');
    }
  };

  const handleCreateAsset = async (newAsset) => {
    try {
      await createAsset(newAsset);
      const assetsData = await fetchAssets();
      setAssets(assetsData);
    } catch (err) {
      alert(err.message || 'Failed to create asset');
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [settingsData, resignationsData, logsData, profileData, noticePeriodInfo, checklistData, notificationsData] = await Promise.all([
          fetchSettings(),
          fetchResignations(),
          fetchAuditLogs(),
          fetchProfile().catch(() => null),
          user.role === 'employee' ? fetchNoticePeriod().catch(() => null) : Promise.resolve(null),
          user.role === 'employee' ? fetchChecklistTasks().catch(() => []) : Promise.resolve([]),
          fetchNotifications().catch(() => []),
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
          const [usersData, assetsData, auditData] = await Promise.all([
            fetchUsers(),
            fetchAssets().catch(() => []),
            fetchAssetAuditTrail().catch(() => [])
          ]);
          setUsers(usersData);
          setAssets(assetsData);
          setAssetAuditTrail(auditData);
          setNotifications(notificationsData);
        } else if (user.role === 'employee') {
          const assetsData = await fetchAssets().catch(() => []);
          setAssets(assetsData);
          setNotifications(notificationsData);
          if (noticePeriodInfo) {
            setNoticePeriodData(noticePeriodInfo);
          }
          if (checklistData) {
            setChecklistTasks(checklistData);
          }
        }
      } catch (err) {
        console.error('Failed to load data from backend:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const pollAssets = async () => {
      try {
        const assetsData = await fetchAssets().catch(() => []);
        setAssets(assetsData);

        if (user.role === 'admin' || user.role === 'hr') {
          const auditData = await fetchAssetAuditTrail().catch(() => []);
          setAssetAuditTrail(auditData);
        }
      } catch (err) {
        console.error('Failed to poll assets in real-time:', err);
      }
    };

    const interval = setInterval(pollAssets, 5000);
    return () => clearInterval(interval);
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
    setLoadingData(true);
    addAuditLog(`User session opened: [${email}] logged in as ${role.toUpperCase()}.`);
  };

  // Logout handler
  const handleLogout = () => {
    if (user) {
      addAuditLog(`User session closed: [${user.email}] signed out.`);
    }
    apiLogout();
    setUser(null);
    setLoadingData(true);
  };

  // Submit new Resignation (Employee Portal)
  const handleSubmitResignation = (createdResignation) => {
    setResignations((prev) => {
      const filtered = prev.filter(r => r.id !== createdResignation.id && r.email !== createdResignation.email);
      return [createdResignation, ...filtered];
    });
    addAuditLog(`Exit request submitted: Employee [${createdResignation.email}] filed resignation (${createdResignation.reason}).`);
    fetchNoticePeriod().then(setNoticePeriodData).catch(console.error);
    fetchChecklistTasks().then(setChecklistTasks).catch(console.error);
  };

  const handleWithdrawResignation = async (resignationId) => {
    try {
      const updated = await withdrawResignation(resignationId);
      setResignations(prev => prev.map(r => r.id === resignationId ? updated : r));
      addAuditLog(`Exit request withdrawn: Employee [${updated.email}] withdrew resignation.`);
      setNoticePeriodData(null);
      setChecklistTasks([]);
      alert('Resignation withdrawn successfully.');
    } catch (err) {
      alert(err.message || 'Failed to withdraw resignation');
    }
  };

  const handleUpdateChecklistTaskStatus = async (taskId, status) => {
    try {
      const updatedTask = await updateChecklistTaskStatus(taskId, status);
      setChecklistTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      addAuditLog(`Exit checklist task updated: [${updatedTask.title}] status set to ${status.toUpperCase()}.`);
    } catch (err) {
      alert(err.message || 'Failed to update task status');
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

  const handleSaveExitInterview = async (resignationId, exitFeedback, status) => {
    try {
      await submitExitInterview(resignationId, exitFeedback, status);
      const resignationsData = await fetchResignations();
      setResignations(resignationsData);
      const target = resignationsData.find(r => r.id === resignationId);
      if (target) {
        addAuditLog(`Exit interview feedback updated for [${target.email}].`);
      }
    } catch (err) {
      alert(err.message || 'Failed to save exit interview');
    }
  };

  const handleRescheduleRequest = async (requestData) => {
    try {
      const updatedRequest = await createRescheduleRequest(requestData);
      const resignationsData = await fetchResignations();
      setResignations(resignationsData);
      return updatedRequest;
    } catch (err) {
      throw new Error(err.message || 'Failed to submit reschedule request');
    }
  };

  const handleDecideRescheduleRequest = async (requestId, decision, comments) => {
    try {
      const result = await decideRescheduleRequest(requestId, decision, comments);
      const resignationsData = await fetchResignations();
      setResignations(resignationsData);
      addAuditLog(`Exit interview reschedule ${decision.toLowerCase()}: ID ${requestId}.`);
      return result;
    } catch (err) {
      throw new Error(err.message || 'Failed to submit reschedule decision');
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await markNotificationRead(id);
      const notifs = await fetchNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllNotificationsRead();
      const notifs = await fetchNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
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

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#131318] text-[#e4e1e9]">
        <span className="animate-spin material-symbols-outlined text-[48px] text-[#00dbe9]">progress_activity</span>
        <p className="text-[#b9cacb] text-sm font-medium">Loading session...</p>
      </div>
    );
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
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
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
        noticePeriodData={noticePeriodData}
        checklistTasks={checklistTasks}
        onUpdateTaskStatus={handleUpdateChecklistTaskStatus}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
        onSaveExitInterview={handleSaveExitInterview}
        assets={assets}
        onUpdateAssetStatus={handleUpdateAssetStatus}
        onRescheduleRequest={handleRescheduleRequest}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
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
        onDecideRescheduleRequest={handleDecideRescheduleRequest}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />
    );
  }

  return (
    <div className="text-center py-12 text-sm text-red-500 font-bold">Access role unknown.</div>
  );
}

export default App;
