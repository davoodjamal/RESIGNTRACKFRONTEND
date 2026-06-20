import { useState } from 'react';
import Icon from '../Icon';

export default function OffboardingApprovalModal({ resignation, onConfirm, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm();
      setIsProcessing(false);
    }, 600);
  };

  const offboardingStages = [
    { stage: 'Immediate Notice', duration: 'Day 1', description: 'Employee and stakeholders notified' },
    { stage: 'Asset Return', duration: '7 days', description: 'Collect company hardware & access cards' },
    { stage: 'Knowledge Transfer', duration: '14 days', description: 'Document projects and hand over responsibilities' },
    { stage: 'Exit Interview', duration: 'Final week', description: 'Conduct exit interview and gather feedback' },
    { stage: 'Final Clearance', duration: 'Final day', description: 'Revoke system access and verify completion' },
    { stage: 'Exit Completed', duration: 'Day after', description: 'Archive employee records and close case' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-[#1f1f24] rounded-2xl max-w-2xl w-full border border-[#3b494b] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00dbe9]/20 to-transparent p-8 border-b border-[#3b494b] flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#00dbe9]/20 rounded-lg text-[#00dbe9]">
              <Icon className="text-[32px]">check_circle</Icon>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#e4e1e9] mb-1">Approve & Initiate Offboarding</h2>
              <p className="text-sm text-[#b9cacb]">Employee: <span className="text-[#00dbe9] font-semibold">{resignation.name}</span></p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-[#b9cacb] hover:text-[#e4e1e9] transition-colors p-2"
          >
            <Icon>close</Icon>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2a292f] p-4 rounded-xl border border-[#3b494b]">
              <p className="text-xs font-medium text-[#b9cacb] mb-1 uppercase">Last Working Day</p>
              <p className="text-lg font-bold text-[#ffb4ab]">{resignation.relievingDate}</p>
            </div>
            <div className="bg-[#2a292f] p-4 rounded-xl border border-[#3b494b]">
              <p className="text-xs font-medium text-[#b9cacb] mb-1 uppercase">Department</p>
              <p className="text-lg font-bold text-[#e4e1e9]">{resignation.department}</p>
            </div>
          </div>

          {/* Offboarding Process Timeline */}
          <div className="bg-[#2a292f] rounded-xl p-6 border border-[#3b494b]">
            <h3 className="text-sm font-bold text-[#00dbe9] uppercase tracking-wider mb-6">Offboarding Process Timeline</h3>
            <div className="space-y-4">
              {offboardingStages.map((item, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {idx < offboardingStages.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-[#00dbe9]/50 to-[#3b494b]"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-11 h-11 rounded-full bg-[#1f1f24] border-2 border-[#00dbe9] flex items-center justify-center text-xs font-bold text-[#00dbe9]">
                      {idx + 1}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="pt-1 pb-4 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#e4e1e9]">{item.stage}</p>
                      <span className="text-xs font-medium text-[#b9cacb] bg-[#1f1f24] px-3 py-1 rounded-full">{item.duration}</span>
                    </div>
                    <p className="text-sm text-[#b9cacb]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-[#ffb4ab]/10 rounded-xl p-4 border border-[#ffb4ab]/30 flex gap-4">
            <Icon className="text-[#ffb4ab] flex-shrink-0 mt-1">warning_amber</Icon>
            <div>
              <p className="text-sm font-semibold text-[#ffb4ab] mb-1">Important Reminders</p>
              <ul className="text-xs text-[#b9cacb] space-y-1">
                <li>• Offboarding process will start immediately upon approval</li>
                <li>• Employee will receive notification of this approval</li>
                <li>• Offboarding tasks have been assigned to relevant stakeholders</li>
                <li>• All progress will be tracked in the Offboarding Dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#131318] p-6 border-t border-[#3b494b] flex gap-4 justify-end rounded-b-2xl">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-3 border border-[#3b494b] text-[#b9cacb] rounded-lg text-sm font-semibold hover:bg-[#2a292f] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-6 py-3 bg-[#00dbe9] text-[#1f1f24] rounded-lg text-sm font-bold hover:bg-[#00dbe9]/90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Icon className="animate-spin">hourglass_bottom</Icon>
                Processing...
              </>
            ) : (
              <>
                <Icon>check_circle</Icon>
                Approve & Start Offboarding
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
