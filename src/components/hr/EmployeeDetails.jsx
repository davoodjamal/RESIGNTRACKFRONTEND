import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchEmployeeById, processResignation } from '../../api';

const defaultImages = {
  'employee@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM',
  'davood@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx00e0JA3DjVmVcgIHzfND6gfG4t4cu97HdNYF7ZOVvVstX20sxZHtLzlpKnfYiBsXIjB4uU3VfhdG65Rt6I8WYGRD7F0FnHPXxJwfepy26l7wqbWetRZxfW9ohMZgkOIdJRgZ0sglqWH7M_Qc2o9PfXmWLGoEBth14r4gViMPyoB26k3mNvyyNFBi5POm_bzbEylNrQ-YZ47Uj7X4Qbb6RvxgsLjTzbmbBtKWrU1HyIjx9uxB4H2O52VjuFe9KY38t-Tsw2xPcDnw',
  'amal@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM'
};

const getAvatarUrl = (email) => {
  return defaultImages[email] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'In-Notice':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'Resigned':
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    default:
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
  }
};

export default function EmployeeDetails({ employeeId, onBack, setActiveTab }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const [processingRemarks, setProcessingRemarks] = useState('');
  const [processingAction, setProcessingAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleProcessResignation = async (action) => {
    setIsProcessing(true);
    setProcessingAction(action);
    try {
      const updatedEmployee = await processResignation(employeeId, action, processingRemarks);
      setEmployee(updatedEmployee);
      setProcessingRemarks('');
      setToast({ message: `Resignation status updated to: ${action === 'REQUEST_INFO' ? 'More Info Requested' : action.toLowerCase()}`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to process resignation', type: 'error' });
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  useEffect(() => {
    const loadEmployee = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmployeeById(employeeId);
        setEmployee(data);
      } catch (err) {
        setError(err.message || 'Employee not found');
      } finally {
        setLoading(false);
      }
    };
    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId, retryTrigger]);

  const handleRetry = () => {
    setRetryTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="pt-24 px-8 pb-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="animate-spin material-symbols-outlined text-[48px] text-[#00dbe9]">progress_activity</span>
        <p className="text-[#b9cacb] text-sm">Fetching employee profile...</p>
      </div>
    );
  }

  if (error || !employee) {
    const isNotFound = error && (error.includes('404') || error.toLowerCase().includes('not found'));

    return (
      <div className="pt-24 px-8 pb-12 max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#b9cacb] hover:text-[#00dbe9] transition-colors mb-6 text-sm font-medium"
        >
          <Icon>arrow_back</Icon>
          Back to Directory
        </button>
        <div className="flex flex-col items-center justify-center py-24 gap-6 border border-[#3b494b]/30 rounded-xl bg-[#1e1e24]/40">
          <span className="material-symbols-outlined text-[64px] text-[#ffb4ab]">
            {isNotFound ? 'person_off' : 'cloud_off'}
          </span>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#e4e1e9]">
              {isNotFound ? 'Employee Not Found' : 'Failed to Load Profile'}
            </h3>
            <p className="text-[#b9cacb] text-sm max-w-md mx-auto px-4">
              {isNotFound
                ? "The employee you requested does not exist in the system. Please verify the ID and try again."
                : `We encountered an issue communicating with the server: ${error}`}
            </p>
          </div>
          <div className="flex gap-4">
            {!isNotFound && (
              <button
                onClick={handleRetry}
                className="px-5 py-2.5 bg-[#00dbe9] text-[#131318] rounded-lg text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-[#00dbe9]/20"
              >
                <Icon className="text-[18px]">refresh</Icon>
                Retry Request
              </button>
            )}
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-[#2a292f] border border-[#3b494b] text-[#e4e1e9] rounded-lg text-sm font-bold hover:bg-[#323138] transition-all flex items-center gap-2"
            >
              <Icon className="text-[18px]">directory_sync</Icon>
              Return to Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const name = employee.name;
  const designation = employee.designation;
  const avatar = getAvatarUrl(employee.email);
  const statusColor = getStatusColor(employee.status);

  return (
    <div className="pt-24 pb-12 px-8 space-y-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 text-[#e4e1e9]">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-4 flex items-center gap-2 ${
          toast.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          <Icon>{toast.type === 'success' ? 'check_circle' : 'error'}</Icon>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#b9cacb] hover:text-[#00dbe9] transition-colors text-sm font-medium"
        >
          <Icon>arrow_back</Icon>
          Back to Directory
        </button>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColor}`}>
          {employee.status}
        </span>
      </div>

      {/* Header Info */}
      <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            className="w-20 h-20 rounded-full object-cover border border-[#3b494b]/50"
            alt={name}
            src={avatar}
          />
          <div>
            <h2 className="text-2xl font-bold text-[#e4e1e9]">{name}</h2>
            <p className="text-base text-[#b9cacb]">{designation}</p>
          </div>
          {employee.isEmergencyRequested && (
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ffb4ab] text-[#5c1e1a] flex items-center gap-2 ml-4">
              <Icon className="text-[16px]">warning</Icon>
              EMERGENCY REQUESTED
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border-l-0 md:border-l border-[#3b494b]/30 pl-0 md:pl-8">
          <div>
            <span className="text-xs text-[#b9cacb] block">Location</span>
            <span className="font-semibold">{employee.workLocation}</span>
          </div>
          <div>
            <span className="text-xs text-[#b9cacb] block">Joining Date</span>
            <span className="font-semibold">{employee.joinDate || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (Span 12 for Resigned, Span 8 otherwise) */}
        <div className={employee.status === 'Resigned' ? 'col-span-12 space-y-6' : 'col-span-12 lg:col-span-8 space-y-6'}>
          {/* Employee Details Card */}
          <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50">
            <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
              <Icon className="text-[#00dbe9]">badge</Icon>
              Employee Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Email Address</label>
                <p className="text-sm font-medium">{employee.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Phone Number</label>
                <p className="text-sm font-medium">{employee.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Date of Birth</label>
                <p className="text-sm font-medium">{employee.dob || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Designation</label>
                <p className="text-sm font-medium">{employee.designation || employee.department}</p>
              </div>
            </div>
          </div>

          {/* Resignation Summary (Resigned Status only) */}
          {employee.status === 'Resigned' && (
            <div className="space-y-6">
              <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50">
                <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                  <Icon className="text-[#00dbe9]">exit_to_app</Icon>
                  Resignation Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-xs text-[#b9cacb] block mb-1">Joined Date</span>
                    <span className="text-sm font-semibold">{employee.joinDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#b9cacb] block mb-1">Resigned Date</span>
                    <span className="text-sm font-semibold text-[#ffb4ab]">{employee.resignedDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#b9cacb] block mb-1">Primary Reason</span>
                    <span className="text-sm font-semibold">{employee.reason || employee.primaryReason || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {employee.initialResignation && (
                <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50 space-y-4">
                  <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                    <Icon className="text-[#00dbe9]">description</Icon>
                    Initial Resignation Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Reason for Leaving</label>
                        <p className="text-sm font-semibold text-[#e4e1e9]">{employee.initialResignation.reason || 'N/A'}</p>
                      </div>

                      {employee.initialResignation.elaboration && (
                        <div>
                          <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Elaboration</label>
                          <p className="text-sm text-[#b9cacb] bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30 italic">
                            {employee.initialResignation.elaboration}
                          </p>
                        </div>
                      )}

                      {employee.initialResignation.hrRemarks && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          <div className="flex items-start gap-2">
                            <Icon className="text-[18px] mt-0.5">info</Icon>
                            <div>
                              <label className="text-xs font-bold block uppercase mb-1">HR Clarification Remark</label>
                              <p className="text-sm text-[#b9cacb] leading-relaxed">
                                {employee.initialResignation.hrRemarks}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30">
                        <span className="text-xs font-bold text-[#b9cacb] uppercase">Emergency Immediate Release</span>
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          employee.initialResignation.immediateRelease
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                          {employee.initialResignation.immediateRelease ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {employee.initialResignation.immediateRelease && (
                        <>
                          {employee.initialResignation.emergencyReason && (
                            <div>
                              <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Emergency Reason</label>
                              <p className="text-sm font-semibold text-[#ffb4ab]">{employee.initialResignation.emergencyReason}</p>
                            </div>
                          )}
                          {employee.initialResignation.emergencyRemarks && (
                            <div>
                              <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Remarks</label>
                              <p className="text-sm text-[#b9cacb] bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30 italic">
                                {employee.initialResignation.emergencyRemarks}
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      <div>
                        <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Proposed Last Working Day</label>
                        <p className="text-sm font-semibold text-[#00dbe9]">{employee.initialResignation.proposedLastWorkingDay || 'N/A'}</p>
                      </div>

                      {employee.initialResignation.additionalFeedback && (
                        <div>
                          <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Additional Feedback</label>
                          <p className="text-sm text-[#b9cacb] bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30">
                            {employee.initialResignation.additionalFeedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notice Period Details (In-Notice only) */}
          {employee.status === 'In-Notice' && employee.noticePeriod && (
            <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50">
              <div className="flex justify-between items-center border-b border-[#3b494b]/30 pb-3 mb-4">
                <h3 className="text-lg font-bold text-[#00dbe9] flex items-center gap-2">
                  <Icon className="text-[#00dbe9]">schedule</Icon>
                  Notice Period Details
                </h3>
                <span className="px-2.5 py-0.5 bg-[#00dbe9]/10 text-[#00dbe9] text-[10px] uppercase font-bold rounded border border-[#00dbe9]/20">
                  {employee.noticePeriod.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-xs text-[#b9cacb] block mb-1">Start Date</span>
                  <span className="text-sm font-semibold">{employee.noticePeriod.startDate}</span>
                </div>
                <div>
                  <span className="text-xs text-[#b9cacb] block mb-1">End Date</span>
                  <span className="text-sm font-semibold text-[#ffb4ab]">{employee.noticePeriod.endDate}</span>
                </div>
                <div>
                  <span className="text-xs text-[#b9cacb] block mb-1">Required Days</span>
                  <span className="text-sm font-semibold">{employee.noticePeriod.requiredDays}</span>
                </div>
                <div>
                  <span className="text-xs text-[#b9cacb] block mb-1">Served Days</span>
                  <span className="text-sm font-semibold">{employee.noticePeriod.servedDays}</span>
                </div>
                <div>
                  <span className="text-xs text-[#b9cacb] block mb-1">Waiver Applied</span>
                  <span className="text-sm font-semibold">{employee.noticePeriod.waiver ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-xs text-[#b9cacb] block mb-1">Remaining Days</span>
                  <span className="text-sm font-bold text-[#00dbe9]">{employee.noticePeriod.remainingDays}</span>
                </div>
              </div>
            </div>
          )}

          {/* Exit Interview Feedback & Resignation Processing (Resigned or In-Notice only) */}
          {employee.status !== 'Active' && employee.exitInterview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exit Interview & Feedback Card */}
              <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50">
                <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                  <Icon className="text-[#00dbe9]">forum</Icon>
                  Exit Interview & Feedback
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#131318] p-3 rounded-lg border border-[#3b494b]">
                      <span className="text-xs text-[#b9cacb] block mb-1">Exit Rating</span>
                      <span className="text-lg font-bold text-[#00dbe9]">{employee.exitInterview.rating}/10</span>
                    </div>
                    <div className="bg-[#131318] p-3 rounded-lg border border-[#3b494b]">
                      <span className="text-xs text-[#b9cacb] block mb-1">Interview Date</span>
                      <span className="text-lg font-bold text-[#00dbe9]">{employee.exitInterview.date || 'N/A'}</span>
                    </div>
                  </div>



                  {employee.exitInterview.qa && employee.exitInterview.qa.length > 0 && (() => {
                    const half = Math.ceil(employee.exitInterview.qa.length / 2);
                    const firstCol = employee.exitInterview.qa.slice(0, half);
                    const secondCol = employee.exitInterview.qa.slice(half);
                    return (
                      <div className="space-y-4 border-t border-[#3b494b]/20 pt-4">
                        <span className="text-xs font-bold text-[#b9cacb] block uppercase">Responses</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          <div className="space-y-4">
                            {firstCol.map((qa, index) => (
                              <div key={index} className="space-y-1">
                                <p className="text-xs text-[#00dbe9] font-semibold">{qa.question}</p>
                                <p className="text-sm font-medium">{qa.answer}</p>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-4">
                            {secondCol.map((qa, index) => (
                              <div key={index} className="space-y-1">
                                <p className="text-xs text-[#00dbe9] font-semibold">{qa.question}</p>
                                <p className="text-sm font-medium">{qa.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Resignation Processing Card */}
              <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                    <Icon className="text-[#00dbe9]">gavel</Icon>
                    Resignation Status & Actions
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Status Indicator */}
                    <div className="bg-[#131318] p-3 rounded-lg border border-[#3b494b] flex justify-between items-center">
                      <span className="text-xs text-[#b9cacb] uppercase font-bold">Current Phase</span>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        employee.resignationStatus === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        employee.resignationStatus === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        employee.resignationStatus === 'More Info Requested' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {employee.resignationStatus || 'Pending'}
                      </span>
                    </div>

                    {/* Remarks Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#b9cacb] uppercase block">HR Processing Remarks</label>
                      <textarea
                        value={processingRemarks}
                        onChange={(e) => setProcessingRemarks(e.target.value)}
                        disabled={isProcessing || ['Approved', 'Rejected'].includes(employee.resignationStatus)}
                        placeholder={
                          ['Approved', 'Rejected'].includes(employee.resignationStatus)
                            ? "Resignation process finalized. Action disabled."
                            : "Enter remarks for processing, info request reason, or approval/rejection details..."
                        }
                        className="w-full h-32 bg-[#131318] text-[#e4e1e9] text-sm p-3 rounded-lg border border-[#3b494b] focus:outline-none focus:border-[#00dbe9] resize-none disabled:opacity-50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                {employee.status !== 'Resigned' && !['Approved', 'Rejected'].includes(employee.resignationStatus) && (
                  <div className="mt-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleProcessResignation('APPROVE')}
                        disabled={isProcessing || ['Approved', 'Rejected'].includes(employee.resignationStatus)}
                        className="w-full py-2.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 font-bold text-sm rounded-lg border border-green-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isProcessing && processingAction === 'APPROVE' ? (
                          <Icon className="animate-spin text-sm">sync</Icon>
                        ) : (
                          <Icon className="text-sm">check_circle</Icon>
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleProcessResignation('REJECT')}
                        disabled={isProcessing || ['Approved', 'Rejected'].includes(employee.resignationStatus)}
                        className="w-full py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold text-sm rounded-lg border border-red-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isProcessing && processingAction === 'REJECT' ? (
                          <Icon className="animate-spin text-sm">sync</Icon>
                        ) : (
                          <Icon className="text-sm">cancel</Icon>
                        )}
                        Reject
                      </button>
                    </div>
                    <button
                      onClick={() => handleProcessResignation('REQUEST_INFO')}
                      disabled={isProcessing || ['Approved', 'Rejected'].includes(employee.resignationStatus)}
                      className="w-full py-2.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-bold text-sm rounded-lg border border-amber-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isProcessing && processingAction === 'REQUEST_INFO' ? (
                        <Icon className="animate-spin text-sm">sync</Icon>
                      ) : (
                        <Icon className="text-sm">info</Icon>
                      )}
                      Request More Info
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>

        {/* Right Column (Span 4 - Hidden for Resigned employees since they have no assets, checklist, or documents) */}
        {employee.status !== 'Resigned' && (
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Initial Resignation Details */}
            {employee.initialResignation && (
              <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50 space-y-4">
                <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                  <Icon className="text-[#00dbe9]">description</Icon>
                  Initial Resignation Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Reason for Leaving</label>
                    <p className="text-sm font-semibold text-[#e4e1e9]">{employee.initialResignation.reason || 'N/A'}</p>
                  </div>

                  {employee.initialResignation.elaboration && (
                    <div>
                      <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Elaboration</label>
                      <p className="text-sm text-[#b9cacb] bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30 italic">
                        {employee.initialResignation.elaboration}
                      </p>
                    </div>
                  )}

                  {employee.initialResignation.hrRemarks && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <div className="flex items-start gap-2">
                        <Icon className="text-[18px] mt-0.5">info</Icon>
                        <div>
                          <label className="text-xs font-bold block uppercase mb-1">HR Clarification Remark</label>
                          <p className="text-sm text-[#b9cacb] leading-relaxed">
                            {employee.initialResignation.hrRemarks}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30">
                    <span className="text-xs font-bold text-[#b9cacb] uppercase">Emergency Immediate Release</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      employee.initialResignation.immediateRelease
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {employee.initialResignation.immediateRelease ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {employee.initialResignation.immediateRelease && (
                    <>
                      {employee.initialResignation.emergencyReason && (
                        <div>
                          <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Emergency Reason</label>
                          <p className="text-sm font-semibold text-[#ffb4ab]">{employee.initialResignation.emergencyReason}</p>
                        </div>
                      )}
                      {employee.initialResignation.emergencyRemarks && (
                        <div>
                          <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Remarks</label>
                          <p className="text-sm text-[#b9cacb] bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30 italic">
                            {employee.initialResignation.emergencyRemarks}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Proposed Last Working Day</label>
                    <p className="text-sm font-semibold text-[#00dbe9]">{employee.initialResignation.proposedLastWorkingDay || 'N/A'}</p>
                  </div>

                  {employee.initialResignation.additionalFeedback && (
                    <div>
                      <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Additional Feedback</label>
                      <p className="text-sm text-[#b9cacb] bg-[#131318] p-3 rounded-lg border border-[#3b494b]/30">
                        {employee.initialResignation.additionalFeedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assigned Assets */}
            <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50">
              <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                <Icon className="text-[#00dbe9]">inventory_2</Icon>
                Assigned Assets
              </h3>
              {employee.assets.length === 0 ? (
                <p className="text-sm text-[#b9cacb] italic">No assets assigned in inventory.</p>
              ) : (
                <div className="space-y-3">
                  {employee.assets.map((asset, index) => (
                    <div key={index} className="p-3 bg-[#131318] rounded-lg border border-[#3b494b] flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-semibold">{asset.name}</h4>
                        <p className="text-[10px] text-[#b9cacb]">SN: {asset.code}</p>
                        {asset.remarks && <p className="text-[10px] text-[#b9cacb]/80 mt-1 italic">Note: {asset.remarks}</p>}
                      </div>
                      <span className="px-2 py-0.5 bg-[#00dbe9]/15 text-[#00dbe9] text-[10px] uppercase font-bold rounded">
                        {asset.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Offboarding Tasks (In-Notice only) */}
            {employee.status === 'In-Notice' && (
              <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50">
                <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="text-[#00dbe9]">checklist</Icon>
                    Exit Checklist
                  </div>
                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('Tasks')}
                      className="text-xs text-[#00dbe9] hover:underline flex items-center gap-1 font-bold"
                    >
                      Manage Tasks <Icon className="text-sm">arrow_forward</Icon>
                    </button>
                  )}
                </h3>
                <div className="space-y-3">
                  {employee.tasks.map((task, idx) => (
                    <div key={idx} className="p-3 bg-[#131318] rounded-lg border border-[#3b494b] flex justify-between items-center">
                      <span className="text-sm font-semibold">{task.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.status.toLowerCase() === 'completed' ? 'bg-[#33fb0a]/10 text-[#33fb0a] border border-[#33fb0a]/20' : 
                        task.status.toLowerCase() === 'scheduled' ? 'bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/20' :
                        'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
