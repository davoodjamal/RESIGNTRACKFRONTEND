import Icon from '../Icon';

export default function OffboardingChecklist({ resignation, onStartInterview }) {
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
                  <circle className="text-[#00dbe9]" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12" strokeDasharray="502.65" strokeDashoffset="125.66" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }}></circle>
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-[#e4e1e9]">14</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#b9cacb] mt-1">Days Left</span>
               </div>
            </div>
            <p className="text-sm font-medium text-[#b9cacb]">
               Last working day:<br/>
               <span className="font-bold text-[#e4e1e9]">{resignation?.relievingDate || 'October 24, 2023'}</span>
            </p>
         </div>

         {/* Exit Checklist */}
         <div className="lg:col-span-8 bg-[#1f1f24] border border-[#3b494b] rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-[#00dbe9]">Exit Checklist</h3>
               <span className="bg-[#d8e2ff] text-[#001a42] px-4 py-1.5 rounded-full text-xs font-bold border border-[#00dbe9]/20">
                  4 of 7 Completed
               </span>
            </div>
            <div className="space-y-4">
               {/* Actionable Item 1 */}
               <div className="group flex items-start gap-4 p-5 bg-[#2a292f] rounded-xl border border-[#3b494b] opacity-60">
                  <div className="mt-0.5">
                     <Icon className="text-[#00dbe9]" fill={true}>check_circle</Icon>
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-[#e4e1e9] line-through">Return Laptop & Accessories</p>
                     <p className="text-xs font-medium text-[#b9cacb] mt-1">IT Department • Confirmed on Oct 10</p>
                  </div>
               </div>

               {/* Actionable Item 2 */}
               <div className="group flex items-start gap-4 p-5 bg-[#1f1f24] hover:bg-[#2a292f] rounded-xl transition-colors border border-[#3b494b] hover:border-[#00dbe9] cursor-pointer shadow-sm">
                  <div className="mt-0.5">
                     <Icon className="text-[#3b494b] group-hover:text-[#00dbe9] transition-colors">radio_button_unchecked</Icon>
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-[#e4e1e9]">Complete Handover Documentation</p>
                     <p className="text-xs font-medium text-[#b9cacb] mt-1">Upload final project files to shared drive.</p>
                    {/* Upload Now button removed */}
                  </div>
                  <span className="bg-[#ffb4ab]/50 text-[#ffb4ab] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border border-[#ffb4ab]/20">Pending</span>
               </div>

               {/* Actionable Item 3 */}
               <div className="group flex items-start gap-4 p-5 bg-[#1f1f24] hover:bg-[#2a292f] rounded-xl transition-colors border border-[#3b494b] hover:border-[#00dbe9] cursor-pointer shadow-sm">
                  <div className="mt-0.5">
                     <Icon className="text-[#3b494b] group-hover:text-[#00dbe9] transition-colors">radio_button_unchecked</Icon>
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-[#e4e1e9]">Revoke Access Cards</p>
                     <p className="text-xs font-medium text-[#b9cacb] mt-1">Return to security desk on final day.</p>
                  </div>
                  <span className="bg-[#2a292f] text-[#b9cacb] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border border-[#3b494b]">Scheduled</span>
               </div>
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
