import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchExEmployees } from '../../api';

export default function ExEmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [insights, setInsights] = useState({
    totalRecords: 0,
    rehirePct: 0,
    avgTenure: 0,
    primaryReason: 'N/A'
  });
  const [loading, setLoading] = useState(true);
  const [departureFilter, setDepartureFilter] = useState('All Time');
  const [reasonFilter, setReasonFilter] = useState('All Reasons');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchExEmployees();
        if (res) {
          setEmployees(res.employees || []);
          if (res.insights) {
            setInsights(res.insights);
          }
        }
      } catch (err) {
        console.error('Failed to load ex-employees data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 5000); // Polling every 5 seconds for real-time updates
    return () => clearInterval(interval);
  }, []);

  const filteredEmployees = employees.filter(emp => {
    // Reason filter
    if (reasonFilter !== 'All Reasons') {
      const exitLower = (emp.exitReason || '').toLowerCase();
      if (reasonFilter === 'Voluntary') {
        const involuntaryReasons = ['layoff', 'fired', 'termination', 'involuntary', 'performance'];
        if (involuntaryReasons.some(r => exitLower.includes(r))) return false;
      } else if (reasonFilter === 'Involuntary') {
        const involuntaryReasons = ['layoff', 'fired', 'termination', 'involuntary', 'performance'];
        if (!involuntaryReasons.some(r => exitLower.includes(r))) return false;
      } else {
        if (!exitLower.includes(reasonFilter.toLowerCase())) return false;
      }
    }
    return true;
  });

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
              <select 
                value={departureFilter}
                onChange={(e) => setDepartureFilter(e.target.value)}
                className="bg-[#131318] border border-[#3b494b] rounded-lg px-4 h-[40px] text-sm focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none min-w-[180px]"
              >
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
              <select 
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="bg-[#131318] border border-[#3b494b] rounded-lg px-4 h-[40px] text-sm focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none min-w-[180px]"
              >
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
                You are viewing {insights.totalRecords} completed offboarding profiles.
              </p>
            </div>
            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <span className="block text-3xl font-bold text-[#00dbe9]">{insights.rehirePct}%</span>
                <span className="text-[10px] uppercase font-bold text-[#b9cacb]">Re-hire Eligible</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-[#00dbe9]">{insights.avgTenure}</span>
                <span className="text-[10px] uppercase font-bold text-[#b9cacb]">Avg Tenure (mo)</span>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 bg-[#00dbe9]/30 border border-[#00dbe9]/50 rounded-xl p-6 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-[#00dbe9] mb-2">
              Primary Exit Reason
            </span>
            <h4 className="text-xl font-semibold text-[#00dbe9]">{insights.primaryReason}</h4>
            <div className="w-full bg-[#3b494b] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#00dbe9] w-[65%] h-full"></div>
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Icon className="text-4xl text-[#00dbe9] animate-spin">sync</Icon>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#b9cacb]">
              No resigned employee records found.
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <div key={emp.id} className="bg-[#1f1f24] rounded-xl shadow-sm overflow-hidden border border-transparent hover:border-[#00dbe9]/30 hover:shadow-md transition-all duration-300 group flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-[18px] font-bold text-[#e4e1e9]">{emp.name}</h3>
                        <p className="text-sm text-[#b9cacb]">{emp.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full ${
                      emp.rehireEligible 
                        ? 'bg-[#00dbe9] text-[#131318]' 
                        : 'bg-[#3b494b] text-[#b9cacb]'
                    }`}>
                      {emp.rehireEligible ? 'Re-hire Eligible' : 'Offboarded'}
                    </span>
                  </div>
                  <div className="space-y-3 py-4 border-y border-[#3b494b]/30">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#b9cacb]">Department</span>
                      <span className="text-[#e4e1e9] font-medium">{emp.department}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#b9cacb]">Tenure</span>
                      <span className="text-[#e4e1e9] font-medium">{emp.tenure}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#b9cacb]">Departure Date</span>
                      <span className="text-[#e4e1e9] font-medium">{emp.departureDate}</span>
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
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-t border-[#3b494b] pt-6 gap-4">
          <p className="text-sm text-[#b9cacb]">
            Showing <span className="font-bold text-[#e4e1e9]">1 - {filteredEmployees.length}</span> of{' '}
            <span className="font-bold text-[#e4e1e9]">{filteredEmployees.length}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 border border-[#3b494b] rounded-lg hover:bg-[#eeedf5] flex items-center justify-center transition-all disabled:opacity-30" disabled>
              <Icon>chevron_left</Icon>
            </button>
            <div className="flex gap-1">
              <button className="w-10 h-10 bg-[#00dbe9] text-white rounded-lg text-xs shadow-sm font-medium">1</button>
            </div>
            <button className="w-10 h-10 border border-[#3b494b] rounded-lg hover:bg-[#eeedf5] flex items-center justify-center transition-all disabled:opacity-30" disabled>
              <Icon>chevron_right</Icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
