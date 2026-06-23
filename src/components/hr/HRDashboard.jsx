import Icon from '../Icon';

export default function HRDashboard() {
  return (
    <div className="pt-24 px-8 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="bg-[#1f1f24] p-6 rounded-lg shadow-lg border border-[#3b494b] flex flex-col justify-between hover:border-[#00dbe9]/20 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#00dbe9]/5 rounded-lg text-[#00dbe9]">
              <Icon>groups</Icon>
            </div>
            <span className="text-[#33fb0a] text-xs font-medium flex items-center gap-1">
              <Icon className="text-sm">trending_up</Icon> +2.4%
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Total Employees</h3>
            <p className="text-[32px] font-semibold text-[#e4e1e9] mt-1 leading-none">1,284</p>
          </div>
        </div>

        {/* Active Resignations */}
        <div className="bg-[#1f1f24] p-6 rounded-lg shadow-lg border border-[#3b494b] flex flex-col justify-between hover:border-[#00dbe9]/20 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#1f1f24] rounded-lg text-[#b9cacb]">
              <Icon>assignment_late</Icon>
            </div>
            <span className="text-[#ffb4ab] text-xs font-medium flex items-center gap-1">
              <Icon className="text-sm">trending_up</Icon> +12%
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Active Resignations</h3>
            <p className="text-[32px] font-semibold text-[#e4e1e9] mt-1 leading-none">42</p>
          </div>
        </div>

        {/* Completed Offboarding */}
        <div className="bg-[#1f1f24] p-6 rounded-lg shadow-lg border border-[#3b494b] flex flex-col justify-between hover:border-[#00dbe9]/20 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#33fb0a]/5 rounded-lg text-[#33fb0a]">
              <Icon>check_circle</Icon>
            </div>
            <span className="text-[#33fb0a] text-xs font-medium flex items-center gap-1">
              <Icon className="text-sm">check</Icon> Target Met
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Completed Offboarding</h3>
            <p className="text-[32px] font-semibold text-[#e4e1e9] mt-1 leading-none">18</p>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[480px]">
        {/* Attrition Charts (2/3 width) */}
        <div className="lg:col-span-2 bg-[#1f1f24] rounded-lg shadow-lg p-6 flex flex-col border border-[#3b494b]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#e4e1e9]">Attrition Trends</h2>
              <p className="text-sm text-[#b9cacb]">Exit analysis (Last 6 Months)</p>
            </div>
            <div className="flex gap-1 bg-[#1f1f24] p-1 rounded-lg">
              <button className="px-4 py-1 bg-[#1f1f24] shadow-sm rounded-md text-xs font-medium text-[#00dbe9]">Monthly</button>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-4 px-6 pb-2">
            <div className="flex h-full w-full gap-6 pt-4">
              <div className="flex flex-col justify-between h-full pb-8 text-xs font-medium text-[#b9cacb]/60">
                <span>30</span><span>20</span><span>10</span><span>0</span>
              </div>
              <div className="flex-1 flex items-end justify-between gap-4 border-l border-b border-[#3b494b] px-4 pb-2">
                {[
                  { month: 'Jan', height: '40%' },
                  { month: 'Feb', height: '60%' },
                  { month: 'Mar', height: '46%' },
                  { month: 'Apr', height: '86%' },
                  { month: 'May', height: '56%' },
                  { month: 'Jun', height: '70%', active: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 gap-2">
                    <div
                      className={`w-full rounded-t-sm transition-all ${item.active ? 'bg-[#00dbe9]' : 'bg-[#00dbe9]/20 hover:bg-[#00dbe9]/30'}`}
                      style={{ height: item.height }}
                    ></div>
                    <span className={`text-xs ${item.active ? 'font-semibold text-[#00dbe9]' : 'font-medium text-[#b9cacb]'}`}>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notice Period Tracker (1/3 width) */}
        <div className="bg-[#1f1f24] rounded-lg shadow-lg p-6 flex flex-col border border-[#3b494b] overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#e4e1e9]">Notice Tracker</h2>
            <p className="text-sm text-[#b9cacb]">Active exit windows</p>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {[
              { name: 'Sarah Miller', role: 'Sr. Product Designer', days: '4 Days', progress: '85%', color: 'bg-[#ffb4ab]', text: 'text-[#ffb4ab]' },
              { name: 'James Donovan', role: 'Backend Engineer', days: '12 Days', progress: '40%', color: 'bg-[#565e6d]/50', text: 'text-[#b9cacb]' },
              { name: 'Linda Yang', role: 'QA Manager', days: '28 Days', progress: '15%', color: 'bg-[#00dbe9]', text: 'text-[#00dbe9]' }
            ].map((employee, idx) => (
              <div key={idx} className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#1f1f24] transition-all">
                <div className="w-10 h-10 rounded-full bg-[#1f1f24] flex items-center justify-center text-[#b9cacb]">
                  <Icon>person</Icon>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#e4e1e9]">{employee.name}</p>
                  <p className="text-[11px] font-medium text-[#b9cacb] uppercase tracking-tight">{employee.role}</p>
                </div>
                <div className="text-right">
                  <p className={`${employee.text} font-semibold text-sm`}>{employee.days}</p>
                  <div className="w-12 h-1 bg-[#1f1f24] rounded-full mt-1 overflow-hidden">
                    <div className={`h-full ${employee.color}`} style={{ width: employee.progress }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[13px] font-semibold text-[#00dbe9] flex items-center justify-center gap-2 hover:translate-x-1 transition-all h-10">
            View All Active Notices <Icon className="text-base">arrow_forward</Icon>
          </button>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </section>
    </div>
  );
}
