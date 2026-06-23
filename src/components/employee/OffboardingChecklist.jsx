import Icon from '../Icon';

export default function OffboardingChecklist({ resignation, onStartInterview, noticePeriodData, checklistTasks, onUpdateTaskStatus }) {
  const noticePeriod = noticePeriodData ? noticePeriodData.notice_period : 30;

  const isSubmitted = resignation && (resignation.status === 'Pending' || resignation.status === 'Approved');

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
         <div className="lg:col-span-7 bg-[#00dbe9] text-white rounded-2xl p-8 relative overflow-hidden group shadow-md border border-[#00dbe9]">
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Exit Interview</h3>
                  <p className="text-sm opacity-90 max-w-md mb-8 leading-relaxed">Your feedback helps us improve. Please complete the confidential exit survey before your final day.</p>
               </div>
               <button 
                  onClick={onStartInterview}
                  className="inline-flex items-center justify-center bg-[#1f1f24] text-[#00dbe9] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#2a292f] active:scale-95 transition-all w-fit group-hover:px-8 shadow-sm"
               >
                  Start Form <Icon className="ml-2 text-[20px]">arrow_forward</Icon>
               </button>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#1f1f24] opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
         </div>

         {/* Resources Card */}
         <div className="lg:col-span-5 bg-[#1f1f24] rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-[#3b494b]">
            <div>
               <h3 className="text-xl font-bold text-[#00dbe9] mb-4">HR Consultation</h3>
               <p className="text-sm font-medium text-[#b9cacb] mb-8 leading-relaxed">Join your scheduled exit interview or discuss your transition details live with your HR manager.</p>
               <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-3 p-3.5 bg-[#00dbe9] text-white rounded-xl hover:bg-[#00dbe9] active:scale-95 transition-all font-bold shadow-sm">
                     <Icon className="text-[20px]">video_call</Icon>
                     <span className="text-sm">Join Video Meeting</span>
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 p-3.5 border-2 border-[#00dbe9] text-[#00dbe9] bg-transparent rounded-xl hover:bg-[#00dbe9]/5 active:scale-95 transition-all font-bold">
                     <Icon className="text-[20px]">calendar_today</Icon>
                     <span className="text-sm">Reschedule Meeting</span>
                  </button>
               </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#3b494b]">
               <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">
                  Scheduled for: <span className="text-[#00dbe9]">Today, 2:00 PM</span>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
