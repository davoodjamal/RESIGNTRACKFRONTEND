import { useState } from 'react';
import Icon from '../Icon';

/* ── static data for charts ── */
const attritionData = [
  { month: 'Jan', voluntary: 65, involuntary: 28 },
  { month: 'Feb', voluntary: 59, involuntary: 48 },
  { month: 'Mar', voluntary: 80, involuntary: 40 },
  { month: 'Apr', voluntary: 81, involuntary: 19 },
  { month: 'May', voluntary: 56, involuntary: 86 },
  { month: 'Jun', voluntary: 55, involuntary: 27 },
];

const exitReasons = [
  { label: 'Career Growth', pct: 35, color: '#00dbe9' },
  { label: 'Compensation', pct: 25, color: '#00dbe9' },
  { label: 'Work-Life Balance', pct: 20, color: '#00dbe9' },
  { label: 'Management', pct: 10, color: '#505f76' },
  { label: 'Other', pct: 10, color: '#3b494b' },
];

const usageMetrics = [
  { label: 'Total Logins (Today)', value: '1,248', trend: '+12% vs yesterday', trendUp: true, color: 'text-[#00dbe9]' },
  { label: 'Workflows Initiated', value: '342', trend: '+5% vs yesterday', trendUp: true, color: 'text-[#e4e1e9]' },
  { label: 'Pending Approvals', value: '89', trend: 'Avg time: 4hrs', trendUp: null, color: 'text-[#b9cacb]' },
  { label: 'Failed Logins', value: '24', trend: 'Investigate', trendUp: false, color: 'text-[#ffb4ab]', danger: true },
];

