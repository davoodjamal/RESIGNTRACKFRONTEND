import Icon from '../Icon';

export default function OffboardingProcess({ resignation }) {
  // Offboarding stages with their status
  const stages = [
    {
      id: 'notice',
      name: 'Immediate Notice',
      status: resignation?.offboarding?.stages?.notice || 'completed',
      assignee: 'HR Manager',
      dueDate: resignation?.submissionDate,
      description: 'Employee and stakeholders notified of approval',
      tasks: [
        { name: 'Send approval notification email', completed: true },
        { name: 'Schedule offboarding kickoff meeting', completed: true },
        { name: 'Notify IT and Finance', completed: true }
      ]
    },
    {
      id: 'assets',
      name: 'Asset Return',
      status: resignation?.offboarding?.stages?.assets || 'in-progress',
      assignee: 'IT Manager',
      dueDate: resignation?.relievingDate,
      description: 'Collect company hardware & access cards',
      tasks: [
        { name: 'Send asset return checklist', completed: true },
        { name: 'Track laptop return', completed: false },
        { name: 'Collect access badges', completed: false }
      ]
    },
    {
      id: 'knowledge',
      name: 'Knowledge Transfer',
      status: resignation?.offboarding?.stages?.knowledge || 'pending',
      assignee: 'Team Lead',
      dueDate: resignation?.relievingDate,
      description: 'Document projects and hand over responsibilities',
      tasks: [
        { name: 'Create knowledge transfer documentation', completed: false },
        { name: 'Schedule handover sessions', completed: false },
        { name: 'Assign project ownership', completed: false }
      ]
    },
    {
      id: 'interview',
      name: 'Exit Interview',
      status: resignation?.offboarding?.stages?.interview || 'pending',
      assignee: 'HR Manager',
      dueDate: resignation?.relievingDate,
      description: 'Conduct exit interview and gather feedback',
      tasks: [
        { name: 'Schedule exit interview', completed: false },
        { name: 'Prepare exit survey', completed: false },
        { name: 'Conduct interview', completed: false }
      ]
    },
    {
      id: 'clearance',
      name: 'Final Clearance',
      status: resignation?.offboarding?.stages?.clearance || 'pending',
      assignee: 'IT & Security',
      dueDate: resignation?.relievingDate,
      description: 'Revoke system access and verify completion',
      tasks: [
        { name: 'Revoke system access', completed: false },
        { name: 'Cancel VPN access', completed: false },
        { name: 'Verify all systems cleared', completed: false }
      ]
    },
    {
      id: 'completed',
      name: 'Exit Completed',
      status: resignation?.offboarding?.stages?.completed || 'pending',
      assignee: 'HR Director',
      dueDate: new Date(new Date(resignation?.relievingDate).getTime() + 86400000).toISOString().split('T')[0],
      description: 'Archive employee records and close case',
      tasks: [
        { name: 'Archive all employee records', completed: false },
        { name: 'Send final documents', completed: false },
        { name: 'Close offboarding case', completed: false }
      ]
    }
  ];

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-[#00dbe9]/20', text: 'text-[#00dbe9]', border: 'border-[#00dbe9]' };
      case 'in-progress':
        return { bg: 'bg-[#ffe082]/20', text: 'text-[#ffe082]', border: 'border-[#ffe082]' };
      case 'pending':
        return { bg: 'bg-[#3b494b]/40', text: 'text-[#b9cacb]', border: 'border-[#3b494b]' };
      default:
        return { bg: 'bg-[#3b494b]/40', text: 'text-[#b9cacb]', border: 'border-[#3b494b]' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'in-progress':
        return 'pending';
      default:
        return 'radio_button_unchecked';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Progress Overview */}
      <div className="bg-[#1f1f24] rounded-2xl p-8 border border-[#3b494b] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#e4e1e9] mb-2">Offboarding Process</h2>
            <p className="text-sm text-[#b9cacb]">Employee: <span className="text-[#00dbe9] font-semibold">{resignation.name}</span></p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-[#00dbe9]">{progressPercent}%</div>
            <p className="text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Complete</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#2a292f] rounded-full overflow-hidden border border-[#3b494b]">
          <div
            className="h-full bg-gradient-to-r from-[#00dbe9] to-[#00dbe9]/70 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-4 text-xs text-[#b9cacb]">
          <span>{completedCount} of {stages.length} Stages Completed</span>
          <span>Last Updated: Today</span>
        </div>
      </div>

      {/* Stages Timeline */}
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const colors = getStatusColor(stage.status);
          const isLast = idx === stages.length - 1;

          return (
            <div key={stage.id} className="relative">
              {/* Connection Line */}
              {!isLast && (
                <div className="absolute left-12 top-24 bottom-0 w-1 bg-gradient-to-b from-[#3b494b] to-transparent"></div>
              )}

              {/* Stage Card */}
              <div className={`bg-[#1f1f24] rounded-xl p-6 border transition-all ${colors.border} shadow-sm hover:shadow-md hover:border-[#00dbe9]/50`}>
                <div className="flex items-start gap-6">
                  {/* Status Indicator */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.bg} border-2 ${colors.border}`}>
                    <Icon className={`${colors.text} text-2xl`}>{getStatusIcon(stage.status)}</Icon>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-[#e4e1e9]">{stage.name}</h3>
                        <p className="text-sm text-[#b9cacb] mt-1">{stage.description}</p>
                      </div>
                      <span className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colors.border}`}>
                        {stage.status}
                      </span>
                    </div>

                    {/* Stage Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-[#3b494b]">
                      <div>
                        <p className="text-xs font-medium text-[#b9cacb] uppercase mb-1">Assigned To</p>
                        <p className="text-sm font-semibold text-[#e4e1e9]">{stage.assignee}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-[#b9cacb] uppercase mb-1">Due Date</p>
                        <p className="text-sm font-semibold text-[#ffb4ab]">{stage.dueDate}</p>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      {stage.tasks.map((task, taskIdx) => (
                        <label key={taskIdx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a292f] transition-colors cursor-pointer group">
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.completed ? 'bg-[#00dbe9] border-[#00dbe9]' : 'border-[#3b494b] group-hover:border-[#00dbe9]'
                          }`}>
                            {task.completed && <Icon className="text-white text-sm">check</Icon>}
                          </div>
                          <span className={`text-sm ${task.completed ? 'text-[#b9cacb] line-through' : 'text-[#e4e1e9]'}`}>
                            {task.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#00dbe9]/10 rounded-xl p-6 border border-[#00dbe9]/30">
          <p className="text-xs font-medium text-[#b9cacb] uppercase mb-2">Completed Stages</p>
          <p className="text-3xl font-bold text-[#00dbe9]">{completedCount}</p>
          <p className="text-xs text-[#b9cacb] mt-2">of {stages.length} total</p>
        </div>
        <div className="bg-[#ffe082]/10 rounded-xl p-6 border border-[#ffe082]/30">
          <p className="text-xs font-medium text-[#b9cacb] uppercase mb-2">In Progress</p>
          <p className="text-3xl font-bold text-[#ffe082]">{stages.filter(s => s.status === 'in-progress').length}</p>
          <p className="text-xs text-[#b9cacb] mt-2">currently active</p>
        </div>
        <div className="bg-[#ffb4ab]/10 rounded-xl p-6 border border-[#ffb4ab]/30">
          <p className="text-xs font-medium text-[#b9cacb] uppercase mb-2">Pending</p>
          <p className="text-3xl font-bold text-[#ffb4ab]">{stages.filter(s => s.status === 'pending').length}</p>
          <p className="text-xs text-[#b9cacb] mt-2">awaiting action</p>
        </div>
      </div>
    </div>
  );
}
