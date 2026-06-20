import Icon from '../Icon';

const statusCards = [
  {
    title: 'Database Connection',
    subtitle: 'Primary US-East Cluster',
    status: 'Online',
    statusColor: 'bg-[#15803d]/10 text-[#15803d] border-[#15803d]/20',
    metricLabel: 'Latency',
    metricValue: '12ms',
    icon: 'database',
  },
  {
    title: 'Server Uptime',
    subtitle: 'Application Servers',
    status: 'Healthy',
    statusColor: 'bg-[#15803d]/10 text-[#15803d] border-[#15803d]/20',
    metricLabel: 'Continuous Operation',
    metricValue: '99.99%',
    icon: 'dns',
  },
];

export default function SystemHealth({ onOpenAuditTrail }) {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-[#e4e1e9] tracking-tight">System Health</h2>
        <p className="text-base text-[#b9cacb] mt-1">Monitor and manage technical infrastructure operations.</p>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statusCards.map((card, i) => (
          <div
            key={card.title}
            className="bg-[#1f1f24] rounded-lg p-6 shadow-sm border border-[#3b494b]/30 flex flex-col justify-between animate-fadeUp"
            style={{ animationDelay: `${(i + 1) * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-12">
              <div>
                <h3 className="text-xl font-semibold text-[#e4e1e9] mb-1">{card.title}</h3>
                <p className="text-sm text-[#b9cacb]">{card.subtitle}</p>
              </div>
              <div className={`px-2 py-1 h-10 rounded-lg text-xs font-medium flex items-center border shadow-[0_0_12px_rgba(21,128,61,0.4)] ${card.statusColor}`}>
                <span className="w-2 h-2 rounded-full bg-[#15803d] mr-1 animate-pulse" />
                {card.status}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-[#b9cacb] mb-1 uppercase">{card.metricLabel}</p>
                <p className="text-2xl font-semibold text-[#e4e1e9]">{card.metricValue}</p>
              </div>
              <Icon className="text-4xl text-[#3b494b]/50">{card.icon}</Icon>
            </div>
          </div>
        ))}
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
