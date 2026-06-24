import Icon from '../Icon';

export default function EmployeeProfile({ user, onEditProfile }) {
  return (
    <div className="mt-8 p-8 overflow-y-auto custom-scrollbar flex-1 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
         {/* Header / Stats Row */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
               <nav className="flex gap-2 text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-3">
                  <span>Directory</span>
                  <span>/</span>
                  <span className="text-[#00dbe9]">Employee Profile</span>
               </nav>
            </div>

            <div>
               <button
                 type="button"
                 onClick={onEditProfile}
                 className="text-sm font-semibold text-[#00dbe9] hover:underline"
                 aria-label="Edit Profile"
               >
                 Edit Profile
               </button>
            </div>
         </div>

         {/* Bento Grid Layout */}
         <div className="grid grid-cols-12 gap-6 pt-4">
            {/* Left Column: Personal Info */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
               <div className="bg-[#1f1f24] rounded-2xl p-8 border border-[#3b494b] shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col items-center mb-8">
                     <div className="relative">
                        <img 
                           alt="Profile"
                           className="w-32 h-32 rounded-2xl object-cover mb-5 border-4 border-[#2a292f] shadow-sm"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQI74YAqB82dLSQR__tJX5_BpX1qP5vLExRbcVoFIqVIRFrj3abqgQ1Xox4qfYA29EC_JvKq2EE2V57T2SzyZ8TyP7jExZqVjUdMIdYaeQRPJK91YC9sRLieRN-k6K8frD4ePFn4VwkoVuLFiNNfCG7kUdGCxd2Fhls-0NVMSVpAUqAAd_mVoxHwyUOzvVO1Ds0IFYOcKG1qPh8IDiDcqExRSSVFUi8KCxMcLcp7-sI17qhsP89UapTBhP9OONjEjuCHJRsEEEC_M" 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
                     </div>
                     <span className="px-4 py-1.5 bg-[#d8e2ff] text-[#001a42] border border-[#00dbe9]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        Active Employee
                     </span>
                     <h2 className="text-xl font-bold text-[#e4e1e9] mt-2">{user.fullName || user.username || 'Employee'}</h2>
                  </div>
                  
                  <div className="space-y-6">
                     <h3 className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider border-b border-[#3b494b] pb-2">Personal Information</h3>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
                           <Icon>mail</Icon>
                        </div>
                        <div>
                           <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Email Address</p>
                           <p className="text-sm font-bold text-[#e4e1e9]">{user.email || 'N/A'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
                           <Icon>call</Icon>
                        </div>
                        <div>
                           <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Contact Number</p>
                           <p className="text-sm font-bold text-[#e4e1e9]">{user.phone || 'N/A'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
                           <Icon>location_on</Icon>
                        </div>
                        <div>
                           <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Location</p>
                           <p className="text-sm font-bold text-[#e4e1e9]">{user.address || 'N/A'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Employment Metadata */}
               <div className="bg-[#1f1f24] rounded-2xl p-8 border border-[#3b494b] shadow-sm transition-all hover:shadow-md">
                  <h3 className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-5 border-b border-[#3b494b] pb-2">Lifecycle Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#2a292f] p-4 rounded-xl border border-[#3b494b]">
                        <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-1">Tenure</p>
                        <p className="text-2xl font-black text-[#00dbe9]">4.2 Yrs</p>
                     </div>
                     <div className="bg-[#2a292f] p-4 rounded-xl border border-[#3b494b]">
                        <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-1">Vacation</p>
                        <p className="text-2xl font-black text-[#00dbe9]">12 Days</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Employment Details & Documents */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
               {/* Employment Details Section */}
               <div className="bg-[#1f1f24] rounded-2xl border border-[#3b494b] shadow-sm overflow-hidden">
                  <div className="px-8 py-5 border-b border-[#3b494b] bg-[#2a292f]">
                     <h3 className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Employment Details</h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
                     <div>
                        <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-1">Designation</p>
                        <p className="text-base font-bold text-[#00dbe9]">{user.designation || 'N/A'}</p>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-1">Join Date</p>
                        <p className="text-base font-bold text-[#00dbe9]">September 14, 2019</p>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-1">Employee ID</p>
                        <p className="text-sm font-bold bg-[#2a292f] text-[#00dbe9] px-2 py-1 rounded border border-[#3b494b] w-fit">EF-2019-0482</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
