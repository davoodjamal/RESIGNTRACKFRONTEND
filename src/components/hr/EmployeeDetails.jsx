import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchEmployeeById } from '../../api';

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

export default function EmployeeDetails({ employeeId, onBack }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

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
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Department</label>
                <p className="text-sm font-medium">{employee.department}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Direct Manager</label>
                <p className="text-sm font-medium">{employee.manager}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Employee Type</label>
                <p className="text-sm font-medium">{employee.employeeType}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[#b9cacb] block uppercase mb-1">Office Address</label>
                <p className="text-sm font-medium">{employee.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Resignation Summary (Resigned Status only) */}
          {employee.status === 'Resigned' && (
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

          {/* Exit Interview Feedback (Resigned or In-Notice only) */}
          {employee.status !== 'Active' && employee.exitInterview && (
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

                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#b9cacb] block uppercase">Remarks & Reason</span>
                  <p className="text-sm bg-[#131318] p-4 rounded-lg border border-[#3b494b] italic text-[#b9cacb]">
                    "{employee.exitInterview.feedback}"
                  </p>
                </div>

                {employee.exitInterview.qa && employee.exitInterview.qa.length > 0 && (
                  <div className="space-y-4 border-t border-[#3b494b]/20 pt-4">
                    <span className="text-xs font-bold text-[#b9cacb] block uppercase">Responses</span>
                    {employee.exitInterview.qa.map((qa, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-xs text-[#00dbe9] font-semibold">{qa.question}</p>
                        <p className="text-sm font-medium">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


        </div>

        {/* Right Column (Span 4 - Hidden for Resigned employees since they have no assets, checklist, or documents) */}
        {employee.status !== 'Resigned' && (
          <div className="col-span-12 lg:col-span-4 space-y-6">
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
                <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                  <Icon className="text-[#00dbe9]">checklist</Icon>
                  Exit Checklist
                </h3>
                <div className="space-y-3">
                  {employee.tasks.map((task, idx) => (
                    <div key={idx} className="p-3 bg-[#131318] rounded-lg border border-[#3b494b] flex justify-between items-center">
                      <span className="text-sm font-semibold">{task.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${task.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Remarks (In-Notice only) */}
            {employee.status === 'In-Notice' && (
              <div className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50">
                <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-3 mb-4 flex items-center gap-2">
                  <Icon className="text-[#00dbe9]">notes</Icon>
                  HR Remarks
                </h3>
                <p className="text-sm text-[#b9cacb] italic">
                  {employee.remarks || 'No official HR remarks recorded.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
