import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchAdminAuditLogs, getAuditLogsStreamUrl } from '../../api';

const formatLocalTimestamp = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  
  const pad = (num) => num.toString().padStart(2, '0');
  
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

const getActionColor = (action) => {
  switch (action?.toUpperCase()) {
    case 'ACCESS GRANTED':
    case 'APPROVED':
      return 'bg-[#15803d]/10 text-[#15803d]';
    case 'POLICY MODIFIED':
    case 'REJECTED':
      return 'bg-[#ed6c02]/10 text-[#ed6c02]';
    case 'USER REMOVED':
    case 'DELETED':
    case 'LOGOUT':
      return 'bg-[#ffb4ab]/10 text-[#ffb4ab]';
    case 'SYSTEM EVENT':
    case 'SYSTEM_EVENT':
      return 'bg-[#00dbe9]/30 text-[#39485e]';
    default:
      return 'bg-[#3b494b]/10 text-[#b9cacb]';
  }
};

const getInitials = (name) => {
  if (!name) return 'SY';
  const parts = name.split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const getAvatarBg = (name) => {
  if (!name || name.toLowerCase() === 'system') return 'bg-[#00dbe9]';
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['bg-[#00dbe9]', 'bg-[#d9e2ff]', 'bg-[#e0e3e5]', 'bg-[#ffb4ab]/60'];
  return colors[sum % colors.length];
};

export default function AuditTrailModal({ users = [], onClose }) {
  const adminUsers = users;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adminId, setAdminId] = useState('All Admins');
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Load logs when filter/page states change
  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        search: debouncedSearch,
        actionType: actionFilter === 'All Actions' ? '' : actionFilter,
        adminId: adminId === 'All Admins' ? '' : adminId,
        page,
        limit: 5,
      };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await fetchAdminAuditLogs(params);
      if (res && res.success) {
        setLogs(res.data.logs);
        setTotal(res.data.total);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [debouncedSearch, actionFilter, startDate, endDate, adminId, page]);

  // Realtime updates via Server-Sent Events (SSE)
  useEffect(() => {
    const url = getAuditLogsStreamUrl();
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        if (newLog) {
          // Prepend new log and keep pagination size at 5 items on page 1
          setLogs((prevLogs) => {
            const nextLogs = [newLog, ...prevLogs];
            return nextLogs.slice(0, 5);
          });
          setTotal((prevTotal) => prevTotal + 1);
        }
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource connection failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const perPage = 5;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-[#1f1f24] w-full max-w-[1100px] max-h-[870px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeZoom_0.3s_ease-out]">
        {/* Header */}
        <header className="p-6 border-b border-[#3b494b]/40 flex justify-between items-start">
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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all text-[#e4e1e9]"
                placeholder="Search by ID or Target..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#b9cacb] uppercase tracking-tight">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm focus:ring-2 focus:ring-[#00dbe9] outline-none transition-all text-[#e4e1e9]"
            >
              <option value="All Actions">All Actions</option>
              <option value="Access Granted">Access Granted</option>
              <option value="System Export">System Export</option>
              <option value="User Removed">User Removed</option>
              <option value="Policy Modified">Policy Modified</option>
              <option value="Review Finalized">Review Finalized</option>
              <option value="SYSTEM_EVENT">System Event</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#b9cacb] uppercase tracking-tight">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="w-1/2 px-2 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-xs focus:ring-2 focus:ring-[#00dbe9] outline-none transition-all text-[#e4e1e9]"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="w-1/2 px-2 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-xs focus:ring-2 focus:ring-[#00dbe9] outline-none transition-all text-[#e4e1e9]"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <label className="text-xs font-medium text-[#b9cacb] uppercase tracking-tight">Administrator</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="w-full px-3 py-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm text-[#e4e1e9] text-left flex justify-between items-center focus:ring-2 focus:ring-[#00dbe9] outline-none"
              >
                <span>{adminId === 'All Admins' ? 'All Admins' : (adminId === 'System' ? 'System' : (adminUsers.find(u => u.id.toString() === adminId.toString())?.fullName || adminUsers.find(u => u.id.toString() === adminId.toString())?.username || 'Selected'))}</span>
                <Icon className={`transition-transform duration-200 ${isAdminDropdownOpen ? 'rotate-180' : ''}`}>expand_more</Icon>
              </button>
              
              {isAdminDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAdminDropdownOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1 bg-[#1f1f24] border border-[#3b494b] rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-[#3b494b]/30">
                    <button
                      type="button"
                      onClick={() => { setAdminId('All Admins'); setPage(1); setIsAdminDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors ${adminId === 'All Admins' ? 'bg-[#00dbe9] text-black font-bold' : 'text-[#e4e1e9] hover:bg-[#2a292f]'}`}
                    >
                      All Admins
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAdminId('System'); setPage(1); setIsAdminDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors ${adminId === 'System' ? 'bg-[#00dbe9] text-black font-bold' : 'text-[#e4e1e9] hover:bg-[#2a292f]'}`}
                    >
                      System
                    </button>
                    {adminUsers.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => { setAdminId(u.id.toString()); setPage(1); setIsAdminDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${adminId.toString() === u.id.toString() ? 'bg-[#00dbe9] text-black font-bold' : 'text-[#e4e1e9] hover:bg-[#2a292f]'}`}
                      >
                        {u.fullName || u.username} ({u.role === 'admin' ? 'Admin' : (u.role === 'hr' ? 'HR' : 'Employee')})
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto min-h-[300px]">
          {error && <div className="p-4 text-sm text-[#ffb4ab] bg-[#ffb4ab]/10 text-center">{error}</div>}
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-[#2a292f] z-10">
              <tr>
                {['Timestamp', 'User (Admin)', 'Action', 'Target', 'IP Address'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#b9cacb] uppercase border-b border-[#3b494b]/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a292f]">
              {logs.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-[#2a292f] transition-colors">
                  <td className="px-6 py-4 text-sm text-[#e4e1e9]">{formatLocalTimestamp(row.timestamp || row.time)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${getAvatarBg(row.userName || 'System')} flex items-center justify-center text-[10px] font-bold text-black`}>
                        {getInitials(row.userName || 'System')}
                      </div>
                      <span className="text-sm text-[#e4e1e9]">{row.userName || 'System'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[11px] font-bold rounded-md uppercase tracking-wide ${getActionColor(row.actionType)}`}>
                      {row.actionType?.replace('_', ' ') || 'SYSTEM EVENT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#e4e1e9]">{row.target || row.message}</td>
                  <td className="px-6 py-4 text-xs text-[#b9cacb]">{row.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-[#b9cacb]">No matching records found.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-[#00dbe9]">Loading records...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="p-6 border-t border-[#3b494b]/40 flex items-center justify-between bg-[#131318]">
          <div className="text-sm text-[#b9cacb]">
            Showing <span className="font-bold text-[#e4e1e9]">{total > 0 ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, total)}</span> of <span className="font-bold text-[#e4e1e9]">{total}</span> activities
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="p-2 border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-colors disabled:opacity-30 text-[#e4e1e9]"
            >
              <Icon>chevron_left</Icon>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg text-sm ${page === p ? 'bg-[#00dbe9] text-black font-bold' : 'hover:bg-[#2a292f] text-[#e4e1e9]'}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="p-2 border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-colors disabled:opacity-30 text-[#e4e1e9]"
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
