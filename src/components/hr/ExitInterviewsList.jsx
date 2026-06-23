import { useState, useEffect } from 'react';
import Icon from '../Icon';
import {
  fetchExitInterviews,
  fetchLatestExitInterview,
  fetchExitAnalytics,
  fetchMeetings,
  fetchEmployees,
  createMeeting,
  updateMeeting,
  deleteMeeting
} from '../../api';

const defaultImages = {
  'employee@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM',
  'davood@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx00e0JA3DjVmVcgIHzfND6gfG4t4cu97HdNYF7ZOVvVstX20sxZHtLzlpKnfYiBsXIjB4uU3VfhdG65Rt6I8WYGRD7F0FnHPXxJwfepy26l7wqbWetRZxfW9ohMZgkOIdJRgZ0sglqWH7M_Qc2o9PfXmWLGoEBth14r4gViMPyoB26k3mNvyyNFBi5POm_bzbEylNrQ-YZ47Uj7X4Qbb6RvxgsLjTzbmbBtKWrU1HyIjx9uxB4H2O52VjuFe9KY38t-Tsw2xPcDnw',
  'amal@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM'
};

const getAvatarUrl = (email) => {
  return defaultImages[email] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM';
};

const exitReasonColors = {
  'Better Career Growth': 'bg-[#00dbe9]',
  'Career Growth': 'bg-[#00dbe9]',
  'Compensation': 'bg-[#00dbe9]',
  'Work-Life Balance': 'bg-[#505f76]',
  'Relocation': 'bg-[#b9cacb]',
  'Other': 'bg-[#3b494b]'
};

const getReasonColor = (reason) => {
  return exitReasonColors[reason] || 'bg-[#505f76]';
};

