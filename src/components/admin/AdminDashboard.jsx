import Icon from '../Icon';

export default function AdminDashboard({ users }) {
  const totalUsers = users ? users.length : 14285;

  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold text-[#e4e1e9]">Overview</h2>
          <p className="text-base text-[#b9cacb] mt-1">
            High-level system metrics and recent announcements.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium tracking-wide text-[#b9cacb]">Last updated: Today, 09:41 AM</p>
        </div>
      </div>

      {/* Bento Grid: Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#1f1f24] rounded-lg p-6 border border-[#c3c6d5] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00dbe9]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-[#2a292f] flex items-center justify-center text-[#00dbe9] transition-transform duration-300 group-hover:scale-110">
              <Icon>group</Icon>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-[#33fb0a] bg-[#33fb0a]/10 px-2 py-1 rounded-full">
              <Icon className="text-[14px]">arrow_upward</Icon> 12%
            </span>
          </div>
          <h3 className="text-sm text-[#b9cacb] mb-1 relative z-10">Total Users</h3>
          <p className="text-2xl font-semibold text-[#e4e1e9] relative z-10">{totalUsers}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1f1f24] rounded-lg p-6 border border-[#c3c6d5] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#BA1A1A]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-[#2a292f] flex items-center justify-center text-[#BA1A1A] transition-transform duration-300 group-hover:scale-110">
              <Icon>exit_to_app</Icon>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-[#BA1A1A] bg-[#BA1A1A]/10 px-2 py-1 rounded-full">
              <Icon className="text-[14px]">arrow_upward</Icon> 3%
            </span>
          </div>
          <h3 className="text-sm text-[#b9cacb] mb-1 relative z-10">Active Resignations</h3>
          <p className="text-2xl font-semibold text-[#e4e1e9] relative z-10">127</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1f1f24] rounded-lg p-6 border border-[#c3c6d5] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#505f76]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-[#2a292f] flex items-center justify-center text-[#505f76] transition-transform duration-300 group-hover:scale-110">
              <Icon>task</Icon>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-[#434653] bg-[#e2e2ec] px-2 py-1 rounded-full">
              Pending
            </span>
          </div>
          <h3 className="text-sm text-[#b9cacb] mb-1 relative z-10">Pending Tasks</h3>
          <p className="text-2xl font-semibold text-[#e4e1e9] relative z-10">48</p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#1f1f24] rounded-lg p-6 border border-[#c3c6d5] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#33fb0a]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-[#2a292f] flex items-center justify-center text-[#33fb0a] transition-transform duration-300 group-hover:scale-110">
              <Icon>health_and_safety</Icon>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-[#33fb0a] bg-[#33fb0a]/10 px-2 py-1 rounded-full">
              99.9% Uptime
            </span>
          </div>
          <h3 className="text-sm text-[#b9cacb] mb-1 relative z-10">System Health Status</h3>
          <p className="text-2xl font-semibold text-[#e4e1e9] flex items-baseline gap-2 relative z-10">
            Healthy <span className="text-sm text-[#b9cacb] font-normal">0 Errors</span>
          </p>
        </div>
      </div>

      {/* Main Content Area: Announcements */}
      <div className="bg-[#1f1f24] rounded-lg border border-[#c3c6d5] shadow-sm flex flex-col mt-4 min-h-[200px] p-6 justify-center items-center">
        <span className="material-symbols-outlined text-4xl text-[#b9cacb] mb-2 opacity-50">campaign</span>
        <p className="text-[#b9cacb] font-medium">No active announcements</p>
        <p className="text-xs text-[#b9cacb] mt-1">System broadcasts will appear here.</p>
      </div>
    </div>
  );
}
