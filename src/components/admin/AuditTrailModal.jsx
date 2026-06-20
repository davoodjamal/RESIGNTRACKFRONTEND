import { useState, useMemo } from 'react';
import Icon from '../Icon';

/* static demo rows when no auditLogs are passed */
const demoLogs = [
  { time: '2023-10-27 14:22:05', admin: 'Sarah Chen', initials: 'SC', action: 'Access Granted', actionColor: 'bg-[#15803d]/10 text-[#15803d]', target: 'Employee Profile: EMP-9021', ip: '192.168.1.104', avatarBg: 'bg-[#00dbe9]' },
  { time: '2023-10-27 13:05:11', admin: 'Marcus Wright', initials: 'MW', action: 'Policy Modified', actionColor: 'bg-[#ed6c02]/10 text-[#ed6c02]', target: 'Global Offboarding Workflow', ip: '10.0.0.45', avatarBg: 'bg-[#e0e3e5]' },
  { time: '2023-10-27 11:45:30', admin: 'Elena Rodriguez', initials: 'ER', action: 'User Removed', actionColor: 'bg-[#ffb4ab]/10 text-[#ffb4ab]', target: 'Contractor: J. Doe (EXT-882)', ip: '172.16.254.1', avatarBg: 'bg-[#d9e2ff]' },
  { time: '2023-10-27 09:12:44', admin: 'Sarah Chen', initials: 'SC', action: 'System Export', actionColor: 'bg-[#00dbe9]/30 text-[#39485e]', target: 'Q3 Resignation Summary CSV', ip: '192.168.1.104', avatarBg: 'bg-[#00dbe9]' },
  { time: '2023-10-26 17:59:12', admin: 'Marcus Wright', initials: 'MW', action: 'Review Finalized', actionColor: 'bg-[#15803d]/10 text-[#15803d]', target: 'Exit Interview: L. Smith', ip: '10.0.0.42', avatarBg: 'bg-[#e0e3e5]' },
];

export default function AuditTrailModal({ auditLogs = [], onClose }) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [page, setPage] = useState(1);

  /* merge real logs (from App.jsx) with demo logs */
  const allLogs = useMemo(() => {
    const realRows = auditLogs.map((log) => ({
      time: log.time || new Date().toISOString().slice(0, 19).replace('T', ' '),
      admin: 'System',
      initials: 'SY',
      action: 'System Event',
      actionColor: 'bg-[#00dbe9]/30 text-[#39485e]',
      target: log.message || '',
      ip: '127.0.0.1',
      avatarBg: 'bg-[#00dbe9]',
    }));
    return [...realRows, ...demoLogs];
  }, [auditLogs]);

  const filtered = allLogs.filter((row) => {
    if (search && !row.target.toLowerCase().includes(search.toLowerCase()) && !row.admin.toLowerCase().includes(search.toLowerCase())) return false;
    if (actionFilter !== 'All Actions' && row.action !== actionFilter) return false;
    return true;
  });

  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-[#1f1f24] w-full max-w-[1100px] max-h-[870px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeZoom_0.3s_ease-out]">
        {/* Header */}
        <header className="p-6 border-b border-[#e2e2eb] flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-[#e4e1e9]">Activity Log / Audit Trail</h2>
            <p className="text-sm text-[#b9cacb]">Monitoring every administrative heartbeat across the RESIGNTRACK ecosystem.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2a292f] rounded-full transition-colors text-[#b9cacb]">
            <Icon>close</Icon>
          </button>
        </header>

        {/* Filters */}
        <div className="p-6 bg-[#2a292f] grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#b9cacb] uppercase tracking-tight">Search Activity</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cacb]">search</Icon>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all"
                placeholder="Search by ID or Target..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#b9cacb] uppercase tracking-tight">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm focus:ring-2 focus:ring-[#00dbe9] outline-none transition-all"
            >
              <option>All Actions</option>
              <option>Access Granted</option>
              <option>System Export</option>
              <option>User Removed</option>
              <option>Policy Modified</option>
              <option>Review Finalized</option>
              <option>System Event</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#b9cacb] uppercase tracking-tight">Date Range</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cacb]">calendar_today</Icon>
              <input
                className="w-full pl-10 pr-4 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm outline-none cursor-pointer"
                readOnly
                defaultValue="Oct 01 - Oct 31, 2023"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#b9cacb] uppercase tracking-tight">Administrator</label>
            <select className="w-full px-3 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm focus:ring-2 focus:ring-[#00dbe9] outline-none transition-all">
              <option>All Admins</option>
              <option>Sarah Chen (SysAdmin)</option>
              <option>Marcus Wright (HR Director)</option>
              <option>Elena Rodriguez (IT Sec)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-[#2a292f] z-10">
              <tr>
                {['Timestamp', 'User (Admin)', 'Action', 'Target', 'IP Address'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#b9cacb] uppercase border-b border-[#3b494b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a292f]">
              {paged.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#2a292f] transition-colors">
                  <td className="px-6 py-4 text-sm text-[#e4e1e9]">{row.time}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${row.avatarBg} flex items-center justify-center text-[10px] font-bold`}>
                        {row.initials}
                      </div>
                      <span className="text-sm text-[#e4e1e9]">{row.admin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[11px] font-bold rounded-md uppercase tracking-wide ${row.actionColor}`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#e4e1e9]">{row.target}</td>
                  <td className="px-6 py-4 text-xs text-[#b9cacb]">{row.ip}</td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-[#b9cacb]">No matching records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="p-6 border-t border-[#e2e2eb] flex items-center justify-between bg-[#131318]">
          <div className="text-sm text-[#b9cacb]">
            Showing <span className="font-bold text-[#e4e1e9]">{Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)}</span> of <span className="font-bold text-[#e4e1e9]">{filtered.length}</span> activities
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-colors disabled:opacity-30"
            >
              <Icon>chevron_left</Icon>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg text-sm ${page === p ? 'bg-[#00dbe9] text-white font-bold' : 'hover:bg-[#2a292f]'}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-colors disabled:opacity-30"
            >
              <Icon>chevron_right</Icon>
            </button>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeZoom {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