export default function ExitInterviewsList() {
  const [exitInterviews, setExitInterviews] = useState([]);
  const [latestInterview, setLatestInterview] = useState(null);
  const [analytics, setAnalytics] = useState({ totalExits: 0, reasons: [] });
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Meeting form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [meetingEmployeeId, setMeetingEmployeeId] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('10:00 AM');
  const [meetingJitsiUrl, setMeetingJitsiUrl] = useState('https://meet.jit.si/');
  
  const [meetingError, setMeetingError] = useState(null);
  const [meetingSuccess, setMeetingSuccess] = useState(null);
  const [meetingSubmitting, setMeetingSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [interviewsData, latestData, analyticsData, meetingsData, employeesData] = await Promise.all([
        fetchExitInterviews({ search, reason: selectedReason, department: selectedDept }),
        fetchLatestExitInterview(),
        fetchExitAnalytics(),
        fetchMeetings(),
        fetchEmployees()
      ]);
      setExitInterviews(interviewsData || []);
      setLatestInterview(latestData && latestData.id ? latestData : null);
      setAnalytics(analyticsData || { totalExits: 0, reasons: [] });
      setMeetings(meetingsData || []);
      setEmployees(employeesData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch exit interview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedReason, selectedDept]);

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    if (!meetingEmployeeId) {
      setMeetingError('Please select an employee.');
      return;
    }
    const trimmedUrl = meetingJitsiUrl.trim();
    if (!trimmedUrl.startsWith('https://meet.jit.si/') && !trimmedUrl.startsWith('https://')) {
      setMeetingError("Jitsi URL must start with 'https://meet.jit.si/' or 'https://'");
      return;
    }

    setMeetingSubmitting(true);
    setMeetingError(null);
    setMeetingSuccess(null);

    const payload = {
      employeeId: parseInt(meetingEmployeeId),
      date: meetingDate,
      timeSlot: meetingTime,
      jitsiUrl: trimmedUrl
    };

    try {
      if (editingId) {
        await updateMeeting(editingId, payload);
        setMeetingSuccess('Meeting updated successfully!');
      } else {
        await createMeeting(payload);
        setMeetingSuccess('Meeting scheduled successfully!');
      }
      // Reset form
      setMeetingEmployeeId('');
      setMeetingDate(new Date().toISOString().split('T')[0]);
      setMeetingTime('10:00 AM');
      setMeetingJitsiUrl('https://meet.jit.si/');
      setEditingId(null);
      setShowForm(false);
      // Refresh
      const meetingsData = await fetchMeetings();
      setMeetings(meetingsData || []);
    } catch (err) {
      setMeetingError(err.message || 'Failed to save meeting schedule');
    } finally {
      setMeetingSubmitting(false);
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditingId(meeting.id);
    setMeetingEmployeeId(meeting.employeeId.toString());
    setMeetingDate(meeting.date);
    setMeetingTime(meeting.timeSlot);
    setMeetingJitsiUrl(meeting.jitsiUrl);
    setMeetingError(null);
    setMeetingSuccess(null);
    setShowForm(true);
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;
    try {
      await deleteMeeting(id);
      const meetingsData = await fetchMeetings();
      setMeetings(meetingsData || []);
    } catch (err) {
      alert(err.message || 'Failed to delete meeting');
    }
  };

  if (loading && exitInterviews.length === 0) {
    return (
      <div className="pt-32 pb-16 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="animate-spin material-symbols-outlined text-[48px] text-[#00dbe9]">progress_activity</span>
        <p className="text-[#b9cacb] text-sm">Fetching exit data...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 text-[#e4e1e9]">
      {/* Breadcrumbs */}
      <nav className="flex text-xs font-medium text-[#b9cacb] gap-2 items-center mb-6">
        <span className="hover:text-[#00dbe9] cursor-pointer transition-colors">Resignations</span>
        <Icon className="text-[16px]">chevron_right</Icon>
        <span className="text-[#00dbe9] font-semibold">Exit Interview</span>
      </nav>

      {error && (
        <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
          <Icon className="text-rose-400">error</Icon>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Stats & List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Analytics Dashboard */}
          <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#00dbe9]">Primary Exit Reasons</h3>
                <div className="bg-[#131318] border border-[#3b494b] rounded px-3 py-1 text-[11px] font-bold text-[#b9cacb] uppercase tracking-wider">
                  Real-time Database Stats
                </div>
              </div>
              <div className="space-y-4">
                {analytics.reasons.length === 0 ? (
                  <p className="text-sm text-[#b9cacb] italic">No exit reasons logged yet.</p>
                ) : (
                  analytics.reasons.map((reason, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#b9cacb]">{reason.label}</span>
                        <span className="font-bold text-[#e4e1e9]">{reason.pct} ({reason.count})</span>
                      </div>
                      <div className="w-full bg-[#131318] rounded-full h-2">
                        <div className={`${getReasonColor(reason.label)} h-2 rounded-full`} style={{ width: reason.pct }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="w-full md:w-64 flex items-center justify-center relative min-h-[160px]">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle className="text-[#131318]" cx="96" cy="96" fill="transparent" r="70" stroke="currentColor" strokeWidth="20"></circle>
                <circle className="text-[#00dbe9]" cx="96" cy="96" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={440 - (440 * (analytics.totalExits > 0 ? 1 : 0))} strokeWidth="20"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#00dbe9]">{analytics.totalExits}</span>
                <span className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest">Total Exits</span>
              </div>
            </div>
          </div>

          {/* Feedback Repository & Controls */}
          <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3b494b]/30 pb-4">
              <h3 className="text-xl font-semibold text-[#00dbe9]">Exit Feedback Repository</h3>
              
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Search by name, reason..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#00dbe9] text-[#e4e1e9]"
                />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#00dbe9] text-[#e4e1e9]"
                >
                  <option value="">All Departments</option>
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {exitInterviews.length === 0 ? (
                <div className="p-8 text-center text-[#b9cacb] italic border border-dashed border-[#3b494b]/30 rounded-xl bg-[#131318]/20">
                  No matching exit interviews found in database.
                </div>
              ) : (
                exitInterviews.map((interview) => {
                  const initials = interview.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  const feedbackText = interview.exitFeedback?.additional_feedback || interview.comments || "No comments provided.";
                  const reason = interview.exitFeedback?.reason || interview.reason || "N/A";
                  
                  return (
                    <div key={interview.id} className="p-4 rounded-xl bg-[#131318]/40 border border-[#3b494b]/30 hover:border-[#00dbe9]/30 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#00dbe9]/10 border border-[#00dbe9]/20 flex items-center justify-center text-[#00dbe9] font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#e4e1e9]">{interview.name}</p>
                            <p className="text-xs font-medium text-[#b9cacb]">{interview.department} • Relieved: {interview.relievingDate || 'N/A'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          interview.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#b9cacb] italic leading-relaxed mb-3">
                        "{feedbackText}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-[#00dbe9]/5 text-[#00dbe9] text-[10px] font-bold rounded uppercase tracking-wider border border-[#00dbe9]/10">
                          {reason}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Latest & Meetings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Latest Exit Interview Card */}
          <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl shadow-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#00dbe9] border-b border-[#3b494b]/30 pb-2 mb-2 flex items-center gap-2">
              <Icon className="text-[#00dbe9]">portrait</Icon>
              Latest Exit Interview
            </h3>
            {latestInterview ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    alt={latestInterview.employeeName}
                    className="w-16 h-16 rounded-xl object-cover border border-[#3b494b]"
                    src={getAvatarUrl(latestInterview.email)}
                  />
                  <div>
                    <h4 className="text-base font-bold text-[#e4e1e9]">{latestInterview.employeeName}</h4>
                    <p className="text-xs text-[#b9cacb]">{latestInterview.designation}</p>
                    <p className="text-[10px] text-[#b9cacb]/80">ID: {latestInterview.employeeId || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-[#3b494b]/30 pt-4">
                  <div>
                    <p className="text-[9px] font-bold text-[#b9cacb] uppercase tracking-widest mb-0.5">Exit Date</p>
                    <p className="text-xs font-bold text-[#ffb4ab]">{latestInterview.exitDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#b9cacb] uppercase tracking-widest mb-0.5">Exit Status</p>
                    <span className="px-2 py-0.5 bg-[#00dbe9]/10 text-[#00dbe9] text-[9px] uppercase font-bold rounded">
                      {latestInterview.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#b9cacb] uppercase tracking-widest">Primary Reason</p>
                  <p className="text-xs font-semibold text-[#00dbe9]">{latestInterview.exitReason}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#b9cacb] uppercase tracking-widest">Comments</p>
                  <p className="text-xs text-[#b9cacb] italic bg-[#131318] p-2.5 rounded border border-[#3b494b]/30 leading-relaxed">
                    "{latestInterview.comments || latestInterview.exitFeedback?.additional_feedback || 'No comments recorded.'}"
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#b9cacb] italic">No completed exit interviews found.</p>
            )}
          </div>

          {/* Meetings Scheduler CRUD */}
          <div className="bg-[#1f1f24] border border-[#3b494b]/30 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#3b494b]/30 pb-3">
              <h3 className="text-lg font-bold text-[#00dbe9] flex items-center gap-2">
                <Icon className="text-[#00dbe9]">videocam</Icon>
                Schedule Final Meeting
              </h3>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  setMeetingEmployeeId('');
                  setMeetingDate(new Date().toISOString().split('T')[0]);
                  setMeetingTime('10:00 AM');
                  setMeetingJitsiUrl('https://meet.jit.si/');
                  setMeetingError(null);
                  setMeetingSuccess(null);
                }}
                className="p-1 hover:text-[#00dbe9] text-[#b9cacb] transition-colors"
                title="Schedule Meeting"
              >
                <Icon>{showForm ? 'close' : 'add_circle'}</Icon>
              </button>
            </div>

            {showForm ? (
              <form onSubmit={handleMeetingSubmit} className="space-y-4">
                <h4 className="text-xs font-bold text-[#00dbe9] uppercase">{editingId ? 'Edit Jitsi Meeting' : 'Schedule Jitsi Meeting'}</h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#b9cacb] uppercase block">Select Employee</label>
                  <select
                    value={meetingEmployeeId}
                    onChange={(e) => setMeetingEmployeeId(e.target.value)}
                    className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2 text-[#e4e1e9] text-sm focus:outline-none focus:border-[#00dbe9]"
                    required
                  >
                    <option value="">Choose Employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase block">Date</label>
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2 text-[#e4e1e9] text-sm focus:outline-none focus:border-[#00dbe9]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase block">Time Slot</label>
                    <select
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2 text-[#e4e1e9] text-sm focus:outline-none focus:border-[#00dbe9]"
                      required
                    >
                      <option>10:00 AM</option>
                      <option>11:30 AM</option>
                      <option>02:30 PM</option>
                      <option>04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#b9cacb] uppercase block">Jitsi URL</label>
                  <input
                    type="url"
                    value={meetingJitsiUrl}
                    onChange={(e) => setMeetingJitsiUrl(e.target.value)}
                    placeholder="https://meet.jit.si/custom-room"
                    className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2 text-[#e4e1e9] text-sm focus:outline-none focus:border-[#00dbe9]"
                    required
                  />
                </div>

                {meetingError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                    {meetingError}
                  </div>
                )}
                {meetingSuccess && (
                  <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                    {meetingSuccess}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={meetingSubmitting}
                    className="flex-1 py-2 bg-[#00dbe9] text-[#131318] font-bold rounded-lg text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Icon className="text-[18px]">event_available</Icon>
                    {editingId ? 'Save' : 'Schedule'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-[#2a292f] border border-[#3b494b] text-[#e4e1e9] font-bold rounded-lg text-sm hover:bg-[#323138] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#b9cacb] leading-relaxed">
                  Schedule secure, one-on-one video calls to conduct offboarding Exit Interviews.
                </p>

                <div className="space-y-3">
                  {meetings.length === 0 ? (
                    <p className="text-xs text-[#b9cacb] italic text-center py-4">No meetings scheduled.</p>
                  ) : (
                    meetings.map((meeting) => (
                      <div key={meeting.id} className="p-3 bg-[#131318]/50 border border-[#3b494b]/40 rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-[#e4e1e9]">{meeting.employeeName}</h4>
                            <p className="text-[10px] text-[#b9cacb]">{meeting.date} at {meeting.timeSlot}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditMeeting(meeting)}
                              className="text-[#b9cacb] hover:text-[#00dbe9] p-0.5 transition-colors"
                              title="Edit"
                            >
                              <Icon className="text-[16px]">edit</Icon>
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(meeting.id)}
                              className="text-[#b9cacb] hover:text-[#ffb4ab] p-0.5 transition-colors"
                              title="Cancel"
                            >
                              <Icon className="text-[16px]">delete</Icon>
                            </button>
                          </div>
                        </div>

                        {meeting.jitsiUrl && (
                          <a
                            href={meeting.jitsiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 bg-[#00dbe9]/10 hover:bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/20 font-bold rounded-md text-[11px] flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Icon className="text-[14px]">video_call</Icon>
                            Join Meeting
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-2.5 bg-[#00dbe9] text-[#131318] font-bold rounded-lg text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
                >
                  <Icon className="text-[18px]">add</Icon>
                  Schedule New Meeting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
