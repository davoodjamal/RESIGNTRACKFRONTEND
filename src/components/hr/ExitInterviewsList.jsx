import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchRescheduleRequests } from '../../api';

export default function ExitInterviewsList({ resignations, onUpdateStatus, onDecideRescheduleRequest }) {
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [decisionPendingId, setDecisionPendingId] = useState(null);
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await fetchRescheduleRequests();
      setRescheduleRequests(data);
    } catch (err) {
      console.error("Failed to fetch reschedule requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApprove = async (reqId) => {
    setErrorMsg('');
    setSuccessMsg('');
    setDecisionPendingId(reqId);
    setSubmittingDecision(true);
    try {
      await onDecideRescheduleRequest(reqId, 'Approved', '');
      setSuccessMsg('Reschedule request approved successfully.');
      await loadRequests();
      // Hide success message after 4s
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to approve request.');
    } finally {
      setSubmittingDecision(false);
      setDecisionPendingId(null);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setErrorMsg('Rejection reason is mandatory.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setSubmittingDecision(true);
    try {
      await onDecideRescheduleRequest(rejectingRequestId, 'Rejected', rejectionReason.trim());
      setSuccessMsg('Reschedule request rejected successfully.');
      setRejectingRequestId(null);
      setRejectionReason('');
      await loadRequests();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reject request.');
    } finally {
      setSubmittingDecision(false);
    }
  };

  const pendingRequests = rescheduleRequests.filter(req => req.status === 'Pending');
  const pastRequests = rescheduleRequests.filter(req => req.status !== 'Pending');

  return (
    <div className="pt-24 pb-16 px-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex text-xs font-medium text-[#b9cacb] gap-2 items-center mb-6">
        <span className="hover:text-[#00dbe9] cursor-pointer transition-colors">Resignations</span>
        <Icon className="text-[16px]">chevron_right</Icon>
        <span className="text-[#00dbe9] font-semibold">Exit Interview</span>
      </nav>

      {/* Messages */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Icon>check_circle</Icon>
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] text-sm flex items-center gap-2">
          <Icon>error</Icon>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pending Reschedule Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="mb-8 bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
            <h3 className="text-xl font-semibold text-[#00dbe9]">Pending Reschedule Requests</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((req) => {
              const resignation = resignations?.find(r => r.id === req.resignation);
              const employeeName = resignation ? resignation.name : 'Unknown Employee';
              const employeeEmail = resignation ? resignation.email : 'Unknown Email';
              const isProcessing = decisionPendingId === req.id || (submittingDecision && rejectingRequestId === req.id);

              return (
                <div key={req.id} className="p-5 rounded-xl bg-[#2a292f] border border-[#3b494b] flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-[#e4e1e9]">{employeeName}</h4>
                        <p className="text-xs text-[#b9cacb]">{employeeEmail}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded uppercase tracking-wider border border-yellow-500/20">
                        Pending
                      </span>
                    </div>

                    <div className="space-y-2 text-xs border-t border-[#3b494b]/30 pt-3">
                      <div className="flex justify-between">
                        <span className="text-[#b9cacb]">Current Schedule:</span>
                        <span className="font-medium text-[#e4e1e9]">{req.current_schedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b9cacb]">Requested:</span>
                        <span className="font-bold text-[#00dbe9]">{req.requested_date} at {req.requested_time.slice(0, 5)}</span>
                      </div>
                      <div className="bg-[#1f1f24] p-3 rounded-lg border border-[#3b494b]/50 mt-3">
                        <span className="block text-[10px] font-bold uppercase text-[#b9cacb] mb-1">Reason for reschedule</span>
                        <p className="text-xs text-[#e4e1e9] italic">"{req.reason}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 pt-2 border-t border-[#3b494b]/30">
                    <button
                      onClick={() => setRejectingRequestId(req.id)}
                      disabled={isProcessing}
                      className="flex-1 py-2 bg-transparent border border-[#ffb4ab] text-[#ffb4ab] rounded-lg text-xs font-semibold hover:bg-[#ffb4ab]/10 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={isProcessing}
                      className="flex-1 py-2 bg-[#00dbe9] text-[#131318] rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(0,219,233,0.2)]"
                    >
                      {decisionPendingId === req.id ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Analysis Dashboard */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#00dbe9]">Primary Exit Reasons</h3>
                <div className="bg-[#eeedf5] rounded px-3 py-1 text-[11px] font-bold text-[#b9cacb] uppercase tracking-wider">
                  Last 90 Days
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Better Career Growth', pct: '42%', color: 'bg-[#00dbe9]' },
                  { label: 'Compensation', pct: '28%', color: 'bg-[#00dbe9]' },
                  { label: 'Work-Life Balance', pct: '15%', color: 'bg-[#505f76]' },
                  { label: 'Relocation', pct: '10%', color: 'bg-[#b9cacb]' },
                  { label: 'Other', pct: '5%', color: 'bg-[#3b494b]' }
                ].map((reason, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#b9cacb]">{reason.label}</span>
                      <span className="font-bold text-[#e4e1e9]">{reason.pct}</span>
                    </div>
                    <div className="w-full bg-[#eeedf5] rounded-full h-2">
                      <div className={`${reason.color} h-2 rounded-full`} style={{ width: reason.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-64 flex items-center justify-center relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle className="text-[#eeedf5]" cx="96" cy="96" fill="transparent" r="70" stroke="currentColor" strokeWidth="20"></circle>
                <circle className="text-[#00dbe9]" cx="96" cy="96" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="255" strokeWidth="20"></circle>
                <circle className="text-[#00dbe9]" cx="96" cy="96" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="380" strokeWidth="20"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#00dbe9]">84</span>
                <span className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest">Total Exits</span>
              </div>
            </div>
          </div>

          {/* Feedback Repository */}
          <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#00dbe9]">Recent Feedback Repository</h3>
              <button className="text-[#00dbe9] font-semibold text-sm hover:underline flex items-center gap-1">
                View Full Analytics <Icon className="text-[16px]">open_in_new</Icon>
              </button>
            </div>
            <div className="space-y-4">
              {/* Feedback Card 1 */}
              <div className="p-4 rounded-xl bg-[#1f1f24] border border-[#3b494b]/30">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00dbe9] flex items-center justify-center text-[#00dbe9] font-bold text-sm">
                      SM
                    </div>
                    <div>
                      <p className="font-bold text-[#e4e1e9]">Sarah Miller</p>
                      <p className="text-xs font-medium text-[#b9cacb]">Senior Product Designer • 3.2 Years</p>
                    </div>
                  </div>
                  <div className="flex text-[#00dbe9]">
                    {[1, 2, 3, 4].map(i => <Icon key={i} className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</Icon>)}
                    <Icon className="text-[18px]">star</Icon>
                  </div>
                </div>
                <p className="text-sm text-[#b9cacb] italic leading-relaxed mb-3">
                  "The design culture is fantastic, but the approval processes for simple tooling became a bottleneck. I'd suggest more autonomy for lead roles."
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-[#00dbe9]/5 text-[#00dbe9] text-[10px] font-bold rounded uppercase tracking-wider border border-[#00dbe9]/10">Growth</span>
                  <span className="px-2 py-0.5 bg-[#00dbe9]/5 text-[#00dbe9] text-[10px] font-bold rounded uppercase tracking-wider border border-[#00dbe9]/10">Process</span>
                </div>
              </div>

              {/* Feedback Card 2 */}
              <div className="p-4 rounded-xl bg-[#1f1f24] border border-[#3b494b]/30">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00dbe9] flex items-center justify-center text-[#00dbe9] font-bold text-sm">
                      JP
                    </div>
                    <div>
                      <p className="font-bold text-[#e4e1e9]">James Peterson</p>
                      <p className="text-xs font-medium text-[#b9cacb]">Backend Engineer • 1.8 Years</p>
                    </div>
                  </div>
                  <div className="flex text-[#00dbe9]">
                    {[1, 2, 3].map(i => <Icon key={i} className="text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</Icon>)}
                    {[4, 5].map(i => <Icon key={i} className="text-[18px]">star</Icon>)}
                  </div>
                </div>
                <p className="text-sm text-[#b9cacb] italic leading-relaxed mb-3">
                  "Compensation was competitive, but the remote policy felt a bit restrictive compared to other tech firms in the region."
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-[#00dbe9]/5 text-[#00dbe9] text-[10px] font-bold rounded uppercase tracking-wider border border-[#00dbe9]/10">WLB</span>
                  <span className="px-2 py-0.5 bg-[#00dbe9]/5 text-[#00dbe9] text-[10px] font-bold rounded uppercase tracking-wider border border-[#00dbe9]/10">Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reschedule History Logs */}
          {pastRequests.length > 0 && (
            <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#b9cacb] mb-4">Reschedule Logs</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {pastRequests.map((req) => {
                  const resignation = resignations?.find(r => r.id === req.resignation);
                  const name = resignation ? resignation.name : 'Unknown';
                  const isApproved = req.status === 'Approved';

                  return (
                    <div key={req.id} className="p-3 rounded-lg bg-[#2a292f] border border-[#3b494b]/50 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#e4e1e9]">{name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          isApproved
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-[#ffb4ab] border border-red-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[#b9cacb]">Requested: {req.requested_date}</p>
                      {!isApproved && req.rejection_reason && (
                        <p className="text-[#ffb4ab] mt-1 italic">"Rejected: {req.rejection_reason}"</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Content */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Specific Employee Summary Card */}
          <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="h-24 bg-[#00dbe9] relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:10px_10px]"></div>
            </div>
            <div className="px-6 pb-6 -mt-12 relative">
              <div className="relative inline-block">
                <img alt="Marcus Thorne" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSlRDOJs7n6RAa_FB0jqO5CVsqwsd7flvI5axnKv10zEPJKBBEgWp02D7no40HBUim19f9kxZOQKmnjviAnDrprXx2f6ocuQSkbN50C1ua2XVpZYB8Xj9T5u5RB7AdyDvbxeylSJyal6-TR4muN2JDIQRBU7LMne_4Z3zXmqMINUz6hRXD6-kaS5T5YPpeOxOUGGgbaoM4QlI52VpuTO7CzGxqyO9ENNwIatIwGHTvPqdnXw8UVfLTZrV3PPoExqRXLGJBHYT7Ytr3" />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-[#ffb4ab] border-2 border-white rounded-full"></span>
              </div>
              <div className="mt-4">
                <h4 className="text-xl font-semibold text-[#00dbe9]">Marcus Thorne</h4>
                <p className="text-sm text-[#b9cacb] font-medium">Senior Marketing Lead</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-[#3b494b]/30 pt-6">
                <div>
                  <p className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest mb-1">Tenure</p>
                  <p className="text-base font-bold text-[#e4e1e9]">5 Years, 4 Mos</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest mb-1">Last Day</p>
                  <p className="text-base font-bold text-[#ffb4ab]">Nov 15, 2023</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest">Offboarding Progress</p>
                  <span className="text-xs font-bold text-[#00dbe9]">65%</span>
                </div>
                <div className="w-full bg-[#eeedf5] rounded-full h-2">
                  <div className="bg-[#00dbe9] h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Jitsi Meeting Scheduler */}
          <div className="bg-[#00dbe9] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-6 text-white border-none">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="text-[#00dbe9]">videocam</Icon>
              <h3 className="text-xl font-semibold">Schedule Final Meeting</h3>
            </div>
            <p className="text-sm text-[#00dbe9] mb-6 leading-relaxed">
              Conduct a secure, one-on-one video discussion with Marcus Thorne to finalize documentation.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Date</label>
                  <input className="w-full bg-[#1f1f24]/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-white/30 outline-none" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Time Slot</label>
                  <select className="w-full bg-[#1f1f24]/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-white/30 outline-none appearance-none">
                    <option className="text-[#e4e1e9]">10:00 AM</option>
                    <option className="text-[#e4e1e9]">02:30 PM</option>
                    <option className="text-[#e4e1e9]">04:00 PM</option>
                  </select>
                </div>
              </div>
              <button className="w-full h-12 bg-[#1f1f24] text-[#00dbe9] font-bold rounded-lg flex items-center justify-center gap-2.5 hover:bg-[#131318] transition-all shadow-lg shadow-black/10 mt-2">
                <Icon className="text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>video_call</Icon>
                Start Jitsi Meeting
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectingRequestId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-[28px] border border-[#3b494b] bg-[#1f1f24] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setRejectingRequestId(null);
                setRejectionReason('');
              }}
              className="absolute top-5 right-5 rounded-full border border-[#3b494b] bg-[#131318] p-3 text-[#b9cacb] hover:text-[#ffb4ab] transition-colors"
            >
              <Icon>close</Icon>
            </button>

            <form onSubmit={handleRejectSubmit} className="space-y-6 text-left">
              <div>
                <h3 className="text-2xl font-bold text-[#ffb4ab]">Reject Reschedule Request</h3>
                <p className="text-sm text-[#b9cacb] mt-2">
                  Please provide a reason for declining the rescheduling request. This is mandatory.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  rows="4"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="E.g., Another conflict exists at this time slot, or standard times are required."
                  className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-4 py-3 text-sm text-[#e4e1e9] placeholder-[#b9cacb] focus:outline-none focus:border-[#ffb4ab] transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingRequestId(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 py-3 px-4 border border-[#3b494b] text-[#b9cacb] hover:bg-[#2a292f] hover:text-[#e4e1e9] font-semibold rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDecision || !rejectionReason.trim()}
                  className="flex-1 py-3 px-4 bg-[#ffb4ab] text-[#131318] font-bold rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-[0_0_15px_rgba(255,180,171,0.3)]"
                >
                  {submittingDecision ? 'Submitting...' : 'Reject Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
