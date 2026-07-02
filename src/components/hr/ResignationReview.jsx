import { useState, useEffect } from 'react';
import Icon from '../Icon';
import OffboardingApprovalModal from './OffboardingApprovalModal';
import OffboardingProcess from './OffboardingProcess';
import { fetchResignationChecklistTasksForHR, updateChecklistTaskStatus } from '../../api';

export default function ResignationReview({
  resignations,
  onUpdateStatus,
  setActiveTab,
  selectedEmployee,
  assets,
  onReturnAsset
}) {
  const activeResignation = resignations?.find(r => r.email === selectedEmployee?.email);
  const [checklistTasks, setChecklistTasks] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    if (activeResignation) {
      fetchResignationChecklistTasksForHR(activeResignation.id)
        .then(setChecklistTasks)
        .catch(console.error);
    }
  }, [activeResignation]);

  const handleTaskToggle = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await updateChecklistTaskStatus(taskId, nextStatus);
      setChecklistTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (err) {
      alert(err.message || 'Failed to update checklist task');
    }
  };

  const handleApprovalConfirm = async () => {
    if (!activeResignation) return;
    try {
      await onUpdateStatus(activeResignation.id, 'Approved');
      setShowApprovalModal(false);
      setActiveTab('Dashboard');
    } catch (err) {
      alert(err.message || 'Failed to approve resignation');
    }
  };

  const handleRejectResignation = async () => {
    if (!activeResignation) return;
    if (!window.confirm('Are you sure you want to reject this resignation request?')) return;
    try {
      await onUpdateStatus(activeResignation.id, 'Rejected');
      setActiveTab('Dashboard');
    } catch (err) {
      alert(err.message || 'Failed to reject resignation');
    }
  };

  const completedCount = checklistTasks.filter(t => t.status === 'Completed').length;
  const totalCount = checklistTasks.length;

  if (!activeResignation) {
    return (
      <div className="pt-24 px-8 pb-12 text-center text-[#b9cacb] max-w-[1400px] mx-auto">
        <h2 className="text-xl font-bold text-[#ffb4ab]">No active resignation found for this case.</h2>
        <button 
          onClick={() => setActiveTab('Dashboard')}
          className="mt-4 px-6 py-2.5 bg-[#00dbe9] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const stepStatusClass = (step) => {
    if (activeResignation.status === step) {
      return 'border-2 border-[#00dbe9] text-[#00dbe9]';
    }
    const order = ['Pending', 'Approved'];
    const currentIdx = order.indexOf(activeResignation.status);
    const stepIdx = order.indexOf(step);
    if (currentIdx > stepIdx) {
      return 'bg-[#00dbe9] text-white';
    }
    return 'border-2 border-[#3b494b] text-[#b9cacb]';
  };

  return (
    <div className="pt-24 pb-12 px-8 space-y-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header Section with Real-time Status */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#b9cacb] text-xs font-medium">
            <span onClick={() => setActiveTab('Dashboard')} className="hover:text-[#00dbe9] transition-colors cursor-pointer">Resignations</span>
            <Icon className="text-[14px]">chevron_right</Icon>
            <span>Case #RES-{activeResignation.id}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#00dbe9]">Resignation Review: {activeResignation.name}</h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="flex items-center gap-2 bg-[#00dbe9]/10 text-[#00dbe9] px-4 py-2 rounded-lg text-xs font-medium border border-[#00dbe9]/20">
            <span className="w-2 h-2 bg-[#00dbe9] rounded-full animate-pulse"></span>
            STATUS: {activeResignation.status.toUpperCase()}
          </span>
          <p className="text-[#b9cacb] text-xs font-medium">Employee Email: {activeResignation.email}</p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Details & Status (Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Progress Stepper Card */}
          <div className="bg-[#1f1f24] p-6 rounded-lg shadow-sm border border-[#3b494b]">
            <h3 className="text-xl font-semibold mb-6">Status Tracker</h3>
            <div className="flex items-center justify-between relative px-12">
              {/* Progress Line */}
              <div className="absolute top-4 left-12 right-12 h-0.5 bg-[#3b494b] -z-0">
                <div className="h-full bg-[#00dbe9]" style={{ width: activeResignation.status === 'Approved' ? '100%' : '50%' }}></div>
              </div>
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#00dbe9] text-white rounded-full flex items-center justify-center font-bold">
                  <Icon className="text-[18px]">check</Icon>
                </div>
                <span className="text-xs font-medium text-[#00dbe9]">Submitted</span>
                <span className="text-[10px] text-[#b9cacb] uppercase">{activeResignation.submissionDate}</span>
              </div>
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold bg-[#1f1f24] ${stepStatusClass('Pending')}`}>
                  {activeResignation.status === 'Approved' ? <Icon className="text-[18px]">check</Icon> : '2'}
                </div>
                <span className={`text-xs font-bold ${activeResignation.status === 'Pending' ? 'text-[#00dbe9]' : 'text-[#b9cacb]'}`}>Under Review</span>
                <span className="text-[10px] text-[#b9cacb] uppercase">In Progress</span>
              </div>
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold bg-[#1f1f24] ${stepStatusClass('Approved')}`}>
                  3
                </div>
                <span className={`text-xs font-medium ${activeResignation.status === 'Approved' ? 'text-[#00dbe9]' : 'text-[#b9cacb]'}`}>Approved</span>
                <span className="text-[10px] text-[#b9cacb] uppercase">Final Stage</span>
              </div>
            </div>
          </div>

          {/* Employee Details Card */}
          <div className="bg-[#1f1f24] p-6 rounded-lg shadow-sm border border-[#3b494b] grid grid-cols-2 gap-6">
            <div className="col-span-2 border-b border-[#3b494b] pb-4 mb-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Employee Details</h3>
              <span className="text-xs font-medium text-[#b9cacb]">ID: EMP-{activeResignation.id}</span>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Position</label>
                <p className="text-base font-semibold">{selectedEmployee?.role || activeResignation.department || 'Employee'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Department</label>
                <p className="text-base">{activeResignation.department || 'General'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Reason for leaving</label>
                <div className="bg-[#2a292f] p-4 rounded-lg border border-[#3b494b] italic text-[#b9cacb] text-sm">
                  "{activeResignation.reason || 'Not specified'}"
                </div>
              </div>
            </div>
            <div className="space-y-6 border-l border-[#3b494b] pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Last Working Day</label>
                  <p className="text-base font-bold text-[#ffb4ab]">{activeResignation.relievingDate}</p>
                </div>
                <Icon className="text-[#b9cacb]">calendar_today</Icon>
              </div>
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Comments</label>
                <p className="text-sm text-[#e4e1e9]">{activeResignation.comments || 'No comments'}</p>
              </div>
            </div>
          </div>

          {/* Approval Workflow Section */}
          <div className="bg-[#1f1f24] p-6 rounded-lg shadow-sm border border-[#3b494b]">
            <div className="flex items-center gap-4 mb-6">
              <Icon className="text-[#00dbe9]">rule</Icon>
              <h3 className="text-xl font-semibold">Approval Workflow</h3>
            </div>
            <div className="space-y-6">
              {['Pending', 'Awaiting Approval'].includes(activeResignation.status) ? (
                <div className="flex flex-col items-end gap-4 w-full">
                  {(completedCount < totalCount || totalCount === 0) && (
                    <div className="text-xs text-[#ffb4ab] font-medium bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 p-2.5 rounded-lg flex items-center gap-1.5">
                      <Icon className="text-sm">warning</Icon>
                      Exit checklist must be completed before approval.
                    </div>
                  )}
                  <div className="flex justify-end gap-4 w-full">
                    <button 
                      onClick={handleRejectResignation} 
                      className="px-6 py-4 border border-[#ffb4ab] text-[#ffb4ab] text-xs font-medium rounded-lg hover:bg-[#ffb4ab]/10 transition-all"
                    >
                      Reject Resignation
                    </button>
                    <button 
                      disabled={completedCount < totalCount || totalCount === 0}
                      onClick={() => setShowApprovalModal(true)} 
                      className="px-6 py-4 bg-[#00dbe9] text-[#131318] text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={completedCount < totalCount || totalCount === 0 ? "All exit checklist tasks must be completed before approval" : "Approve Resignation"}
                    >
                      <Icon className="text-[18px]">check_circle</Icon>
                      Approve Resignation
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#b9cacb] italic">This resignation is {activeResignation.status}. No workflow actions are pending.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Checklist & Meta (Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Exit Checklist */}
          <div className="bg-[#1f1f24] p-6 rounded-lg shadow-sm border border-[#3b494b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Exit Checklist</h3>
              <span className="text-xs font-medium text-[#b9cacb]">{completedCount}/{totalCount} Complete</span>
            </div>
            <div className="space-y-4">
              {checklistTasks.length === 0 ? (
                <p className="text-sm text-[#b9cacb] text-center py-4">No exit checklist tasks generated yet.</p>
              ) : (
                checklistTasks.map((task) => {
                  const isTaskCompleted = task.status === 'Completed';
                  const isTaskScheduled = task.status === 'Scheduled';
                  return (
                    <label 
                      key={task.id} 
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                        isTaskCompleted 
                          ? 'bg-[#2a292f] border-[#3b494b]' 
                          : isTaskScheduled 
                            ? 'border-dashed border-[#3b494b] hover:bg-[#2a292f]' 
                            : 'border-dashed border-[#3b494b] hover:bg-[#2a292f] hover:border-[#00dbe9]'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isTaskCompleted}
                        onChange={() => handleTaskToggle(task.id, task.status)}
                        className="rounded text-[#00dbe9] focus:ring-[#00dbe9] h-5 w-5 cursor-pointer" 
                      />
                      <div className="flex flex-col flex-1">
                        <span className={`text-sm font-semibold ${isTaskCompleted ? 'line-through text-[#b9cacb]' : ''}`}>{task.title}</span>
                        <span className="text-xs font-medium text-[#b9cacb]">{task.description}</span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Stakeholders Card */}
          <div className="bg-[#00dbe9] text-white p-6 rounded-lg shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#00dbe9] rounded-full opacity-20"></div>
            <h3 className="text-xl font-semibold mb-6 relative z-10">Assigned Stakeholders</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#1f1f24]/10 transition-colors">
                <img alt="Sarah Jenkins" className="w-10 h-10 rounded-lg border border-white/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaewbGuMndcVJweMKo1DJPxNqnuLgUHGUu_tQG0AHJ6ze5VKtlGmVLpuRst_Ec0DARSx-wRxJPPdoSq47UDiYF8F4kvTHumYk3SyI-OOOI2P9o75Rq5tKWTVB38e_Lt9-edKsOnpv1n5pnfwwFwKE7SOI1rW9apfsAFBxQH-ii27TOVQQPKV3ENCQl2UTJ03D0W5RAxcNiwek5LtaKiLrF7UVmXqz13ltSFOe9u1uR_SAcdfBOzwUumNmpRRGYWHZvzR6PgmNmr1cx" />
                <div>
                  <p className="text-xs font-bold">Sarah Jenkins</p>
                  <p className="text-[10px] opacity-80 uppercase">Primary HR Case Manager</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#1f1f24]/10 transition-colors">
                <img alt="David Chen" className="w-10 h-10 rounded-lg border border-white/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXB35R0uvbx_FKh7OG7ZdGEFNxUNDHQl_t3l1NS0AdR4bciV-8Dnz05WhnWF_a_tb-a7wmChCgs_cfsjpfepqAGhaIGv9kRuOraYnldKRD_0oZu_wYkUwNRPS1eNldm9n2BEn9_AbaBb0MMUlcC8ptorT3G_vIyxx8coK-qaxOqAbqbXTMRhTRmxI_M0BPKre7Oz6VFdurx-r_VwTMJW9-mVeFm8fIRYUDV6c4xH_vqbUICMJ3U54eP8f3TTUNY5t4AVFLBPSChGwxZ_" />
                <div>
                  <p className="text-xs font-bold">David Chen</p>
                  <p className="text-[10px] opacity-80 uppercase">IT Offboarding Lead</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && activeResignation && (
        <OffboardingApprovalModal
          resignation={activeResignation}
          onConfirm={handleApprovalConfirm}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}
