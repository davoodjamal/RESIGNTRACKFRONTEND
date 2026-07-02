import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchDashboardMetrics, fetchSystemHealth } from '../../api';

const formatLastUpdated = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `Today, ${displayHours}:${displayMinutes} ${ampm}`;
};

export default function AdminDashboard({ users }) {
  const totalUsers = users ? users.length : 14285;
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('...');

  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [expiry, setExpiry] = useState('never');

  const [announcement, setAnnouncement] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_announcement');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiryTime && new Date().getTime() > parsed.expiryTime) {
          localStorage.removeItem('admin_announcement');
          return null;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        setHealthLoading(true);
        const [metricsRes, healthRes] = await Promise.all([
          fetchDashboardMetrics(),
          fetchSystemHealth()
        ]);
        if (active) {
          if (metricsRes && metricsRes.success) {
            setMetrics(metricsRes.data);
          }
          if (healthRes && healthRes.success) {
            setHealth(healthRes.data);
          }
          setLastUpdated(formatLastUpdated(new Date()));
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load dashboard metrics');
          setHealthError(err.message || 'Failed to load system health status');
        }
      } finally {
        if (active) {
          setLoading(false);
          setHealthLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title || !message) return;

    let expiryTime = null;
    const now = new Date().getTime();
    if (expiry === '1h') {
      expiryTime = now + 60 * 60 * 1000;
    } else if (expiry === '24h') {
      expiryTime = now + 24 * 60 * 60 * 1000;
    } else if (expiry === '7d') {
      expiryTime = now + 7 * 24 * 60 * 60 * 1000;
    }

    const newAnnouncement = {
      title,
      message,
      expiry,
      expiryTime,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setAnnouncement(newAnnouncement);
    localStorage.setItem('admin_announcement', JSON.stringify(newAnnouncement));
    setShowModal(false);

    setTitle('');
    setMessage('');
    setExpiry('never');
  };

  const handleDelete = () => {
    setAnnouncement(null);
    localStorage.removeItem('admin_announcement');
  };

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
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00dbe9] text-black font-semibold text-sm rounded-lg hover:bg-[#00dbe9]/90 active:scale-95 transition-all shadow-[0_0_12px_rgba(0,219,233,0.3)]"
          >
            <Icon>add_alert</Icon>
            Create Announcement
          </button>
          <p className="text-xs font-medium tracking-wide text-[#b9cacb]">Last updated: {lastUpdated}</p>
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
          <p className="text-2xl font-semibold text-[#e4e1e9] relative z-10">
            {loading ? '...' : error ? 'Error' : metrics?.activeResignations}
          </p>
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
          <p className="text-2xl font-semibold text-[#e4e1e9] relative z-10">
            {loading ? '...' : error ? 'Error' : metrics?.pendingTasks}
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#1f1f24] rounded-lg p-6 border border-[#c3c6d5] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#33fb0a]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`w-10 h-10 rounded-lg bg-[#2a292f] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              healthLoading ? 'text-[#b9cacb]' :
              healthError || health?.status !== 'Healthy' ? 'text-[#BA1A1A]' : 'text-[#33fb0a]'
            }`}>
              <Icon>health_and_safety</Icon>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-medium tracking-wide px-2 py-1 rounded-full ${
              healthLoading ? 'text-[#b9cacb] bg-[#b9cacb]/10' :
              healthError || health?.status !== 'Healthy' ? 'text-[#BA1A1A] bg-[#BA1A1A]/10' : 'text-[#33fb0a] bg-[#33fb0a]/10'
            }`}>
              {healthLoading ? '... Uptime' : healthError ? 'Error' : `${health?.uptime} Uptime`}
            </span>
          </div>
          <h3 className="text-sm text-[#b9cacb] mb-1 relative z-10">System Health Status</h3>
          <p className={`text-2xl font-semibold flex items-baseline gap-2 relative z-10 ${
            healthLoading ? 'text-[#b9cacb]' :
            healthError || health?.status !== 'Healthy' ? 'text-[#BA1A1A]' : 'text-[#e4e1e9]'
          }`}>
            {healthLoading ? '...' : healthError ? 'Error' : health?.status}
            <span className="text-sm text-[#b9cacb] font-normal">
              {healthLoading ? '...' : healthError ? '' : `${health?.errors} Errors`}
            </span>
          </p>
        </div>
      </div>

      {/* Main Content Area: Announcements */}
      {announcement ? (
        <div className="bg-[#1f1f24] rounded-lg border border-[#00dbe9]/30 shadow-md flex flex-col mt-4 p-6 relative group animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00dbe9] rounded-l-lg"></div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00dbe9] text-xl animate-pulse">campaign</span>
              <h3 className="text-xl font-bold text-[#e4e1e9]">{announcement.title}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#b9cacb]">{announcement.timestamp}</span>
              <button
                onClick={handleDelete}
                className="p-1 text-[#b9cacb] hover:text-[#ffb4ab] hover:bg-[#2a292f] rounded transition-all active:scale-95"
                title="Delete Announcement"
              >
                <Icon className="text-lg">delete</Icon>
              </button>
            </div>
          </div>
          <p className="text-sm text-[#b9cacb] leading-relaxed whitespace-pre-wrap pl-7">
            {announcement.message}
          </p>
          {announcement.expiryTime && (
            <div className="mt-4 pt-3 border-t border-[#3b494b]/20 flex justify-end">
              <span className="text-[10px] text-[#00dbe9] bg-[#00dbe9]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Icon className="text-[12px]">schedule</Icon>
                Expires: {new Date(announcement.expiryTime).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1f1f24] rounded-lg border border-[#c3c6d5] shadow-sm flex flex-col mt-4 min-h-[200px] p-6 justify-center items-center">
          <span className="material-symbols-outlined text-4xl text-[#b9cacb] mb-2 opacity-50">campaign</span>
          <p className="text-[#b9cacb] font-medium">No active announcements</p>
          <p className="text-xs text-[#b9cacb] mt-1">System broadcasts will appear here.</p>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#e4e1e9]/40 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-[500px] bg-[#1f1f24] rounded-xl border border-[#3b494b]/30 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#3b494b]/30 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#e4e1e9] flex items-center gap-2">
                  <Icon className="text-[#00dbe9]">add_alert</Icon>
                  Create Announcement
                </h3>
                <p className="text-xs text-[#b9cacb] mt-1">
                  Broadcast message to all administrators on dashboard overview.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[#b9cacb] hover:text-[#e4e1e9] hover:bg-[#2a292f] rounded-full transition-all"
              >
                <Icon>close</Icon>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#b9cacb] uppercase mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Maintenance"
                  className="w-full px-3 py-2 bg-[#2a292f] border border-[#3b494b]/40 rounded-lg text-sm text-[#e4e1e9] placeholder-[#b9cacb]/40 focus:outline-none focus:border-[#00dbe9] focus:ring-1 focus:ring-[#00dbe9] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b9cacb] uppercase mb-1.5">
                  Message / Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type announcement description here..."
                  className="w-full px-3 py-2 bg-[#2a292f] border border-[#3b494b]/40 rounded-lg text-sm text-[#e4e1e9] placeholder-[#b9cacb]/40 focus:outline-none focus:border-[#00dbe9] focus:ring-1 focus:ring-[#00dbe9] transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b9cacb] uppercase mb-1.5">
                  Expiry Duration
                </label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a292f] border border-[#3b494b]/40 rounded-lg text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9] transition-all"
                >
                  <option value="never">Never expire</option>
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#3b494b]/30">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#3b494b] text-[#b9cacb] text-sm font-semibold hover:bg-[#2a292f] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00dbe9] text-black font-semibold text-sm hover:bg-[#00dbe9]/90 active:scale-95 transition-all shadow-[0_0_12px_rgba(0,219,233,0.3)]"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
