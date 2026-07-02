import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchMeetings } from '../../api';

export default function OffboardingChecklist({ resignation, onStartInterview, noticePeriodData, checklistTasks, onUpdateTaskStatus, onRescheduleRequest }) {
  const noticePeriod = noticePeriodData ? noticePeriodData.notice_period : 30;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExitCallModal, setShowExitCallModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [meetings, setMeetings] = useState([]);

  // Clear states when modal closes/opens
  useEffect(() => {
    if (isModalOpen) {
      setNewDate('');
      setNewTime('');
      setReason('');
      setValidationError('');
      setApiError('');
    }
  }, [isModalOpen]);

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    if (!newDate) {
      setValidationError('Please select a preferred date.');
      return;
    }
    if (!newTime) {
      setValidationError('Please select a preferred time.');
      return;
    }
    if (!reason || !reason.trim()) {
      setValidationError('Please specify the reason for rescheduling.');
      return;
    }

    setIsLoading(true);
    try {
      if (onRescheduleRequest) {
        await onRescheduleRequest({
          resignation: resignation.id,
          current_schedule: resignation.meeting_schedule || 'Today, 2:00 PM',
          requested_date: newDate,
          requested_time: newTime,
          reason: reason.trim()
        });
        setSuccessMessage('Reschedule request submitted successfully.');
        setIsModalOpen(false);
        // Clear success message after some seconds
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to submit reschedule request.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitted = resignation && resignation.status !== 'Withdrawn';

  const calculateDaysLeft = () => {
    if (!isSubmitted) return 0;
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

  const progressPercentage = isSubmitted ? (
    noticePeriodData && noticePeriodData.has_active_resignation
      ? noticePeriodData.progress_percentage
      : Math.max(0, Math.min(100, Math.round(((noticePeriod - daysLeft) / noticePeriod) * 100)))
  ) : 0;

  const strokeDashoffset = 502.65 - (progressPercentage / 100) * 502.65;

  const tasks = checklistTasks || [];
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const totalTasksCount = tasks.length;
  const exitInterviewTask = tasks.find(t => t.title.toLowerCase().includes('exit interview'));
  const isExitInterviewCompleted = exitInterviewTask?.status === 'Completed' || resignation?.exitFeedback?.roleRating > 0;

  useEffect(() => {
    if (isSubmitted) {
      fetchMeetings()
        .then(setMeetings)
        .catch(err => console.error("Failed to load meetings:", err));
    }
  }, [isSubmitted]);

  const latestMeeting = meetings && meetings.length > 0 ? meetings[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Hero Header */}
      <div className="mb-12">
         <h1 className="text-4xl font-black text-[#00dbe9] tracking-tight mb-2">Offboarding Journey</h1>
         <p className="text-lg text-[#b9cacb] font-medium">Manage your final steps and ensure a smooth transition.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Notice Period Tracker */}
         <div className="lg:col-span-4 bg-[#1f1f24] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-[#3b494b]">
            <h3 className="text-xl font-bold text-[#00dbe9] mb-8">Notice Period</h3>
            <div className="relative w-48 h-48 mb-6">
               <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#3b494b]" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                  <circle className="text-[#00dbe9]" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12" strokeDasharray="502.65" strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }}></circle>
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-[#e4e1e9]">{daysLeft}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#b9cacb] mt-1">Days Left</span>
               </div>
            </div>
            <p className="text-sm font-medium text-[#b9cacb]">
               Last working day:<br/>
               <span className="font-bold text-[#e4e1e9]">{isSubmitted ? resignation.relievingDate : 'Not Submitted'}</span>
            </p>
         </div>

         {/* Exit Checklist */}
         <div className="lg:col-span-8 bg-[#1f1f24] border border-[#3b494b] rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-[#00dbe9]">Exit Checklist</h3>
               {isSubmitted && totalTasksCount > 0 && (
                  <span className="bg-[#d8e2ff] text-[#001a42] px-4 py-1.5 rounded-full text-xs font-bold border border-[#00dbe9]/20">
                     {completedTasksCount} of {totalTasksCount} Completed
                  </span>
               )}
            </div>
            <div className="space-y-4">
               {!isSubmitted ? (
                  <div className="text-center py-8 text-[#b9cacb] text-sm font-semibold">
                     Please submit your resignation to see the offboarding checklist.
                  </div>
               ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-[#b9cacb] text-sm font-semibold">
                     No offboarding tasks available.
                  </div>
               ) : (
                  tasks.map((task) => {
                     const isTaskCompleted = task.status === 'Completed';
                     const isTaskScheduled = task.status === 'Scheduled';
                     return (
                        <div 
                           key={task.id} 
                           className={`flex items-start gap-4 p-5 rounded-xl border border-[#3b494b] shadow-sm ${
                              isTaskCompleted 
                                 ? 'bg-[#2a292f] opacity-60' 
                                 : 'bg-[#1f1f24]'
                           }`}
                        >
                           <div className="mt-0.5">
                              {isTaskCompleted ? (
                                 <Icon className="text-[#00dbe9]" fill={true}>check_circle</Icon>
                              ) : (
                                 <Icon className="text-[#3b494b]">
                                    {isTaskScheduled ? 'schedule' : 'radio_button_unchecked'}
                                 </Icon>
                              )}
                           </div>
                           <div className="flex-grow">
                              <p className={`text-sm font-bold ${isTaskCompleted ? 'text-[#e4e1e9] line-through' : 'text-[#e4e1e9]'}`}>{task.title}</p>
                              <p className="text-xs font-medium text-[#b9cacb] mt-1">{task.description}</p>
                           </div>
                           <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                              isTaskCompleted 
                                 ? 'bg-[#00dbe9]/10 text-[#00dbe9] border-[#00dbe9]/20' 
                                 : isTaskScheduled 
                                    ? 'bg-[#2a292f] text-[#b9cacb] border-[#3b494b]' 
                                    : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20'
                           }`}>
                              {task.status}
                           </span>
                        </div>
                     );
                  })
               )}
            </div>
         </div>

         {/* Exit Interview Card */}
         {!isExitInterviewCompleted && (
            <div className={`lg:col-span-7 rounded-2xl p-8 relative overflow-hidden group border ${
               resignation?.status === 'Pending HR Review'
                  ? 'bg-[#1f1f24] text-[#76777d] border-[#3b494b]/50'
                  : 'bg-[#00dbe9] text-white border-[#00dbe9]'
            }`}>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                     <h3 className="text-2xl font-bold mb-3 tracking-tight">Exit Interview</h3>
                     {resignation?.status === 'Pending HR Review' ? (
                        <p className="text-sm text-[#b9cacb] max-w-md mb-8 leading-relaxed">
                           The exit interview has not been initiated by HR yet. Once HR initiates it, you will be able to complete the confidential survey.
                        </p>
                     ) : (
                        <p className="text-sm opacity-90 max-w-md mb-8 leading-relaxed">
                           Your feedback helps us improve. Please complete the confidential exit survey before your final day.
                        </p>
                     )}
                  </div>
                  {resignation?.status === 'Pending HR Review' ? (
                     <button 
                        disabled
                        className="inline-flex items-center justify-center bg-[#2a292f] text-[#76777d]/60 px-6 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed w-fit border border-[#3b494b]/40 shadow-sm"
                     >
                        Locked (Pending HR Initiation) <Icon className="ml-2 text-[20px]">lock</Icon>
                     </button>
                  ) : (
                     <button 
                        onClick={onStartInterview}
                        className="inline-flex items-center justify-center bg-[#1f1f24] text-[#00dbe9] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#2a292f] active:scale-95 transition-all w-fit group-hover:px-8 shadow-sm"
                     >
                        Start Form <Icon className="ml-2 text-[20px]">arrow_forward</Icon>
                     </button>
                  )}
               </div>
               {/* Abstract Background Shape */}
               <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#1f1f24] opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>
         )}

          {/* Resources Card */}
          <div className={`${isExitInterviewCompleted ? 'lg:col-span-12' : 'lg:col-span-5'} bg-[#1f1f24] rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-[#3b494b]`}>
             <div>
                <h3 className="text-xl font-bold text-[#00dbe9] mb-4">HR Consultation</h3>
                <p className="text-sm font-medium text-[#b9cacb] mb-8 leading-relaxed">Join your scheduled exit interview or discuss your transition details live with your HR manager.</p>
                <div className="space-y-3">
                   <button 
                      onClick={() => {
                         if (latestMeeting && latestMeeting.jitsiUrl) {
                            window.open(latestMeeting.jitsiUrl, '_blank');
                            setShowExitCallModal(true);
                         } else {
                            alert("No exit consultation meeting has been scheduled yet.");
                         }
                      }}
                      className="w-full flex items-center justify-center gap-3 p-3.5 bg-[#00dbe9] text-white rounded-xl hover:bg-[#00dbe9] active:scale-95 transition-all font-bold shadow-sm"
                   >
                      <Icon className="text-[20px]">video_call</Icon>
                      <span className="text-sm">Join Video Meeting</span>
                   </button>
                   <button 
                      onClick={() => setIsModalOpen(true)}
                      disabled={resignation?.meeting_status === 'Reschedule Requested' || !isSubmitted}
                      className="w-full flex items-center justify-center gap-3 p-3.5 border-2 border-[#00dbe9] text-[#00dbe9] bg-transparent rounded-xl hover:bg-[#00dbe9]/5 active:scale-95 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <Icon className="text-[20px]">calendar_today</Icon>
                      <span className="text-sm">
                         {resignation?.meeting_status === 'Reschedule Requested' ? 'Reschedule Pending' : 'Reschedule Meeting'}
                      </span>
                   </button>
                </div>
             </div>
             <div className="mt-8 pt-6 border-t border-[#3b494b]">
                <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">
                   Scheduled for: <span className="text-[#00dbe9]">{latestMeeting ? `${latestMeeting.date} at ${latestMeeting.timeSlot}` : (resignation?.meeting_schedule || 'Today, 2:00 PM')}</span>
                   {resignation?.meeting_status === 'Reschedule Requested' && (
                     <span className="block text-[10px] text-[#ffc107] mt-1 font-bold">
                       * Reschedule Request Pending Review
                     </span>
                   )}
                </p>
             </div>
          </div>
       </div>

      {/* Reschedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-[28px] border border-[#3b494b] bg-[#1f1f24] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 rounded-full border border-[#3b494b] bg-[#131318] p-3 text-[#b9cacb] hover:text-[#00dbe9] transition-colors"
            >
              <Icon>close</Icon>
            </button>

            <form onSubmit={handleRescheduleSubmit} className="space-y-6 text-left">
              <div>
                <h3 className="text-2xl font-bold text-[#e4e1e9]">Reschedule Consultation</h3>
                <p className="text-sm text-[#b9cacb] mt-2">
                  Request a new preferred date and time for your consultation.
                </p>
              </div>

              {validationError && (
                <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                  {validationError}
                </div>
              )}

              {apiError && (
                <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                  {apiError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-2">
                    Current Schedule
                  </label>
                  <input
                    type="text"
                    disabled
                    value={resignation?.meeting_schedule || 'Today, 2:00 PM'}
                    className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-4 py-3 text-sm text-[#76777d] cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-2">
                      New Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-4 py-3 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-2">
                      New Preferred Time *
                    </label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-4 py-3 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-2">
                    Reason for Rescheduling *
                  </label>
                  <textarea
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide a reason for rescheduling..."
                    className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-4 py-3 text-sm text-[#e4e1e9] placeholder-[#b9cacb] focus:outline-none focus:border-[#00dbe9] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-[#3b494b] text-[#b9cacb] hover:bg-[#2a292f] hover:text-[#e4e1e9] font-semibold rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-[#00dbe9] text-[#131318] font-bold rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-[0_0_15px_rgba(0,219,233,0.3)]"
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl bg-[#111827] border border-[#00dbe9]/20 px-6 py-4 text-sm shadow-2xl text-[#e4e1e9] flex items-center gap-2 animate-in fade-in duration-200">
          <Icon className="text-[#00dbe9]">check_circle</Icon>
          <span>{successMessage}</span>
        </div>
      )}

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
                  onClick={() => setShowExitCallModal(false)}
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
