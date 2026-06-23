import { useState, useEffect } from 'react';
import Icon from '../Icon';
import {
  fetchAdminAnalyticsSync,
  fetchPendingApprovals,
  fetchFailedLogins,
  fetchHourlyActivity,
  fetchSystemUsageSnapshot,
  getSystemUsageStreamUrl
} from '../../api';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/* ── System Usage Details modal ── */
/* ── System Usage Details modal ── */
function UsageDetailsModal({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSnapshot() {
      try {
        const snapshot = await fetchSystemUsageSnapshot();
        setData(snapshot);
      } catch (err) {
        console.error("Failed to load snapshot", err);
      } finally {
        setLoading(false);
      }
    }
    loadSnapshot();

    const streamUrl = getSystemUsageStreamUrl();
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = jsonParse(event.data);
        if (parsed) {
          setData(parsed);
        }
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE stream error", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Helper to safe parse JSON
  function jsonParse(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  const uniqueUsers = data?.login_activity?.unique_users?.count || '0';
  const uniqueUsersTrend = data?.login_activity?.unique_users?.trend || '+8%';
  
  const avgSession = data?.login_activity?.avg_session?.duration || '24m 12s';
  const avgSessionStatus = data?.login_activity?.avg_session?.status || 'Stable';
  
  const peakHourTime = data?.login_activity?.peak_hour?.time || '10:00 AM';
  const peakHourConcurrent = data?.login_activity?.peak_hour?.concurrent || '142 concurrent';

  const resignationRequests = data?.workflow_performance?.resignation_requests || { initiated: 156, completed: 142, avg_time: '1.2 Days' };
  const exitInterviews = data?.workflow_performance?.exit_interviews || { initiated: 84, completed: 78, avg_time: '45 Mins' };

  const errorLogs = data?.error_logs_summary || { status_401: 18, status_403: 6 };

  const workflowPerformance = [
    { metric: 'Resignation Requests', initiated: resignationRequests.initiated, completed: resignationRequests.completed, avg_time: resignationRequests.avg_time },
    { metric: 'Exit Interviews', initiated: exitInterviews.initiated, completed: exitInterviews.completed, avg_time: exitInterviews.avg_time }
  ];

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
                { label: 'Unique Users', value: uniqueUsers, sub: uniqueUsersTrend, subColor: 'text-[#15803d]' },
                { label: 'Avg. Session', value: avgSession, sub: avgSessionStatus, subColor: 'text-[#b9cacb]' },
                { label: 'Peak Hour', value: peakHourTime, sub: peakHourConcurrent, subColor: 'text-[#b9cacb]' },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-lg bg-[#2a292f] border border-[#3b494b]/20">
                  <p className="text-xs font-medium text-[#b9cacb] uppercase">{m.label}</p>
                  {loading && !data ? (
                    <div className="animate-pulse space-y-2 mt-1">
                      <div className="h-6 bg-[#3b494b]/20 rounded w-16"></div>
                      <div className="h-3 bg-[#3b494b]/10 rounded w-20"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-semibold text-[#e4e1e9]">{m.value}</p>
                      <p className={`text-xs mt-1 flex items-center gap-1 ${m.subColor}`}>
                        {m.label === 'Unique Users' && <Icon className="text-sm">trending_up</Icon>}
                        {m.sub}
                      </p>
                    </>
                  )}
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
                  {workflowPerformance.map((row) => (
                    <tr key={row.metric}>
                      <td className="p-4 font-medium">{row.metric}</td>
                      <td className="p-4">
                        {loading && !data ? (
                          <div className="animate-pulse h-4 bg-[#3b494b]/20 rounded w-8"></div>
                        ) : row.initiated}
                      </td>
                      <td className="p-4">
                        {loading && !data ? (
                          <div className="animate-pulse h-4 bg-[#3b494b]/20 rounded w-8"></div>
                        ) : row.completed}
                      </td>
                      <td className="p-4">
                        {loading && !data ? (
                          <div className="animate-pulse h-4 bg-[#3b494b]/20 rounded w-16"></div>
                        ) : row.avg_time}
                      </td>
                    </tr>
                  ))}
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
                <span className="font-bold text-[#ffb4ab]">
                  {loading && !data ? (
                    <div className="animate-pulse h-4 bg-[#3b494b]/20 rounded w-6 inline-block"></div>
                  ) : errorLogs.status_401}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#2a292f] rounded-lg border border-[#3b494b]/20">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#b9cacb] text-white text-xs font-bold rounded">403</span>
                  <span className="text-sm">Forbidden Resource Requests</span>
                </div>
                <span className="font-bold">
                  {loading && !data ? (
                    <div className="animate-pulse h-4 bg-[#3b494b]/20 rounded w-6 inline-block"></div>
                  ) : errorLogs.status_403}
                </span>
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
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [showUsageModal, setShowUsageModal] = useState(false);

  const [pendingApprovals, setPendingApprovals] = useState(null);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [failedLogins, setFailedLogins] = useState(null);
  const [failedLoading, setFailedLoading] = useState(true);
  const [hourlyActivity, setHourlyActivity] = useState([]);
  const [hourlyLoading, setHourlyLoading] = useState(true);

  async function fetchRealTimeMetrics() {
    try {
      const pendingData = await fetchPendingApprovals();
      setPendingApprovals(pendingData);
    } catch (err) {
      console.error('Failed to fetch pending approvals', err);
    } finally {
      setPendingLoading(false);
    }

    try {
      const failedData = await fetchFailedLogins();
      setFailedLogins(failedData);
    } catch (err) {
      console.error('Failed to fetch failed logins', err);
    } finally {
      setFailedLoading(false);
    }

    try {
      const activityData = await fetchHourlyActivity();
      setHourlyActivity(activityData);
    } catch (err) {
      console.error('Failed to fetch hourly activity', err);
    } finally {
      setHourlyLoading(false);
    }
  }

  async function loadAnalytics(isManual = false) {
    if (isManual) setSyncing(true);
    try {
      const data = await fetchAdminAnalyticsSync();
      setAnalyticsData(data.data);
      setError(null);
      await fetchRealTimeMetrics();
    } catch (err) {
      setError(err.message || 'Failed to sync analytics data');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(fetchRealTimeMetrics, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const attritionData = analyticsData?.charts?.attrition_trends || [];
  const exitReasons = analyticsData?.charts?.exit_reasons || [];
  const summary = analyticsData?.summary || {};

  const categoryColors = {
    'Career Growth': '#00dbe9',
    'Compensation': '#f43f5e',
    'Work-Life Balance': '#10b981',
    'Management': '#eab308',
    'Other': '#8b5cf6'
  };

  const chartData = exitReasons.map(r => ({
    name: r.label,
    count: r.count || 0,
    pct: r.pct || 0,
    color: categoryColors[r.label] || r.color
  }));

  const failedCount = failedLogins !== null ? failedLogins.count : 0;
  const showFailedDanger = failedCount > 0;

  const usageMetrics = [
    { label: 'Total Logins (Today)', value: summary.total_logins_today?.toLocaleString() || '0', trend: '+12% vs yesterday', trendUp: true, color: 'text-[#00dbe9]', loading: false },
    { label: 'Workflows Initiated', value: summary.workflows_initiated?.toLocaleString() || '0', trend: '+5% vs yesterday', trendUp: true, color: 'text-[#e4e1e9]', loading: false },
    { label: 'Pending Approvals', value: pendingLoading ? '...' : (pendingApprovals?.count?.toLocaleString() || '0'), trend: pendingLoading ? 'Loading...' : `Avg time: ${pendingApprovals?.avg_time_hours || 0}hrs`, trendUp: null, color: 'text-[#b9cacb]', loading: pendingLoading },
    { label: 'Failed Logins', value: failedLoading ? '...' : (failedCount?.toLocaleString() || '0'), trend: showFailedDanger ? 'Investigate' : 'Normal', trendUp: showFailedDanger ? false : null, color: showFailedDanger ? 'text-[#ffb4ab]' : 'text-[#b9cacb]', danger: showFailedDanger, loading: failedLoading },
  ];

  const maxBar = attritionData.length > 0
    ? Math.max(...attritionData.map((d) => (d.voluntary || 0) + (d.involuntary || 0)), 1)
    : 1;

  // Bezier curve helper for smooth SVG charts
  function getBezierPath(pts) {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  // Map 24h activity to SVG points
  const maxActivity = hourlyActivity.length > 0 ? Math.max(...hourlyActivity.map(d => d.count), 1) : 1;
  const hourlyPoints = hourlyActivity.map((d, i) => ({
    x: (i / Math.max(hourlyActivity.length - 1, 1)) * 1000,
    y: 85 - ((d.count / maxActivity) * 65)
  }));
  const svgPathDLine = getBezierPath(hourlyPoints);
  const svgPathD = svgPathDLine ? `${svgPathDLine} L 1000 100 L 0 100 Z` : '';

  if (loading && !analyticsData) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-[#2a292f] rounded w-64"></div>
          <div className="h-10 bg-[#2a292f] rounded w-32"></div>
        </div>
        <div className="h-[380px] bg-[#1f1f24] border border-[#3b494b]/20 rounded-xl"></div>
        <div className="h-[280px] bg-[#1f1f24] border border-[#3b494b]/20 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-[#e4e1e9] tracking-tight">Reports & Analytics</h2>
          <p className="text-base text-[#b9cacb] mt-1">Monitor organization trends and system utilization.</p>
        </div>
        <button
          onClick={() => loadAnalytics(true)}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a292f] border border-[#3b494b]/30 rounded-lg text-sm text-[#e4e1e9] hover:bg-[#34333b] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none self-start sm:self-center"
        >
          <Icon className={`${syncing ? 'animate-spin' : ''}`}>sync</Icon>
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {error && (
        <div className="bg-[#b91c1c]/10 border border-[#b91c1c]/20 text-[#b91c1c] px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <Icon className="text-lg">error</Icon>
          <span>Failed to sync analytics. ({error})</span>
        </div>
      )}

      {/* Column-Line Chart: Exit Reasons */}
      <div className="bg-[#1f1f24] rounded-xl shadow-sm border border-[#3b494b]/20 p-6 flex flex-col relative w-full">
        {syncing && (
          <div className="absolute inset-0 bg-[#1f1f24]/50 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
            <Icon className="text-4xl text-[#00dbe9] animate-spin">sync</Icon>
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#e4e1e9]">Top Exit Reasons</h3>
          <p className="text-xs text-[#b9cacb] mt-1">YTD Aggregated Data</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#3b494b" opacity={0.2} vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#b9cacb', fontSize: 11 }}
                stroke="#3b494b"
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#3b494b"
                tick={{ fill: '#b9cacb', fontSize: 11 }}
                tickLine={false}
                label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#b9cacb', offset: 0, style: { fontSize: 11 } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#3b494b"
                tick={{ fill: '#b9cacb', fontSize: 11 }}
                tickLine={false}
                domain={[0, 100]}
                label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight', fill: '#b9cacb', offset: 0, style: { fontSize: 11 } }}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#1f1f24] border border-[#3b494b]/60 p-3 rounded-lg shadow-lg">
                        <p className="text-xs font-semibold text-[#e4e1e9] mb-1">{data.name}</p>
                        <p className="text-xs text-[#b9cacb]">Count: <span className="text-[#00dbe9] font-semibold">{data.count}</span></p>
                        <p className="text-xs text-[#b9cacb]">Percentage: <span className="text-[#f43f5e] font-semibold">{data.pct}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="left" dataKey="count" barSize={36} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pct"
                stroke="#e4e1e9"
                strokeWidth={2}
                dot={{ fill: '#e4e1e9', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-[#3b494b]/20">
          {exitReasons.map((r) => {
            const color = categoryColors[r.label] || r.color;
            const isZero = (r.pct || 0) === 0;
            return (
              <div key={r.label} className={`flex items-center gap-1.5 transition-opacity ${isZero ? 'opacity-40' : 'opacity-100'}`}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[11px] text-[#b9cacb] font-medium">{r.label} ({r.pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Usage Report */}
      <div className="bg-[#1f1f24] rounded-xl shadow-sm border border-[#3b494b]/20 p-6 relative">
        {syncing && (
          <div className="absolute inset-0 bg-[#1f1f24]/50 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
            <Icon className="text-4xl text-[#00dbe9] animate-spin">sync</Icon>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#e4e1e9]">System Usage Report</h3>
            <p className="text-sm text-[#b9cacb]">Daily login volume and workflow approval metrics</p>
          </div>
        </div>
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {usageMetrics.map((m) => (
            <div key={m.label} className={`p-4 rounded-xl border ${m.danger ? 'bg-[#ffb4ab]/30 border-[#ffb4ab]/20' : 'bg-[#2a292f] border-[#3b494b]/20'}`}>
              <p className="text-xs font-medium text-[#b9cacb] uppercase mb-1">{m.label}</p>
              {m.loading ? (
                <div className="animate-pulse space-y-2 mt-1">
                  <div className="h-8 bg-[#3b494b]/20 rounded w-16"></div>
                  <div className="h-4 bg-[#3b494b]/10 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <p className={`text-4xl font-bold ${m.color}`}>{m.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${m.danger ? 'text-[#ffb4ab]' : m.trendUp ? 'text-[#15803d]' : 'text-[#b9cacb]'}`}>
                    <Icon className="text-sm">{m.danger ? 'warning' : m.trendUp ? 'trending_up' : 'schedule'}</Icon>
                    <span className="text-xs">{m.trend}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {/* Hourly Activity Wave */}
        <div className="h-32 w-full bg-[#2a292f] rounded-xl border border-[#3b494b]/20 flex items-center justify-center relative overflow-hidden">
          <p className="text-[#b9cacb] text-xs font-medium absolute top-4 left-4">Hourly Activity (24h)</p>
          {hourlyLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#2a292f] animate-pulse">
              <div className="w-full h-12 bg-gradient-to-r from-transparent via-[#00dbe9]/10 to-transparent" />
            </div>
          ) : (
            <svg className="w-full h-full opacity-40 pt-8" preserveAspectRatio="none" viewBox="0 0 1000 100">
              <defs>
                <linearGradient id="blue-grad-rpt" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#00dbe9" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#00dbe9" stopOpacity="0" />
                </linearGradient>
              </defs>
              {svgPathD && <path d={svgPathD} fill="url(#blue-grad-rpt)" />}
              {svgPathDLine && <path d={svgPathDLine} fill="none" stroke="#00dbe9" strokeWidth="2" />}
            </svg>
          )}
        </div>
      </div>

      {showUsageModal && (
        <UsageDetailsModal
          onClose={() => setShowUsageModal(false)}
        />
      )}
    </div>
  );
}
