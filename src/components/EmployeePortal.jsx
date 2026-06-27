import { useState, useEffect } from 'react';
import Icon from './Icon';
import HelpModal from './HelpModal';
import { searchGlobal } from '../api';

import EmployeeDashboard from './employee/EmployeeDashboard';
import ResignationSubmission from './employee/ResignationSubmission';
import OffboardingChecklist from './employee/OffboardingChecklist';
import EmployeeProfile from './employee/EmployeeProfile';
import EditProfilePage from './employee/EditProfilePage';
import ExitInterview from './employee/ExitInterview';
import AssetManagement from './employee/AssetManagement';


export default function EmployeePortal({
  user,
  resignations,
  onSubmitResignation,
  onWithdrawResignation,
  systemSettings,
  noticePeriodData,
  checklistTasks,
  onUpdateTaskStatus,
  onLogout,
  onUpdateProfile,
  onSaveExitInterview,
  assets,
  onUpdateAssetStatus,
  onRescheduleRequest,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead
}) {
  const employeeResignation = resignations.find(r => r.email === user.email);
  const hasActiveResignation = !!(employeeResignation && ['Awaiting Exit Interview', 'Pending', 'Approved', 'More Info Requested', 'Pending HR Review', 'Exit Interview Pending', 'Exit Interview Submitted', 'Awaiting Approval'].includes(employeeResignation.status));
  const [activeTab, setActiveTab] = useState(hasActiveResignation ? 'dashboard' : 'resignation');
  const [profileView, setProfileView] = useState('profile');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (employeeResignation) {
          if (employeeResignation.status === 'Withdrawn') {
            return (
              <div className="flex items-center justify-center h-full text-[#b9cacb] pt-20">
                 <div className="text-center">
                    <Icon className="text-[64px] mb-4 text-[#ffb4ab]">cancel</Icon>
                    <p className="text-lg font-bold text-[#ffb4ab]">You have withdrawn your resignation request.</p>
                    <p className="text-sm mt-1">If this was a mistake, you can submit a new resignation request.</p>
                    <button 
                      onClick={() => setActiveTab('resignation')}
                      className="mt-6 px-6 py-2.5 bg-[#00dbe9] text-[#131318] rounded-xl font-bold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,219,233,0.3)]"
                    >
                      Go to Resignation Submission
                    </button>
                 </div>
              </div>
            );
          }
          return (
            <EmployeeDashboard 
              user={user} 
              resignation={employeeResignation} 
              systemSettings={systemSettings}
              noticePeriodData={noticePeriodData}
              checklistTasks={checklistTasks}
              onWithdraw={() => onWithdrawResignation(employeeResignation.id)}
              onReapply={() => setActiveTab('resignation')}
              onStartExitInterview={() => setActiveTab('exit-interview')}
            />
          );
        }
        return (
          <div className="flex items-center justify-center h-full text-[#b9cacb] pt-20">
             <div className="text-center">
                <Icon className="text-[64px] mb-4 text-[#3b494b]">info</Icon>
                <p className="text-lg font-bold">No active resignation found.</p>
                <p className="text-sm">Please submit a resignation first.</p>
                <button 
                  onClick={() => setActiveTab('resignation')}
                  className="mt-4 px-6 py-2 bg-[#00dbe9] text-white rounded-xl font-bold"
                >
                  Go to Submission
                </button>
             </div>
          </div>
        );
      case 'resignation':
        return (
          <ResignationSubmission 
            user={user} 
            systemSettings={systemSettings} 
            onSubmitResignation={(data) => {
              onSubmitResignation(data);
              setActiveTab('dashboard');
            }} 
          />
        );
      case 'offboarding':
        return (
          <OffboardingChecklist 
            user={user} 
            resignation={employeeResignation} 
            noticePeriodData={noticePeriodData} 
            checklistTasks={checklistTasks}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onStartInterview={() => setActiveTab('exit-interview')} 
            onRescheduleRequest={onRescheduleRequest}
          />
        );
      case 'assets':
        return <AssetManagement user={user} resignation={employeeResignation} assets={assets} onUpdateAssetStatus={onUpdateAssetStatus} />;
      case 'exit-interview':
        return (
          <ExitInterview 
            user={user} 
            resignation={employeeResignation} 
            onSubmit={(feedback) => {
              if (employeeResignation) {
                onSaveExitInterview(employeeResignation.id, feedback, 'SUBMITTED');
                alert('Exit interview submitted successfully.');
                setActiveTab('dashboard');
              } else {
                alert('No active resignation found to attach exit interview.');
              }
            }}
            onSave={(feedback) => {
              if (employeeResignation) {
                onSaveExitInterview(employeeResignation.id, feedback, 'DRAFT');
                alert('Draft saved successfully.');
              } else {
                alert('No active resignation found to save draft.');
              }
            }}
          />
        );
      case 'profile':
        return profileView === 'edit-profile' ? (
          <EditProfilePage 
            user={user} 
            onBack={() => setProfileView('profile')} 
            onSaveProfile={(data) => {
              onUpdateProfile(data);
              setProfileView('profile');
            }}
          />
        ) : (
          <EmployeeProfile user={user} onEditProfile={() => setProfileView('edit-profile')} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#131318] text-[#e4e1e9] font-sans min-h-screen relative" onClick={() => { setIsNotificationsOpen(false); setShowSearchResults(false); }}>
      <SideNav 
         activeTab={activeTab} 
         setActiveTab={setActiveTab} 
         onOpenProfile={() => setProfileView('profile')}
         onOpenHelp={() => setIsHelpOpen(true)}
         onOpenLogout={() => setIsLogoutOpen(true)}
         hasActiveResignation={!!(employeeResignation && ['Awaiting Exit Interview', 'Pending', 'Approved', 'More Info Requested', 'Pending HR Review', 'Exit Interview Pending', 'Exit Interview Submitted', 'Awaiting Approval'].includes(employeeResignation.status))}
      />
      
      <Header 
         user={user} 
         isNotificationsOpen={isNotificationsOpen} 
         setIsNotificationsOpen={setIsNotificationsOpen} 
         notifications={notifications}
         onMarkNotificationRead={onMarkNotificationRead}
         onMarkAllNotificationsRead={onMarkAllNotificationsRead}
         setActiveTab={setActiveTab}
         showSearchResults={showSearchResults}
         setShowSearchResults={setShowSearchResults}
      />

      <main className="lg:ml-64 pt-16 min-h-screen overflow-x-hidden overflow-y-auto pb-12">
         {renderContent()}
      </main>

      {/* Modals */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      {isLogoutOpen && <LogoutModal onClose={() => setIsLogoutOpen(false)} onLogout={onLogout} />}
    </div>
  );
}

function SideNav({ activeTab, setActiveTab, onOpenProfile, onOpenHelp, onOpenLogout, hasActiveResignation }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'profile', label: 'Profile', icon: 'person' },
    ...(!hasActiveResignation ? [{ id: 'resignation', label: 'Resignation', icon: 'description' }] : []),
    ...(hasActiveResignation ? [{ id: 'offboarding', label: 'Offboarding', icon: 'fact_check' }] : []),
    { id: 'assets', label: 'Assets', icon: 'inventory_2' }
  ];

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#2a292f] border-r border-[#3b494b] p-4 space-y-1 z-20">
      <div className="mb-8 px-4 py-4">
        <h1 className="text-2xl font-bold text-[#00dbe9] tracking-tight">RESIGN TRACK</h1>
        <p className="text-[10px] text-[#b9cacb] uppercase tracking-wider font-bold mt-1">Enterprise Offboarding</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'profile') onOpenProfile();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all h-12 ${
                active 
                  ? 'bg-[#00dbe9] text-white shadow-sm' 
                  : 'text-[#b9cacb] hover:bg-[#2a292f]'
              }`}
            >
              <Icon fill={active}>{item.icon}</Icon>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 pt-6 border-t border-[#3b494b]">
         <button 
            onClick={onOpenHelp}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2a292f] text-[#b9cacb] hover:bg-[#e0e3e5] rounded-lg text-sm font-bold transition-all h-12"
         >
            <Icon className="text-[20px]">help</Icon>
            <span>NEED HELP?</span>
         </button>
         <button 
            onClick={onOpenLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#ffb4ab] hover:bg-[#ffb4ab]/40 rounded-lg text-sm font-semibold transition-all h-12"
         >
            <Icon>logout</Icon>
            <span>Logout</span>
         </button>
      </div>
    </aside>
  );
}

function Header({ user, isNotificationsOpen, setIsNotificationsOpen, notifications, onMarkNotificationRead, onMarkAllNotificationsRead, setActiveTab, showSearchResults, setShowSearchResults }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowSearchResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchGlobal(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (type) => {
    if (type === 'task') {
      setActiveTab('offboarding');
    } else if (type === 'asset') {
      setActiveTab('assets');
    } else if (type === 'resignation') {
      setActiveTab('dashboard');
    } else if (type === 'user') {
      setActiveTab('offboarding');
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const toggleNotif = (e) => {
     e.stopPropagation();
     setIsNotificationsOpen(!isNotificationsOpen);
  };

  const unreadCount = notifications ? notifications.filter(n => !n.is_read).length : 0;

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 z-40 bg-[#131318] border-b border-[#3b494b]/60 flex justify-between items-center px-6 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block" onClick={(e) => e.stopPropagation()}>
           <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b9cacb] text-[20px]">search</Icon>
           <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, documents, employees..."
              className="w-full bg-[#2a292f] border border-[#3b494b] rounded-full py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all"
           />
           {isSearching && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin material-symbols-outlined text-[16px] text-[#00dbe9]">progress_activity</span>
           )}

           {/* Search Results Dropdown */}
           {showSearchResults && searchResults && (
              <div className="absolute top-12 left-0 right-0 bg-[#1f1f24] border border-[#3b494b] rounded-xl shadow-2xl z-50 overflow-hidden max-h-[400px] overflow-y-auto p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                 {/* Tasks Section */}
                 {searchResults.tasks && searchResults.tasks.length > 0 && (
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#00dbe9] mb-2 px-1">Checklist Tasks</h4>
                       <div className="space-y-1">
                          {searchResults.tasks.map(task => (
                             <div 
                                key={task.id} 
                                onClick={() => handleResultClick('task')}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a292f] cursor-pointer transition-colors text-xs"
                             >
                                <Icon className="text-[#00dbe9]">check_circle</Icon>
                                <div className="flex-1 min-w-0">
                                   <p className="font-bold text-[#e4e1e9] truncate">{task.title}</p>
                                   <p className="text-[10px] text-[#b9cacb] truncate">{task.description}</p>
                                </div>
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#2a292f] border border-[#3b494b] text-[#b9cacb] rounded">{task.status}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Assets Section */}
                 {searchResults.assets && searchResults.assets.length > 0 && (
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#ffb4ab] mb-2 px-1">Assigned Assets</h4>
                       <div className="space-y-1">
                          {searchResults.assets.map(asset => (
                             <div 
                                key={asset.id} 
                                onClick={() => handleResultClick('asset')}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a292f] cursor-pointer transition-colors text-xs"
                             >
                                <Icon className="text-[#ffb4ab]">inventory_2</Icon>
                                <div className="flex-1 min-w-0">
                                   <p className="font-bold text-[#e4e1e9] truncate">{asset.name}</p>
                                   <p className="text-[10px] text-[#b9cacb] truncate">Tag: {asset.tag}</p>
                                </div>
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] rounded">{asset.status}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Stakeholders Section */}
                 {searchResults.users && searchResults.users.length > 0 && (
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#ffe082] mb-2 px-1">HR & Stakeholders</h4>
                       <div className="space-y-1">
                          {searchResults.users.map(u => (
                             <div 
                                key={u.id} 
                                onClick={() => handleResultClick('user')}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a292f] cursor-pointer transition-colors text-xs"
                             >
                                <Icon className="text-[#ffe082]">support_agent</Icon>
                                <div className="flex-1 min-w-0">
                                   <p className="font-bold text-[#e4e1e9] truncate">{u.name}</p>
                                   <p className="text-[10px] text-[#b9cacb] truncate">{u.designation || 'HR Stakeholder'} • {u.email}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Resignation Cases Section */}
                 {searchResults.resignations && searchResults.resignations.length > 0 && (
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#9ccc65] mb-2 px-1">Resignation Document</h4>
                       <div className="space-y-1">
                          {searchResults.resignations.map(res => (
                             <div 
                                key={res.id} 
                                onClick={() => handleResultClick('resignation')}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a292f] cursor-pointer transition-colors text-xs"
                             >
                                <Icon className="text-[#9ccc65]">description</Icon>
                                <div className="flex-1 min-w-0">
                                   <p className="font-bold text-[#e4e1e9] truncate">Case #RES-{res.id}</p>
                                   <p className="text-[10px] text-[#b9cacb] truncate">{res.email}</p>
                                </div>
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded">{res.status}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Empty state */}
                 {Object.values(searchResults).every(arr => arr.length === 0) && (
                    <div className="text-center py-6 text-[#b9cacb] text-xs">
                       <Icon className="text-[32px] mb-2 text-[#3b494b]">search_off</Icon>
                       <p>No results found for "{searchQuery}"</p>
                    </div>
                 )}
              </div>
           )}
        </div>
      </div>

      <div className="flex items-center gap-6">
         <div className="flex items-center gap-5 relative">
            <button onClick={toggleNotif} className="relative text-[#b9cacb] hover:text-[#00dbe9] transition-colors p-1">
               <Icon className="text-[26px]">notifications</Icon>
               {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ffb4ab] rounded-full border-2 border-[#131318]"></span>
               )}
            </button>
            
            <div className="h-8 w-[1px] bg-[#3b494b]"></div>

            <div className="hidden md:flex flex-col items-end">
               <span className="text-sm font-bold text-[#e4e1e9] leading-tight">{user.username || 'Alex Thompson'}</span>
               <span className="text-[11px] font-medium text-[#b9cacb]">{user.designation || 'Employee'}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#00dbe9] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#d8e2ff]">
               {user.username ? user.username.charAt(0) : 'A'}
            </div>

            {/* Notifications Panel */}
            {isNotificationsOpen && (
               <div className="absolute top-14 right-0 w-80 bg-[#1f1f24] border border-[#3b494b] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="p-4 border-b border-[#3b494b]/60 flex justify-between items-center bg-[#2a292f]">
                     <h3 className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider">Notifications</h3>
                     <span className="text-[10px] font-bold bg-[#00dbe9] text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                     {(!notifications || notifications.length === 0) ? (
                        <p className="text-xs text-[#b9cacb] text-center py-4">No notifications.</p>
                     ) : (
                        notifications.map(notif => (
                           <div 
                              key={notif.id} 
                              onClick={(e) => { e.stopPropagation(); !notif.is_read && onMarkNotificationRead(notif.id); }}
                              className={`flex gap-3 items-start p-3 rounded-lg hover:bg-[#2a292f] cursor-pointer transition-colors ${!notif.is_read ? 'bg-[#00dbe9]/5 border-l-2 border-[#00dbe9]' : ''}`}
                           >
                              <Icon className="text-[#00dbe9] mt-0.5">{notif.icon || 'notifications'}</Icon>
                              <div className="flex-1 min-w-0">
                                 <p className={`text-sm ${!notif.is_read ? 'font-bold text-[#00dbe9]' : 'font-medium text-[#e4e1e9]'}`}>{notif.title}</p>
                                 <p className="text-xs text-[#b9cacb] mt-0.5 leading-relaxed">{notif.message}</p>
                              </div>
                              {!notif.is_read && (
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] mt-2 flex-shrink-0"></span>
                              )}
                           </div>
                        ))
                     )}
                  </div>
                  <div className="p-3 bg-[#2a292f] text-center border-t border-[#3b494b]/60 flex justify-between items-center px-4">
                     {unreadCount > 0 && (
                        <button 
                           onClick={(e) => { e.stopPropagation(); onMarkAllNotificationsRead(); }} 
                           className="text-xs font-bold text-[#ffb4ab] hover:underline"
                        >
                           Mark all as read
                        </button>
                     )}
                     <button className="text-xs font-bold text-[#00dbe9] hover:underline ml-auto">View All Activity</button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </header>
  );
}

