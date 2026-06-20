import Icon from '../Icon';

export default function WorkflowsManagement() {
  return (
    <div className="pt-24 px-8 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-[#00dbe9] mb-1">Automated Workflows</h2>
        <p className="text-[#b9cacb] text-base max-w-3xl">
          Standardize the offboarding experience with automated task sequencing, ensuring compliance and empathy for every departure.
        </p>
      </div>

      {/* Grid of Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Card 1: Standard Exit */}
        <div className="bg-[#1f1f24] rounded-lg p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col border border-[#eeedf5] shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-[#00dbe9] text-[#131318]">
              <Icon>article</Icon>
            </div>
            <span className="bg-[#2a292f] text-[#b9cacb] text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider">
              14 Active Cases
            </span>
          </div>
          <h3 className="text-xl font-semibold text-[#e4e1e9] mb-2">Standard Exit</h3>
          <p className="text-[#b9cacb] text-sm mb-6">
            The baseline offboarding procedure for full-time employees across all departments.
          </p>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center text-white">
                <Icon className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</Icon>
              </div>
              <span className="text-sm font-medium">Initial Interview</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center text-white">
                <Icon className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</Icon>
              </div>
              <span className="text-sm font-medium">IT Revocation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#00dbe9]/40 flex items-center justify-center text-[#00dbe9]/60">
                <Icon className="text-[18px]">inventory_2</Icon>
              </div>
              <span className="text-sm font-medium text-[#b9cacb]">Asset Return</span>
            </div>
          </div>
        </div>

        {/* Workflow Card 2: Executive Departure */}
        <div className="bg-[#1f1f24] rounded-lg p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col border border-[#eeedf5] shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-[#d9e2ff] text-[#00dbe9]">
              <Icon>stars</Icon>
            </div>
            <span className="bg-[#00dbe9] text-[#131318] text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider">
              2 Active Cases
            </span>
          </div>
          <h3 className="text-xl font-semibold text-[#e4e1e9] mb-2">Executive Departure</h3>
          <p className="text-[#b9cacb] text-sm mb-6">
            High-touch offboarding for senior leadership including succession and communications.
          </p>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00dbe9]/20 flex items-center justify-center text-[#00dbe9]">
                <Icon className="text-[18px]">campaign</Icon>
              </div>
              <span className="text-sm text-[#b9cacb]">Comms Planning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center text-white">
                <Icon className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>transfer_within_a_station</Icon>
              </div>
              <span className="text-sm font-medium">Knowledge Transfer</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center text-white">
                <Icon className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</Icon>
              </div>
              <span className="text-sm font-medium">Legal Compliance</span>
            </div>
          </div>
        </div>

        {/* Workflow Card 3: Contract End */}
        <div className="bg-[#1f1f24] rounded-lg p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col border border-[#eeedf5] shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-[#e0e3e5] text-[#272b2d]">
              <Icon>timer</Icon>
            </div>
            <span className="bg-[#2a292f] text-[#b9cacb] text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider">
              28 Active Cases
            </span>
          </div>
          <h3 className="text-xl font-semibold text-[#e4e1e9] mb-2">Contract End</h3>
          <p className="text-[#b9cacb] text-sm mb-6">
            Streamlined process for fixed-term contractors and temporary staffing.
          </p>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center text-white">
                <Icon className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</Icon>
              </div>
              <span className="text-sm font-medium">Access Removal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center text-white">
                <Icon className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>laptop_mac</Icon>
              </div>
              <span className="text-sm font-medium">Equipment Return</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#00dbe9]/40 flex items-center justify-center text-[#00dbe9]/60">
                <Icon className="text-[18px]">receipt_long</Icon>
              </div>
              <span className="text-sm font-medium text-[#b9cacb]">Final Invoice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Action Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#1f1f24] rounded-lg p-6 border border-[#eeedf5] shadow-sm relative overflow-hidden">
          <h4 className="text-xl font-semibold text-[#e4e1e9] mb-2">System Health</h4>
          <p className="text-[#b9cacb] text-sm mb-6">
            Workflow automation efficiency and task completion rates.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2a292f] p-4 rounded-lg">
              <p className="text-xs text-[#b9cacb] uppercase tracking-wider mb-1">Avg. Time to Close</p>
              <p className="text-2xl font-bold text-[#00dbe9]">4.2 Days</p>
            </div>
            <div className="bg-[#2a292f] p-4 rounded-lg">
              <p className="text-xs text-[#b9cacb] uppercase tracking-wider mb-1">Automation Success</p>
              <p className="text-2xl font-bold text-[#00dbe9]">98.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#00dbe9] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group z-50 rounded-lg">
        <Icon className="text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</Icon>
        <span className="absolute right-full mr-4 bg-[#00dbe9] text-white px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Quick Action
        </span>
      </button>
    </div>
  );
}