/* ── System Usage Details modal ── */
function UsageDetailsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#e4e1e9]/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-[800px] bg-[#1f1f24] rounded-xl shadow-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#3b494b]/30 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-[#e4e1e9]">System Usage Details</h3>
            <p className="text-sm text-[#b9cacb]">Detailed breakdown of system activity and performance metrics.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2a292f] rounded-full transition-colors text-[#b9cacb]">
            <Icon>close</Icon>
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Login Activity */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Icon className="text-[#00dbe9]">login</Icon>
              <h4 className="text-xl font-semibold text-[#e4e1e9]">Login Activity</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Unique Users', value: '842', sub: '+8%', subColor: 'text-[#15803d]' },
                { label: 'Avg. Session', value: '24m 12s', sub: 'Stable', subColor: 'text-[#b9cacb]' },
                { label: 'Peak Hour', value: '10:00 AM', sub: '142 concurrent', subColor: 'text-[#b9cacb]' },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-lg bg-[#2a292f] border border-[#3b494b]/20">
                  <p className="text-xs font-medium text-[#b9cacb] uppercase">{m.label}</p>
                  <p className="text-2xl font-semibold text-[#e4e1e9]">{m.value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${m.subColor}`}>
                    {m.sub === '+8%' && <Icon className="text-sm">trending_up</Icon>}
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Performance */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Icon className="text-[#00dbe9]">account_tree</Icon>
              <h4 className="text-xl font-semibold text-[#e4e1e9]">Workflow Performance</h4>
            </div>
            <div className="border border-[#3b494b]/30 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#2a292f]">
                  <tr>
                    {['Metric', 'Initiated', 'Completed', 'Avg. Time'].map((h) => (
                      <th key={h} className="p-4 text-xs font-medium text-[#b9cacb] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b494b]/20">
                  <tr><td className="p-4 font-medium">Resignation Requests</td><td className="p-4">156</td><td className="p-4">142</td><td className="p-4">1.2 Days</td></tr>
                  <tr><td className="p-4 font-medium">Exit Interviews</td><td className="p-4">84</td><td className="p-4">78</td><td className="p-4">45 Mins</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Error Logs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Icon className="text-[#ffb4ab]">error</Icon>
              <h4 className="text-xl font-semibold text-[#e4e1e9]">Error Logs Summary</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#ffb4ab]/30 rounded-lg border border-[#ffb4ab]/20">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#ffb4ab] text-white text-xs font-bold rounded">401</span>
                  <span className="text-sm">Unauthorized Access Attempts</span>
                </div>
                <span className="font-bold text-[#ffb4ab]">18</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#2a292f] rounded-lg border border-[#3b494b]/20">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#b9cacb] text-white text-xs font-bold rounded">403</span>
                  <span className="text-sm">Forbidden Resource Requests</span>
                </div>
                <span className="font-bold">6</span>
              </div>
            </div>
          </section>
        </div>
        {/* Footer */}
        <div className="p-6 border-t border-[#3b494b]/30 flex justify-end gap-3 bg-[#1f1f24]">
          <button onClick={onClose} className="px-6 py-2 rounded-lg border border-[#b9cacb] text-[#b9cacb] text-sm font-semibold hover:bg-[#2a292f] transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ReportsAnalytics() {
  const [showUsageModal, setShowUsageModal] = useState(false);

  const maxBar = Math.max(...attritionData.map((d) => d.voluntary + d.involuntary));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-4xl font-bold text-[#e4e1e9] tracking-tight">Reports & Analytics</h2>
        <p className="text-base text-[#b9cacb] mt-1">Monitor organization trends and system utilization.</p>
      </div>

      {/* Bento Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Monthly Attrition */}
        <div className="lg:col-span-2 bg-[#1f1f24] rounded-xl shadow-sm border border-[#3b494b]/20 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-[#e4e1e9]">Monthly Attrition Trends</h3>
              <p className="text-sm text-[#b9cacb]">Voluntary vs Involuntary departures over 6 months</p>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-4 min-h-[300px] pt-4">
            {attritionData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0" style={{ height: `${((d.voluntary + d.involuntary) / maxBar) * 260}px` }}>
                  <div className="w-full rounded-t bg-[#00dbe9] transition-all duration-500" style={{ height: `${(d.voluntary / (d.voluntary + d.involuntary)) * 100}%` }} title={`Voluntary: ${d.voluntary}`} />
                  <div className="w-full rounded-b bg-[#00dbe9] transition-all duration-500" style={{ height: `${(d.involuntary / (d.voluntary + d.involuntary)) * 100}%` }} title={`Involuntary: ${d.involuntary}`} />
                </div>
                <span className="text-xs text-[#b9cacb] mt-2">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-[#3b494b]/20">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00dbe9]" />
              <span className="text-xs text-[#b9cacb]">Voluntary</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00dbe9]" />
              <span className="text-xs text-[#b9cacb]">Involuntary</span></div>
          </div>
        </div>

        {/* Doughnut: Exit Reasons */}
        <div className="bg-[#1f1f24] rounded-xl shadow-sm border border-[#3b494b]/20 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#e4e1e9]">Top Exit Reasons</h3>
            <p className="text-xs text-[#b9cacb] mt-1">YTD Aggregated Data</p>
          </div>
          {/* Styled doughnut via conic-gradient */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(${exitReasons.map((r, i) => {
                    const start = exitReasons.slice(0, i).reduce((s, x) => s + x.pct, 0);
                    return `${r.color} ${start * 3.6}deg ${(start + r.pct) * 3.6}deg`;
                  }).join(', ')})`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-[#1f1f24]" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-[#3b494b]/20">
            {exitReasons.map((r) => (
              <div key={r.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-[11px] text-[#b9cacb]">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Usage Report */}
      <div className="bg-[#1f1f24] rounded-xl shadow-sm border border-[#3b494b]/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#e4e1e9]">System Usage Report</h3>
            <p className="text-sm text-[#b9cacb]">Daily login volume and workflow approval metrics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUsageModal(true)}
              className="px-4 py-2 text-sm font-medium bg-[#00dbe9] text-black rounded-lg hover:bg-[#00dbe9]/90 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {usageMetrics.map((m) => (
            <div key={m.label} className={`p-4 rounded-xl border ${m.danger ? 'bg-[#ffb4ab]/30 border-[#ffb4ab]/20' : 'bg-[#2a292f] border-[#3b494b]/20'}`}>
              <p className="text-xs font-medium text-[#b9cacb] uppercase mb-1">{m.label}</p>
              <p className={`text-4xl font-bold ${m.color}`}>{m.value}</p>
              <div className={`flex items-center gap-1 mt-2 ${m.danger ? 'text-[#ffb4ab]' : m.trendUp ? 'text-[#15803d]' : 'text-[#b9cacb]'}`}>
                <Icon className="text-sm">{m.danger ? 'warning' : m.trendUp ? 'trending_up' : 'schedule'}</Icon>
                <span className="text-xs">{m.trend}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Hourly Activity Wave */}
        <div className="h-32 w-full bg-[#2a292f] rounded-xl border border-[#3b494b]/20 flex items-center justify-center relative overflow-hidden">
          <p className="text-[#b9cacb] text-xs font-medium absolute top-4 left-4">Hourly Activity (24h)</p>
          <svg className="w-full h-full opacity-40 pt-8" preserveAspectRatio="none" viewBox="0 0 1000 100">
            <defs>
              <linearGradient id="blue-grad-rpt" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00dbe9" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00dbe9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,80 C100,80 150,20 250,50 C350,80 400,10 500,40 C600,70 650,30 750,60 C850,90 900,20 1000,50 L1000,100 L0,100 Z" fill="url(#blue-grad-rpt)" />
            <path d="M0,80 C100,80 150,20 250,50 C350,80 400,10 500,40 C600,70 650,30 750,60 C850,90 900,20 1000,50" fill="none" stroke="#00dbe9" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {showUsageModal && <UsageDetailsModal onClose={() => setShowUsageModal(false)} />}
    </div>
  );
}