function LogoutModal({ onClose, onLogout }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#191c1e]/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f1f24] p-10 rounded-[24px] shadow-2xl max-w-sm w-full relative border border-[#3b494b] animate-in zoom-in-95 duration-200">
         <button onClick={onClose} className="absolute top-5 right-5 text-[#b9cacb] hover:text-[#00dbe9] transition-colors p-1 bg-[#2a292f] rounded-full hover:bg-[#2a292f]">
            <Icon>close</Icon>
         </button>
         <div className="flex flex-col items-center text-center space-y-4 pt-2">
            <div className="w-20 h-20 rounded-full bg-[#ffe082]/30 flex items-center justify-center text-[#5a4300] mb-2">
               <Icon className="text-[40px]">lock</Icon>
            </div>
            <h3 className="text-2xl font-black text-[#e4e1e9] tracking-tight">Logout Account</h3>
            <p className="text-sm font-medium text-[#b9cacb] leading-relaxed px-2">Are you sure you want to log out? You will need to sign in again to access your account.</p>
            
            <div className="w-full flex flex-col gap-3 pt-6">
               <button onClick={onLogout} className="w-full py-3.5 px-4 bg-[#00dbe9] text-white font-bold text-base rounded-xl shadow-md hover:bg-[#00dbe9] transition-all">
                  Logout Now
               </button>
               <button onClick={onClose} className="w-full py-3.5 px-4 bg-transparent text-[#b9cacb] font-bold text-base rounded-xl hover:bg-[#2a292f] transition-colors">
                  Cancel
               </button>
            </div>
            <p className="text-xs font-semibold text-[#76777d] pt-4 flex items-center justify-center gap-1.5 uppercase tracking-wider">
               <Icon className="text-[14px]">security</Icon>
               Your session will be securely ended.
            </p>
         </div>
      </div>
    </div>
  );
}

