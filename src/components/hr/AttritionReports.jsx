import Icon from '../Icon';

export default function AttritionReports() {
  return (
    <div className="pt-24 px-8 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Sub-Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
        <div>
          <h2 className="text-[32px] font-bold text-[#e4e1e9] leading-tight">Attrition Reports & Analytics</h2>
          <p className="text-[#cbd5e1] text-sm mt-1">Comprehensive workforce stability and exit insight metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1f1f24] p-1 rounded-lg">
          <button className="px-4 py-2 bg-[#1f1f24] text-[#e4e1e9] rounded-md text-sm font-semibold shadow-sm border border-[#3b494b]">Last 12 Months</button>
          <button className="px-4 py-2 text-[#cbd5e1] hover:text-[#ffffff] text-sm font-medium transition-colors">Year to Date</button>
          <button className="px-4 py-2 text-[#cbd5e1] hover:text-[#ffffff] text-sm font-medium transition-colors">Custom Range</button>
          <button className="w-10 h-10 flex items-center justify-center text-[#cbd5e1] hover:bg-[#2a292f] rounded-md transition-colors">
            <Icon>filter_list</Icon>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1f1f24] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#cbd5e1] text-xs font-bold uppercase tracking-wider">Overall Attrition Rate</span>
            <span className="text-[#ffb4ab] text-xs font-bold flex items-center bg-[#ffb4ab] px-2 py-0.5 rounded-full">+2.4%</span>
          </div>
          <p className="text-3xl font-bold text-[#e4e1e9]">12.8%</p>
          <div className="mt-4 w-full bg-[#1f1f24] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00dbe9] h-full w-[12.8%]"></div>
          </div>
        </div>

        <div className="bg-[#1f1f24] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#cbd5e1] text-xs font-bold uppercase tracking-wider">Average Tenacity</span>
            <Icon className="text-[#cbd5e1] text-sm">schedule</Icon>
          </div>
          <p className="text-3xl font-bold text-[#e4e1e9]">3.2 <span className="text-base font-normal text-[#cbd5e1]">Years</span></p>
          <p className="text-xs text-[#e4e1e9] mt-2">Industry Average: 2.8 Years</p>
        </div>

        <div className="bg-[#1f1f24] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#cbd5e1] text-xs font-bold uppercase tracking-wider">Primary Exit Reason</span>
            <Icon className="text-[#cbd5e1] text-sm">trending_up</Icon>
          </div>
          <p className="text-xl font-bold text-[#e4e1e9]">Career Growth</p>
          <p className="text-xs text-[#e4e1e9] mt-2">Cited in 42% of exit interviews</p>
        </div>

        <div className="bg-[#1f1f24] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#cbd5e1] text-xs font-bold uppercase tracking-wider">Est. Replacement Cost</span>
            <Icon className="text-[#cbd5e1] text-sm">payments</Icon>
          </div>
          <p className="text-3xl font-bold text-[#e4e1e9]">$4.2M</p>
          <p className="text-xs text-[#ffb4ab] mt-2 font-medium">Cumulative loss this fiscal year</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Attrition Trends */}
        <div className="lg:col-span-2 bg-[#1f1f24] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#e4e1e9]">Attrition Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00dbe9]"></span>
                <span className="text-xs font-semibold text-[#e4e1e9]">Voluntary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#cbd5e1]"></span>
                <span className="text-xs font-semibold text-[#e4e1e9]">Involuntary</span>
              </div>
            </div>
          </div>
          <div className="relative flex-grow h-64 flex items-end justify-between gap-2 px-2">
            {[
              { m: 'Jan', h1: 'h-1/4', h2: 'h-1/2' },
              { m: 'Feb', h1: 'h-1/5', h2: 'h-3/5' },
              { m: 'Mar', h1: 'h-1/3', h2: 'h-2/5' },
              { m: 'Apr', h1: 'h-1/4', h2: 'h-1/2' },
              { m: 'May', h1: 'h-1/5', h2: 'h-4/5' },
              { m: 'Jun', h1: 'h-1/4', h2: 'h-3/5' },
              { m: 'Jul', h1: 'h-1/5', h2: 'h-2/5' },
              { m: 'Aug', h1: 'h-1/3', h2: 'h-1/2' },
              { m: 'Sep', h1: 'h-1/6', h2: 'h-3/4' },
              { m: 'Oct', h1: 'h-1/4', h2: 'h-2/3' }
            ].map((col, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div className={`w-full bg-[#1f1f24] rounded-t-sm ${col.h1} relative group-hover:bg-[#e2e8f0] transition-colors`}></div>
                <div className={`w-full bg-[#00dbe9] rounded-t-sm ${col.h2} relative group-hover:opacity-90 transition-opacity`}></div>
                <span className="text-[10px] text-[#e4e1e9] mt-2">{col.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exit Reasons Breakdown */}
        <div className="bg-[#1f1f24] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e2e8f0] p-6 flex flex-col">
          <h3 className="text-lg font-bold text-[#e4e1e9] mb-6">Primary Exit Reasons</h3>
          <div className="space-y-6 flex-grow">
            {[
              { label: 'Career Growth', pct: '42%', color: 'bg-blue-600' },
              { label: 'Compensation', pct: '28%', color: 'bg-blue-500' },
              { label: 'Work-Life Balance', pct: '15%', color: 'bg-blue-400' },
              { label: 'Management Style', pct: '10%', color: 'bg-slate-400' }
            ].map((reason, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#e4e1e9]">
                  <span>{reason.label}</span>
                  <span>{reason.pct}</span>
                </div>
                <div className="h-2 bg-[#1f1f24] rounded-full">
                  <div className={`h-full ${reason.color} rounded-full`} style={{ width: reason.pct }}></div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2.5 text-[#00dbe9] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1f1f24] rounded-lg transition-colors border border-transparent hover:border-[#e2e8f0]">
            View Interview Details <Icon className="text-[18px]">arrow_forward</Icon>
          </button>
        </div>
      </div>

      {/* Table and Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Departmental Table */}
        <div className="lg:col-span-4 bg-[#1f1f24] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e2e8f0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center bg-[#1f1f24]">
            <h3 className="text-lg font-bold text-[#e4e1e9]">Departmental Attrition Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1f1f24] border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-[#cbd5e1] uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#cbd5e1] uppercase tracking-wider text-center">Headcount</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#cbd5e1] uppercase tracking-wider text-center">Exits (LY)</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#cbd5e1] uppercase tracking-wider text-center">Attr. Rate</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#cbd5e1] uppercase tracking-wider text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] bg-[#1f1f24]">
                {[
                  { d: 'Engineering', h: 452, e: 34, r: '7.5%', c: 'bg-red-50 text-red-700 border-red-100', t: 'trending_up', tc: 'text-red-500' },
                  { d: 'Sales & Marketing', h: 218, e: 42, r: '19.2%', c: 'bg-red-50 text-red-700 border-red-100', t: 'trending_up', tc: 'text-red-500' },
                  { d: 'Product Design', h: 84, e: 3, r: '3.5%', c: 'bg-blue-50 text-blue-700 border-blue-100', t: 'trending_flat', tc: 'text-[#94a3b8]' },
                  { d: 'Customer Support', h: 135, e: 22, r: '16.3%', c: 'bg-red-50 text-red-700 border-red-100', t: 'trending_up', tc: 'text-red-500' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#1f1f24] transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-[#e4e1e9]">{row.d}</td>
                    <td className="px-6 py-4 text-sm text-[#e4e1e9] text-center">{row.h}</td>
                    <td className="px-6 py-4 text-sm text-[#e4e1e9] text-center">{row.e}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${row.c}`}>{row.r}</span>
                    </td>
                    <td className={`px-6 py-4 ${row.tc} text-center`}>
                      <Icon>{row.t}</Icon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
}
