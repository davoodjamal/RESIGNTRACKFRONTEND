import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchMeetings } from '../../api';

export default function EmployeeDashboard({ user, resignation, onWithdraw, systemSettings, noticePeriodData, checklistTasks, onReapply, onStartExitInterview }) {
   const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
   const [showExitCallModal, setShowExitCallModal] = useState(false);
   const [meetings, setMeetings] = useState([]);
   useEffect(() => {
      fetchMeetings()
         .then(setMeetings)
         .catch(err => console.error("Failed to load meetings:", err));
   }, []);

   const employeeMeeting = meetings?.find(m => m.employeeEmail === user.email);
   const exitInterviewTask = checklistTasks?.find(t => t.title.toLowerCase().includes('exit interview'));
   const isExitInterviewCompleted = exitInterviewTask?.status === 'Completed' || resignation?.exitFeedback?.roleRating > 0 || resignation?.status === 'Exit Interview Submitted' || resignation?.status === 'Approved';
   const hrRemarks = resignation?.exitFeedback?.hr_remarks || resignation?.exit_feedback?.hr_remarks || '';
   const exitInterviewData = {
      initiatedBy: resignation?.status === 'Exit Interview Pending' ? 'HR' : 'Pending',
      status: resignation?.status === 'Exit Interview Pending' ? 'Scheduled' : 'Pending Schedule'
   };

   const noticePeriod = noticePeriodData ? noticePeriodData.notice_period : (systemSettings?.noticePeriod || 30);
   const emergencyReleaseRequested =
      resignation?.exitFeedback?.emergencyReleaseRequested ||
      resignation?.exitFeedback?.immediate_release ||
      resignation?.exitFeedback?.immediateRelease ||
      resignation?.emergencyReleaseRequested ||
      resignation?.immediate_release ||
      resignation?.immediateRelease;

   const calculateDaysLeft = () => {
      if (noticePeriodData && noticePeriodData.has_active_resignation) {
         return noticePeriodData.days_left;
      }
      if (!resignation || !resignation.relievingDate) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const relieving = new Date(resignation.relievingDate);
      relieving.setHours(0, 0, 0, 0);
      const diffTime = relieving.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
   };
   const daysLeft = calculateDaysLeft();

   const progressPercentage = noticePeriodData && noticePeriodData.has_active_resignation
      ? noticePeriodData.progress_percentage
      : Math.max(0, Math.min(100, Math.round(((noticePeriod - daysLeft) / noticePeriod) * 100)));

   const steps = [];

   // Step 1: Submitted
   steps.push({
      label: 'Submitted',
      date: resignation?.submissionDate || 'Waiting',
      status: resignation ? 'completed' : 'upcoming',
      icon: resignation ? 'check' : 'check'
   });

   // Step 2: Under Review
   const isUnderReviewActive = ['Pending HR Review', 'Pending'].includes(resignation?.status);
   const isUnderReviewCompleted = ['Exit Interview Pending', 'Exit Interview Submitted', 'Awaiting Approval', 'Approved'].includes(resignation?.status);
   steps.push({
      label: 'Under Review',
      date: isUnderReviewCompleted ? 'Completed' : (isUnderReviewActive ? 'In Progress' : 'Waiting'),
      status: isUnderReviewCompleted ? 'completed' : (isUnderReviewActive ? 'active' : 'upcoming'),
      icon: isUnderReviewCompleted ? 'check' : 'pending'
   });

   // Step 3: Exit Interview
   const isExitInterviewCompletedState = ['Exit Interview Submitted', 'Awaiting Approval', 'Approved'].includes(resignation?.status);
   const isExitInterviewActive = resignation?.status === 'Exit Interview Pending';
   steps.push({
      label: 'Exit Interview',
      date: isExitInterviewCompletedState ? 'Completed' : (isExitInterviewActive ? 'Initiated' : 'Waiting'),
      status: isExitInterviewCompletedState ? 'completed' : (isExitInterviewActive ? 'active' : 'upcoming'),
      icon: isExitInterviewCompletedState ? 'check' : 'forum'
   });

   // Step 4: Final Meeting
   const isFinalMeetingCompleted = ['Awaiting Approval', 'Approved'].includes(resignation?.status);
   const isFinalMeetingActive = resignation?.status === 'Exit Interview Submitted' && employeeMeeting;
   steps.push({
      label: 'Final Meeting',
      date: isFinalMeetingCompleted ? 'Completed' : (isFinalMeetingActive ? 'Scheduled' : 'Waiting'),
      status: isFinalMeetingCompleted ? 'completed' : (isFinalMeetingActive ? 'active' : 'upcoming'),
      icon: isFinalMeetingCompleted ? 'check' : 'videocam'
   });

   // Step 5: Approved
   const isApproved = resignation?.status === 'Approved';
   const isAwaitingApproval = resignation?.status === 'Awaiting Approval';
   steps.push({
      label: 'Approved',
      date: isApproved ? 'Approved' : (isAwaitingApproval ? 'Awaiting Approval' : 'Waiting'),
      status: isApproved ? 'completed' : (isAwaitingApproval ? 'active' : 'upcoming'),
      icon: 'thumb_up'
   });

   // Step 6: Last Day
   if (!emergencyReleaseRequested) {
      steps.push({
         label: 'Last Day',
         date: resignation?.relievingDate || 'Waiting',
         status: 'upcoming',
         icon: 'event_available'
      });
   }

   const completedStepsCount = steps.filter(s => s.status === 'completed').length;
   const totalProgressSteps = steps.length - 1;
   const transitionProgress = Math.round((completedStepsCount / totalProgressSteps) * 100);

   // Find the index of the last completed step to stop the progress line exactly there
   let lastCompletedIdx = 0;
   steps.forEach((step, idx) => {
      if (step.status === 'completed') {
         lastCompletedIdx = idx;
      }
   });
   const progressPercentageLine = (lastCompletedIdx / totalProgressSteps) * 100;
   const halfStepPercent = 100 / (2 * steps.length);

   return (
      <div className="max-w-7xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
         <div className="mb-10">
            <h2 className="text-4xl font-black text-[#00dbe9] tracking-tight">Hello, {user.fullName || user.username || 'Alex Thompson'}</h2>
            <p className="text-lg text-[#b9cacb] mt-2 font-medium">Your transition journey is <span className="text-[#00dbe9] font-bold">{transitionProgress}% complete</span>. We're here to help you every step of the way.</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Resignation Status Card */}
            <div className="lg:col-span-8 bg-[#1f1f24] rounded-2xl p-8 shadow-sm border border-[#3b494b]">
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                  <div>
                     <h3 className="text-xl font-bold text-[#00dbe9] flex items-center gap-2">
                        <Icon>assignment_turned_in</Icon>
                        Resignation Status
                     </h3>
                     <p className="text-sm text-[#b9cacb] mt-2">Track your resignation progress and access withdrawal options from one place.</p>
                  </div>
                  <div className="flex items-center gap-3">
                     {emergencyReleaseRequested && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ffb4ab] text-[#5c1e1a] flex items-center gap-2">
                           <Icon className="text-[16px]">warning</Icon>
                           EMERGENCY REQUESTED
                        </span>
                     )}
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${resignation.status === 'Approved' ? 'bg-[#d8e2ff] text-[#001a42]' : resignation.status === 'Withdrawn' ? 'bg-[#76777d] text-white' : 'bg-[#ffe082] text-[#5a4300]'
                        }`}>
                        {resignation.status === 'Exit Interview Submitted' ? 'Final Meeting' : resignation.status === 'Approved' ? 'Approval' : resignation.status === 'Awaiting Approval' ? 'Awaiting Approval' : resignation.status}
                     </span>
                  </div>
               </div>
               {resignation.status === 'More Info Requested' && (
                  <div className="mb-8 bg-[#ffe082]/10 rounded-2xl border border-[#ffe082]/20 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                     <div className="flex items-start gap-4">
                        <div className="bg-[#ffe082]/25 p-3 rounded-xl border border-[#ffe082]/30 text-[#ffe082]">
                           <Icon className="text-[28px]">info</Icon>
                        </div>
                        <div className="flex-grow space-y-2">
                           <h4 className="text-lg font-black text-[#ffe082] tracking-wide uppercase">Reapply / Clarification Required</h4>
                           <p className="text-sm text-[#b9cacb] leading-relaxed">
                              HR has requested further clarification regarding your resignation request. Please review their remarks below, update your details, and reapply.
                           </p>
                           {hrRemarks && (
                              <div className="bg-[#131318] p-4 rounded-xl border border-[#3b494b]/50 italic text-sm text-[#ffe082]/90 my-2 font-medium">
                                 "{hrRemarks}"
                              </div>
                           )}
                           <div className="pt-2">
                              <button
                                 type="button"
                                 onClick={onReapply}
                                 className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffe082] text-[#08131f] font-bold rounded-xl hover:bg-[#ffd54f] transition-all shadow-md shadow-[#ffe082]/20 active:scale-95"
                              >
                                 <Icon className="text-[20px]">edit_note</Icon>
                                 Edit & Reapply Resignation
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
                {resignation.status === 'Approved' ? (
                   <div className="mb-8 bg-green-500/10 rounded-2xl border border-green-500/20 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex items-center gap-4">
                         <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30 text-green-400">
                            <Icon className="text-[28px]">check_circle</Icon>
                         </div>
                         <div>
                            <h4 className="text-lg font-bold text-green-400 tracking-wide uppercase">Resignation Approved</h4>
                            <p className="text-sm text-[#b9cacb] mt-1">
                               {emergencyReleaseRequested
                                  ? 'You can leave immediately.'
                                  : 'You Can Leave when completing the Notice Period.'}
                            </p>
                         </div>
                      </div>
                   </div>
                ) : (
                   resignation.status !== 'Withdrawn' && !isExitInterviewCompleted && (
                      <div className="mb-8 bg-[#172028] rounded-2xl border border-[#3b494b] p-5 shadow-sm">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                               <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00dbe9]">Withdraw Submission</p>
                               <p className="text-sm text-[#b9cacb] mt-2">Withdraw your resignation request and resume the normal dashboard workflow.</p>
                            </div>
                            <button
                               type="button"
                               onClick={() => setIsWithdrawOpen(true)}
                               className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#ffb4ab] text-[#ffb4ab] font-semibold rounded-xl hover:bg-[#ffb4ab]/10 transition-all"
                            >
                               <Icon className="text-[20px]">cancel</Icon>
                               Withdraw Submission
                            </button>
                         </div>
                      </div>
                   )
                )}
               <div className="mt-12 mb-4 relative">
                  <div className="flex justify-between relative z-10">
                     {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-4" style={{ width: `${100 / steps.length}%` }}>
                           <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${step.status === 'completed' ? 'bg-[#00dbe9] text-black' :
                              step.status === 'active' ? 'bg-[#1f1f24] border-4 border-[#00dbe9] text-[#00dbe9] animate-pulse' :
                                 'bg-[#e0e3e5] text-[#76777d]'
                              }`}>
                              <Icon className="text-[28px]" fill={step.status === 'completed'}>{step.icon}</Icon>
                           </div>
                           <div className="text-center px-2">
                              <span className={`block text-sm font-bold ${step.status === 'upcoming' ? 'text-[#76777d]' : 'text-[#00dbe9]'}`}>{step.label}</span>
                              <span className="block text-xs font-medium text-[#b9cacb] mt-1">{step.date}</span>
                           </div>
                        </div>
                     ))}
                  </div>
                  {/* Progress Line */}
                  <div className="absolute top-7 h-1.5 bg-[#d8dadc] -z-0 rounded-full" style={{ left: `${halfStepPercent}%`, right: `${halfStepPercent}%` }}>
                     <div className="h-full bg-[#00dbe9] rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentageLine}%` }}></div>
                  </div>
               </div>

               {isWithdrawOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131318]/80 backdrop-blur-sm">
                     <div className="relative w-full max-w-lg rounded-3xl border border-[#3b494b] bg-[#15161b] shadow-2xl overflow-hidden">
                        <div className="p-8 space-y-6">
                           <div className="space-y-3">
                              <p className="text-sm uppercase tracking-[0.3em] text-[#00dbe9] font-bold">Withdraw Resignation</p>
                              <h2 className="text-3xl font-black text-white">Withdraw Resignation</h2>
                              <p className="text-sm leading-7 text-[#b9cacb]">
                                 Are you sure you want to withdraw your resignation request?
                              </p>
                           </div>

                           <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                              <button
                                 type="button"
                                 onClick={() => setIsWithdrawOpen(false)}
                                 className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#3b494b] text-[#b9cacb] bg-[#1f1f24] hover:bg-[#2a292f] transition-all"
                              >
                                 Cancel
                              </button>
                              <button
                                 type="button"
                                 onClick={() => {
                                    setIsWithdrawOpen(false);
                                    onWithdraw?.();
                                 }}
                                 className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffb4ab] text-[#08131f] font-bold hover:bg-[#ff9c94] transition-all"
                              >
                                 Confirm Withdrawal
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Notice Period Countdown */}
            <div className="lg:col-span-4 bg-[#1f1f24] rounded-2xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-sm border border-[#3b494b]">
               <div className="absolute -right-6 -top-6 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
                  <Icon className="text-[160px] text-[#00dbe9]">hourglass_empty</Icon>
               </div>
               <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[#b9cacb] relative z-10">Notice Period Remaining</p>
               <div className="text-[80px] font-black leading-none mb-2 relative z-10 tracking-tighter text-[#00dbe9]">{daysLeft}</div>
               <p className="text-2xl font-semibold relative z-10 mb-10 text-white">Days Left</p>

               <div className="w-full h-2 bg-[#131318] rounded-full overflow-hidden relative z-10">
                  <div className="h-full bg-[#00dbe9]" style={{ width: `${progressPercentage}%` }}></div>
               </div>
               <p className="mt-6 text-sm font-medium text-[#b9cacb] italic relative z-10">Final Day: {resignation.relievingDate}</p>
            </div>

            {/* Exit Checklist */}
            <div className="lg:col-span-7 bg-[#1f1f24] rounded-2xl p-8 shadow-sm border border-[#3b494b] flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-[#00dbe9] flex items-center gap-2">
                     <Icon>checklist</Icon>
                     Exit Checklist
                  </h3>
               </div>
               <div className="space-y-4 flex-1">
                  {(!checklistTasks || checklistTasks.length === 0) ? (
                     <>
                        <div className="flex items-center gap-5 p-5 bg-[#1f1f24] rounded-xl border border-[#3b494b] shadow-sm">
                           <div className="w-6 h-6 rounded border-2 border-[#00dbe9] flex items-center justify-center"></div>
                           <div className="flex-grow">
                              <p className="text-sm font-bold text-[#e4e1e9]">Return Hardware (MacBook & Accessories)</p>
                              <p className="text-xs font-medium text-[#b9cacb] mt-1">Due in 5 days • IT Department</p>
                           </div>
                           <Icon className="text-[#76777d] text-[20px]">arrow_forward_ios</Icon>
                        </div>
                        <div className="flex items-center gap-5 p-5 bg-[#1f1f24] rounded-xl border border-[#3b494b] shadow-sm">
                           <div className="w-6 h-6 rounded border-2 border-[#00dbe9] flex items-center justify-center"></div>
                           <div className="flex-grow">
                              <p className="text-sm font-bold text-[#e4e1e9]">Handover Documentation Finalization</p>
                              <p className="text-xs font-medium text-[#b9cacb] mt-1">Due in 2 days • Engineering Team</p>
                           </div>
                           <Icon className="text-[#76777d] text-[20px]">arrow_forward_ios</Icon>
                        </div>
                        <div className="flex items-center gap-5 p-5 bg-[#1f1f24]/50 rounded-xl opacity-70">
                           <div className="w-6 h-6 rounded bg-[#00dbe9] flex items-center justify-center text-white">
                              <Icon className="text-[16px] font-bold">check</Icon>
                           </div>
                           <div className="flex-grow">
                              <p className="text-sm font-bold text-[#e4e1e9] line-through">Formal Resignation Submission</p>
                              <p className="text-xs font-medium text-[#b9cacb] mt-1">Completed {resignation.submissionDate}</p>
                           </div>
                        </div>
                     </>
                  ) : (
                     checklistTasks.map((task) => {
                        const isTaskCompleted = task.status === 'Completed';
                        return (
                           <div
                              key={task.id}
                              className={`flex items-center gap-5 p-5 bg-[#1f1f24] rounded-xl border border-[#3b494b] shadow-sm ${isTaskCompleted ? 'opacity-65' : ''
                                 }`}
                           >
                              {isTaskCompleted ? (
                                 <div className="w-6 h-6 rounded bg-[#00dbe9] flex items-center justify-center text-[#131318]">
                                    <Icon className="text-[16px] font-bold text-white">check</Icon>
                                 </div>
                              ) : (
                                 <div className="w-6 h-6 rounded border-2 border-[#00dbe9] flex items-center justify-center"></div>
                              )}
                              <div className="flex-grow">
                                 <p className={`text-sm font-bold ${isTaskCompleted ? 'text-[#e4e1e9] line-through' : 'text-[#e4e1e9]'}`}>
                                    {task.title}
                                 </p>
                                 <p className="text-xs font-medium text-[#b9cacb] mt-1">
                                    {isTaskCompleted
                                       ? `Completed ${task.completed_at ? new Date(task.completed_at).toISOString().split('T')[0] : resignation.submissionDate}`
                                       : task.description || `${task.department} Department`}
                                 </p>
                              </div>
                              {!isTaskCompleted && (
                                 <Icon className="text-[#76777d] text-[20px]">arrow_forward_ios</Icon>
                              )}
                           </div>
                        );
                     })
                  )}
               </div>
            </div>

            {/* Important Dates */}
            <div className="lg:col-span-5 flex flex-col gap-6">
               <div className="bg-[#1f1f24] rounded-2xl p-8 shadow-sm border border-[#3b494b] flex-grow">
                  <h3 className="text-xl font-bold text-[#00dbe9] flex items-center gap-2 mb-8">
                     <Icon>calendar_month</Icon>
                     Key Milestones
                  </h3>
                  <div className="space-y-8">
                     {/* Under Review Milestone */}
                     <div className="flex items-start gap-5">
                        <div className={`p-4 rounded-xl border ${['Exit Interview Pending', 'Exit Interview Submitted', 'Approved'].includes(resignation?.status) ? 'bg-[#00dbe9]/10 border-[#00dbe9]/30 text-[#00dbe9]' : (['Pending HR Review', 'Pending'].includes(resignation?.status) ? 'bg-[#2a292f] border-[#00dbe9] text-[#00dbe9] animate-pulse' : 'bg-[#2a292f] border-[#3b494b] text-[#b9cacb]')}`}>
                           <Icon className="text-[28px]">rate_review</Icon>
                        </div>
                        <div className="pt-1">
                           <p className="text-base font-bold text-[#e4e1e9]">Under Review</p>
                           {['Exit Interview Pending', 'Exit Interview Submitted', 'Approved'].includes(resignation?.status) ? (
                              <p className="text-sm font-medium text-[#b9cacb] mt-1">Completed • HR reviewed request</p>
                           ) : (['Pending HR Review', 'Pending'].includes(resignation?.status) ? (
                              <p className="text-sm font-medium text-[#ffe082] mt-1">In Progress • Awaiting HR review</p>
                           ) : (
                              <p className="text-sm font-medium text-[#b9cacb] mt-1">Pending Submission</p>
                           ))}
                        </div>
                     </div>

                     {/* Exit Interview Milestone */}
                     <div className="flex items-start gap-5">
                        <div className={`p-4 rounded-xl border ${isExitInterviewCompleted ? 'bg-[#00dbe9]/10 border-[#00dbe9]/30 text-[#00dbe9]' : (exitInterviewData.initiatedBy === 'HR' && exitInterviewData.status === 'Scheduled' ? 'bg-[#2a292f] border-[#00dbe9] text-[#00dbe9] animate-pulse' : 'bg-[#2a292f] border-[#3b494b] text-[#b9cacb]')}`}>
                           <Icon className="text-[28px]">diversity_3</Icon>
                        </div>
                        <div className="pt-1">
                           <p className="text-base font-bold text-[#e4e1e9]">Exit Interview</p>
                           {isExitInterviewCompleted ? (
                              <p className="text-sm font-medium text-[#b9cacb] mt-1">Completed • Responses submitted</p>
                           ) : (exitInterviewData.initiatedBy === 'HR' && exitInterviewData.status === 'Scheduled' ? (
                              <>
                                 <p className="text-sm font-medium text-[#00dbe9] mt-1">Scheduled • 30 mins</p>
                                 <button
                                    onClick={onStartExitInterview}
                                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 border border-[#00dbe9] text-[#00dbe9] hover:bg-[#00dbe9]/10 font-bold text-xs rounded-lg transition-all"
                                 >
                                    Start Interview <Icon className="text-[14px]">arrow_forward</Icon>
                                 </button>
                              </>
                           ) : (
                              <>
                                 <p className="text-sm font-medium text-[#b9cacb] mt-1">Pending Schedule • 30 mins</p>
                                 <p className="text-sm text-[#00dbe9] mt-1 font-bold">with HR Department</p>
                              </>
                           ))}
                        </div>
                     </div>

                     {/* Final Meeting Milestone */}
                     {isFinalMeetingCompleted ? (
                        <div className="flex items-start gap-5">
                           <div className="bg-[#00dbe9]/10 border border-[#00dbe9]/30 text-[#00dbe9] p-4 rounded-xl">
                              <Icon className="text-[28px]">check_circle</Icon>
                           </div>
                           <div className="pt-1">
                              <p className="text-base font-bold text-[#e4e1e9]">Final Meeting</p>
                              <p className="text-sm font-medium text-[#b9cacb] mt-1">Completed • Meeting was done successfully</p>
                           </div>
                        </div>
                     ) : isExitInterviewCompleted && employeeMeeting ? (
                        <div className="flex items-start gap-5">
                           <div className="bg-[#2a292f] p-4 rounded-xl border border-[#00dbe9] text-[#00dbe9] animate-pulse">
                              <Icon className="text-[28px]">videocam</Icon>
                           </div>
                           <div className="pt-1">
                              <p className="text-base font-bold text-[#e4e1e9]">Final Meeting</p>
                              <p className="text-sm font-medium text-[#00dbe9] mt-1">Scheduled • {employeeMeeting.date} at {employeeMeeting.timeSlot}</p>
                              {employeeMeeting.jitsiUrl && (
                                 <a
                                    href={employeeMeeting.jitsiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setShowExitCallModal(true)}
                                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#00dbe9] text-[#131318] hover:opacity-90 font-bold text-xs rounded-lg transition-all shadow-md shadow-[#00dbe9]/20"
                                 >
                                    Join Video Meeting <Icon className="text-[14px]">video_call</Icon>
                                 </a>
                              )}
                           </div>
                        </div>
                     ) : (
                        <div className="flex items-start gap-5">
                           <div className="bg-[#2a292f] p-4 rounded-xl border border-[#3b494b] text-[#b9cacb]">
                              <Icon className="text-[28px]">videocam</Icon>
                           </div>
                           <div className="pt-1">
                              <p className="text-base font-bold text-[#e4e1e9]">Final Meeting</p>
                              <p className="text-sm font-medium text-[#b9cacb] mt-1">HR will schedule the video conference</p>
                           </div>
                        </div>
                     )}

                     {/* Last Working Day Milestone */}
                     {!emergencyReleaseRequested && (
                        <div className="flex items-start gap-5">
                           <div className="bg-[#ffb4ab] p-4 rounded-xl border border-[#ffb4ab]/30">
                              <Icon className="text-black text-[28px]">meeting_room</Icon>
                           </div>
                           <div className="pt-1">
                              <p className="text-base font-bold text-[#e4e1e9]">Last Working Day</p>
                              <p className="text-sm font-medium text-[#b9cacb] mt-1">{resignation.relievingDate}</p>
                              <p className="text-sm text-[#ffb4ab] mt-1 font-bold">Final Handover & Goodbye</p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {showExitCallModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131318]/80 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="relative w-full max-w-md rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-center">
                  <div className="mx-auto w-12 h-12 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center">
                     <Icon className="text-[24px]">check_circle</Icon>
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-lg font-bold text-[#e4e1e9]">Video Conference Update</h3>
                     <p className="text-sm text-[#b9cacb] leading-relaxed">
                        Your resignation process is going well. The next step is completing your exit checklist. After that, your resignation process will be completed.
                     </p>
                  </div>
                  <button
                     onClick={() => {
                        setShowExitCallModal(false);
                        setMeetingCompletedLocally(true);
                     }}
                     className="w-full py-2.5 bg-[#00dbe9] text-[#131318] hover:opacity-90 active:scale-95 font-bold text-sm rounded-xl transition-all shadow-md"
                  >
                     Got it
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
