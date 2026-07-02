import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchSystemHealthV1 } from '../../api';

export default function SystemHealth({ onOpenAuditTrail }) {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHealth() {
      try {
        const data = await fetchSystemHealthV1();
        if (isMounted) {
          setHealthData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch system health');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHealth();

    const interval = setInterval(loadHealth, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const dbStatus = healthData?.database?.status || 'Offline';
  const dbLatency = healthData?.database?.latency || '0ms';
  const dbCluster = healthData?.database?.cluster || 'Primary US-East Cluster';

  const serverStatus = healthData?.server?.status || 'Unknown';
  const serverUptime = healthData?.server?.uptime || '0.00%';

  const isDbOnline = dbStatus === 'Online';
  const isServerHealthy = serverStatus === 'Healthy';

  const dbBadgeColor = isDbOnline
    ? 'bg-[#15803d]/10 text-[#15803d] border-[#15803d]/20 shadow-[0_0_12px_rgba(21,128,61,0.4)]'
    : 'bg-[#b91c1c]/10 text-[#b91c1c] border-[#b91c1c]/20 shadow-[0_0_12px_rgba(185,28,28,0.4)]';
  const dbDotColor = isDbOnline ? 'bg-[#15803d]' : 'bg-[#b91c1c]';

  const serverBadgeColor = isServerHealthy
    ? 'bg-[#15803d]/10 text-[#15803d] border-[#15803d]/20 shadow-[0_0_12px_rgba(21,128,61,0.4)]'
    : 'bg-[#b91c1c]/10 text-[#b91c1c] border-[#b91c1c]/20 shadow-[0_0_12px_rgba(185,28,28,0.4)]';
  const serverDotColor = isServerHealthy ? 'bg-[#15803d]' : 'bg-[#b91c1c]';

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-[#e4e1e9] tracking-tight">System Health</h2>
        <p className="text-base text-[#b9cacb] mt-1">Monitor and manage technical infrastructure operations.</p>
      </div>

      {error && (
        <div className="bg-[#b91c1c]/10 border border-[#b91c1c]/20 text-[#b91c1c] px-4 py-3 rounded-lg flex items-center gap-2 text-sm animate-fadeUp">
          <Icon className="text-lg">error</Icon>
          <span>Failed to sync system health. Retrying in 15s... ({error})</span>
        </div>
      )}

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Database Connection */}
        <div className="bg-[#1f1f24] rounded-lg p-6 shadow-sm border border-[#3b494b]/30 flex flex-col justify-between animate-fadeUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start justify-between mb-12">
            <div>
              <h3 className="text-xl font-semibold text-[#e4e1e9] mb-1">Database Connection</h3>
              <p className="text-sm text-[#b9cacb]">{loading && !healthData ? 'Connecting...' : dbCluster}</p>
            </div>
            <div className={`px-2 py-1 h-10 rounded-lg text-xs font-medium flex items-center border ${dbBadgeColor}`}>
              <span className={`w-2 h-2 rounded-full ${dbDotColor} mr-1 animate-pulse`} />
              {loading && !healthData ? 'Loading...' : dbStatus}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-[#b9cacb] mb-1 uppercase">Latency</p>
              <p className={`text-2xl font-semibold text-[#e4e1e9] ${loading && !healthData ? 'animate-pulse text-[#505f76]' : ''}`}>
                {loading && !healthData ? 'Checking...' : dbLatency}
              </p>
            </div>
            <Icon className="text-4xl text-[#3b494b]/50">database</Icon>
          </div>
        </div>

        {/* Card 2: Server Uptime */}
        <div className="bg-[#1f1f24] rounded-lg p-6 shadow-sm border border-[#3b494b]/30 flex flex-col justify-between animate-fadeUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start justify-between mb-12">
            <div>
              <h3 className="text-xl font-semibold text-[#e4e1e9] mb-1">Server Uptime</h3>
              <p className="text-sm text-[#b9cacb]">Application Servers</p>
            </div>
            <div className={`px-2 py-1 h-10 rounded-lg text-xs font-medium flex items-center border ${serverBadgeColor}`}>
              <span className={`w-2 h-2 rounded-full ${serverDotColor} mr-1 animate-pulse`} />
              {loading && !healthData ? 'Loading...' : serverStatus}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-[#b9cacb] mb-1 uppercase">Continuous Operation</p>
              <p className={`text-2xl font-semibold text-[#e4e1e9] ${loading && !healthData ? 'animate-pulse text-[#505f76]' : ''}`}>
                {loading && !healthData ? 'Checking...' : serverUptime}
              </p>
            </div>
            <Icon className="text-4xl text-[#3b494b]/50">dns</Icon>
          </div>
        </div>
      </div>

      {/* Database Management */}
      <div className="bg-[#1f1f24] rounded-lg p-6 shadow-sm border border-[#3b494b]/30 animate-fadeUp" style={{ animationDelay: '300ms' }}>
        <div className="border-b border-[#3b494b]/30 pb-4 mb-6 flex items-center gap-2">
          <Icon className="text-[#00dbe9]">manage_history</Icon>
          <h3 className="text-xl font-semibold text-[#e4e1e9]">Database Management</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={onOpenAuditTrail}
            className="group flex flex-col items-center justify-center p-12 rounded-lg bg-[#1f1f24] text-[#e4e1e9] border-2 border-[#3b494b] hover:border-[#00dbe9] hover:bg-[#2a292f] transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 min-h-[160px]"
          >
            <Icon className="text-4xl mb-4 text-[#505f76] group-hover:text-[#00dbe9] group-hover:scale-110 transition-transform duration-300">history</Icon>
            <span className="text-xl font-semibold mb-1 group-hover:text-[#00dbe9] transition-colors duration-300">Activity Log / Audit Trail</span>
            <span className="text-sm text-[#b9cacb] text-center">Review comprehensive logs of all administrative actions and system events.</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          opacity: 0;
          animation: fadeUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
