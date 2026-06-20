import Icon from '../Icon';
import OffboardingApprovalModal from './OffboardingApprovalModal';
import OffboardingProcess from './OffboardingProcess';

export default function ResignationReview() {
  return (
    <div className="pt-24 pb-12 px-8 space-y-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header Section with Real-time Status */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#b9cacb] text-xs font-medium">
            <span className="hover:text-[#00dbe9] transition-colors cursor-pointer">Resignations</span>
            <Icon className="text-[14px]">chevron_right</Icon>
            <span>Case #RES-88219</span>
          </div>
          <h2 className="text-2xl font-bold text-[#00dbe9]">Resignation Review: Marcus Thorne</h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="flex items-center gap-2 bg-[#00dbe9]/10 text-[#00dbe9] px-4 py-2 rounded-lg text-xs font-medium border border-[#00dbe9]/20">
            <span className="w-2 h-2 bg-[#00dbe9] rounded-full animate-pulse"></span>
            REAL-TIME STATUS: UNDER REVIEW
          </span>
          <p className="text-[#b9cacb] text-xs font-medium">Last updated: 14 mins ago</p>
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
                <div className="h-full bg-[#00dbe9] w-1/2"></div>
              </div>
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#00dbe9] text-white rounded-full flex items-center justify-center font-bold">
                  <Icon className="text-[18px]">check</Icon>
                </div>
                <span className="text-xs font-medium text-[#00dbe9]">Submitted</span>
                <span className="text-[10px] text-[#b9cacb] uppercase">Oct 12, 2023</span>
              </div>
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#1f1f24] border-2 border-[#00dbe9] text-[#00dbe9] rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-xs font-bold text-[#00dbe9]">Under Review</span>
                <span className="text-[10px] text-[#b9cacb] uppercase">In Progress</span>
              </div>
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#1f1f24] border-2 border-[#3b494b] text-[#b9cacb] rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-xs font-medium text-[#b9cacb]">Approved</span>
                <span className="text-[10px] text-[#b9cacb] uppercase">Pending</span>
              </div>
            </div>
          </div>

          {/* Employee Details Card */}
          <div className="bg-[#1f1f24] p-6 rounded-lg shadow-sm border border-[#3b494b] grid grid-cols-2 gap-6">
            <div className="col-span-2 border-b border-[#3b494b] pb-4 mb-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Employee Details</h3>
              <span className="text-xs font-medium text-[#b9cacb]">ID: EMP-4402</span>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Position</label>
                <p className="text-base font-semibold">Senior Frontend Architect</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Department</label>
                <p className="text-base">Product & Engineering</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Reason for leaving</label>
                <div className="bg-[#2a292f] p-4 rounded-lg border border-[#3b494b] italic text-[#b9cacb] text-sm">
                  "Pursuing a new opportunity in a different industry that aligns better with my long-term career goals in AI research."
                </div>
              </div>
            </div>
            <div className="space-y-6 border-l border-[#3b494b] pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Last Working Day</label>
                  <p className="text-base font-bold text-[#ffb4ab]">November 15, 2023</p>
                </div>
                <Icon className="text-[#b9cacb]">calendar_today</Icon>
              </div>
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-1 uppercase">Notice Period</label>
                <p className="text-base">30 Days (Standard Contract)</p>
              </div>
              <div className="p-4 bg-[#00dbe9]/20 rounded-lg border border-[#00dbe9]">
                <p className="text-xs font-bold text-[#505f76] mb-1 uppercase">Risk Assessment</p>
                <div className="flex items-center gap-4">
                  <span className="w-full bg-[#3b494b] h-2 rounded-full overflow-hidden">
                    <span className="block bg-amber-500 h-full w-[40%]"></span>
                  </span>
                  <span className="text-xs font-medium text-[#b9cacb]">Low-Medium</span>
                </div>
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
              <div>
                <label className="text-xs font-medium text-[#b9cacb] block mb-2 uppercase">Reviewer Comments</label>
                <textarea
                  className="w-full rounded-lg border border-[#3b494b] focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 text-sm p-4 outline-none"
                  placeholder="Add notes for the HR director or employee..."
                  rows="4"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button className="px-6 py-4 border border-[#b9cacb] text-[#e4e1e9] text-xs font-medium rounded-lg hover:bg-[#2a292f] transition-all">
                  Request More Info
                </button>
                <button className="px-6 py-4 border border-[#ffb4ab] text-[#ffb4ab] text-xs font-medium rounded-lg hover:bg-[#ffb4ab] transition-all">
                  Reject Resignation
                </button>
                <button className="px-6 py-4 bg-[#00dbe9] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                  <Icon className="text-[18px]">check_circle</Icon>
                  Approve Resignation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checklist & Meta (Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Exit Checklist */}
          <div className="bg-[#1f1f24] p-6 rounded-lg shadow-sm border border-[#3b494b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Exit Checklist</h3>
              <span className="text-xs font-medium text-[#b9cacb]">2/3 Complete</span>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 bg-[#2a292f] rounded-lg border border-[#3b494b] cursor-pointer hover:bg-[#2a292f] transition-all">
                <input checked readOnly className="rounded text-[#00dbe9] focus:ring-[#00dbe9] h-5 w-5" type="checkbox" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Initial HR Interview</span>
                  <span className="text-xs font-medium text-[#b9cacb]">Completed Oct 13</span>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border border-dashed border-[#3b494b] rounded-lg cursor-pointer hover:bg-[#2a292f] transition-all">
                <input className="rounded text-[#00dbe9] focus:ring-[#00dbe9] h-5 w-5" type="checkbox" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Return Laptop & Assets</span>
                  <span className="text-xs font-medium text-[#b9cacb]">Pending - Nov 15</span>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border border-dashed border-[#3b494b] rounded-lg cursor-pointer hover:bg-[#2a292f] transition-all">
                <input className="rounded text-[#00dbe9] focus:ring-[#00dbe9] h-5 w-5" type="checkbox" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Revoke Access Rights</span>
                  <span className="text-xs font-medium text-[#b9cacb]">Scheduled - Nov 15</span>
                </div>
              </label>
            </div>
            <button className="w-full mt-6 py-4 border border-[#00dbe9] text-[#00dbe9] rounded-lg text-xs font-medium hover:bg-[#00dbe9]/5 transition-all flex justify-center items-center">
              Manage Tasks
            </button>
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
