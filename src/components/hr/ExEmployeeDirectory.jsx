import Icon from '../Icon';

export default function ExEmployeeDirectory() {
  return (
    <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-[1200px] mx-auto">
        {/* Filter Bar */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-[#1f1f24] p-4 rounded-xl shadow-sm border border-[#3b494b]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider px-2">
                Departure Date
              </label>
              <select className="bg-[#131318] border border-[#3b494b] rounded-lg px-4 h-[40px] text-sm focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none min-w-[180px]">
                <option>All Time</option>
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider px-2">
                Exit Reason
              </label>
              <select className="bg-[#131318] border border-[#3b494b] rounded-lg px-4 h-[40px] text-sm focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none min-w-[180px]">
                <option>All Reasons</option>
                <option>Voluntary</option>
                <option>Involuntary</option>
                <option>Retirement</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button className="h-10 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all bg-[#00dbe9] text-white hover:opacity-90">
              <Icon className="text-[18px] mr-2">download</Icon>
              Export Records
            </button>
          </div>
        </section>

        {/* Stats Overview */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-8 bg-[#00dbe9]/10 border border-[#00dbe9]/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-[#00dbe9] mb-1">Directory Insights</h3>
              <p className="text-[#b9cacb] text-sm">
                You are viewing 1,248 completed offboarding profiles from the last 2 fiscal years.
              </p>
            </div>
            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <span className="block text-3xl font-bold text-[#00dbe9]">82%</span>
                <span className="text-[10px] uppercase font-bold text-[#b9cacb]">Re-hire Eligible</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-[#00dbe9]">14.2</span>
                <span className="text-[10px] uppercase font-bold text-[#b9cacb]">Avg Tenure (mo)</span>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 bg-[#00dbe9]/30 border border-[#00dbe9]/50 rounded-xl p-6 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-[#00dbe9] mb-2">
              Primary Exit Reason
            </span>
            <h4 className="text-xl font-semibold text-[#00dbe9]">Career Growth</h4>
            <div className="w-full bg-[#3b494b] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#00dbe9] w-[65%] h-full"></div>
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#1f1f24] rounded-xl shadow-sm overflow-hidden border border-transparent hover:border-[#00dbe9]/30 hover:shadow-md transition-all duration-300 group flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#e4e1e9]">Helena Vane</h3>
                    <p className="text-sm text-[#b9cacb]">Senior UX Designer</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#00dbe9] text-[#131318] text-[10px] uppercase font-bold rounded-full">
                  Re-hire Eligible
                </span>
              </div>
              <div className="space-y-3 py-4 border-y border-[#3b494b]/30">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Department</span>
                  <span className="text-[#e4e1e9] font-medium">Product & Design</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Tenure</span>
                  <span className="text-[#e4e1e9] font-medium">4 Years, 6 Months</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Departure Date</span>
                  <span className="text-[#e4e1e9] font-medium">Oct 12, 2023</span>
                </div>
              </div>
            </div>
            <div className="bg-[#2a292f] px-6 py-4 flex justify-end">
              <button className="text-[#00dbe9] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Full Profile
                <Icon className="text-[18px]">arrow_forward</Icon>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1f1f24] rounded-xl shadow-sm overflow-hidden border border-transparent hover:border-[#00dbe9]/30 hover:shadow-md transition-all duration-300 group flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#e4e1e9]">Marcus Thorne</h3>
                    <p className="text-sm text-[#b9cacb]">DevOps Engineer</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#3b494b] text-[#b9cacb] text-[10px] uppercase font-bold rounded-full">
                  Offboarded
                </span>
              </div>
              <div className="space-y-3 py-4 border-y border-[#3b494b]/30">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Department</span>
                  <span className="text-[#e4e1e9] font-medium">Engineering</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Tenure</span>
                  <span className="text-[#e4e1e9] font-medium">2 Years, 1 Month</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Departure Date</span>
                  <span className="text-[#e4e1e9] font-medium">Nov 05, 2023</span>
                </div>
              </div>
            </div>
            <div className="bg-[#2a292f] px-6 py-4 flex justify-end">
              <button className="text-[#00dbe9] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Full Profile
                <Icon className="text-[18px]">arrow_forward</Icon>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1f1f24] rounded-xl shadow-sm overflow-hidden border border-transparent hover:border-[#00dbe9]/30 hover:shadow-md transition-all duration-300 group flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#e4e1e9]">Elena Jovic</h3>
                    <p className="text-sm text-[#b9cacb]">Regional Sales Manager</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#00dbe9] text-[#131318] text-[10px] uppercase font-bold rounded-full">
                  Re-hire Eligible
                </span>
              </div>
              <div className="space-y-3 py-4 border-y border-[#3b494b]/30">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Department</span>
                  <span className="text-[#e4e1e9] font-medium">Sales & Marketing</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Tenure</span>
                  <span className="text-[#e4e1e9] font-medium">8 Years, 4 Months</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b9cacb]">Departure Date</span>
                  <span className="text-[#e4e1e9] font-medium">Dec 20, 2023</span>
                </div>
              </div>
            </div>
            <div className="bg-[#2a292f] px-6 py-4 flex justify-end">
              <button className="text-[#00dbe9] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Full Profile
                <Icon className="text-[18px]">arrow_forward</Icon>
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-t border-[#3b494b] pt-6 gap-4">
          <p className="text-sm text-[#b9cacb]">
            Showing <span className="font-bold text-[#e4e1e9]">1 - 6</span> of{' '}
            <span className="font-bold text-[#e4e1e9]">1,248</span> records
          </p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 border border-[#3b494b] rounded-lg hover:bg-[#eeedf5] flex items-center justify-center transition-all disabled:opacity-30" disabled>
              <Icon>chevron_left</Icon>
            </button>
            <div className="flex gap-1">
              <button className="w-10 h-10 bg-[#00dbe9] text-white rounded-lg text-xs shadow-sm font-medium">1</button>
              <button className="w-10 h-10 hover:bg-[#eeedf5] rounded-lg text-xs transition-all font-medium">2</button>
              <button className="w-10 h-10 hover:bg-[#eeedf5] rounded-lg text-xs transition-all font-medium">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-[#b9cacb]">...</span>
              <button className="w-10 h-10 hover:bg-[#eeedf5] rounded-lg text-xs transition-all font-medium">208</button>
            </div>
            <button className="w-10 h-10 border border-[#3b494b] rounded-lg hover:bg-[#eeedf5] flex items-center justify-center transition-all">
              <Icon>chevron_right</Icon>
            </button>
          </div>
        </div>
      </div>

      {/* Side Quick Action */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-2 z-50">
        <button className="w-14 h-14 bg-[#00dbe9] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative">
          <Icon>add</Icon>
          <span className="absolute right-full mr-4 bg-[#e4e1e9] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Archive New Record
          </span>
        </button>
      </div>
    </div>
  );
}
