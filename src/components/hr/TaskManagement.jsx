import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { 
  fetchUsers, 
  fetchResignations, 
  fetchResignationChecklistTasksForHR, 
  updateChecklistTaskStatus 
} from '../../api';

const defaultImages = {
  'employee@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM',
  'davood@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx00e0JA3DjVmVcgIHzfND6gfG4t4cu97HdNYF7ZOVvVstX20sxZHtLzlpKnfYiBsXIjB4uU3VfhdG65Rt6I8WYGRD7F0FnHPXxJwfepy26l7wqbWetRZxfW9ohMZgkOIdJRgZ0sglqWH7M_Qc2o9PfXmWLGoEBth14r4gViMPyoB26k3mNvyyNFBi5POm_bzbEylNrQ-YZ47Uj7X4Qbb6RvxgsLjTzbmbBtKWrU1HyIjx9uxB4H2O52VjuFe9KY38t-Tsw2xPcDnw',
  'amal@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM'
};

const getAvatarUrl = (email) => {
  return defaultImages[email] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM';
};

export default function TaskManagement() {
  const [employees, setEmployees] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Checklist state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [checklistTasks, setChecklistTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskCounts, setTaskCounts] = useState({}); // { resignationId: { completed: X, total: Y } }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [empData, resData] = await Promise.all([
          fetchUsers({ role: 'employee', status: 'In-Notice' }),
          fetchResignations()
        ]);
        setEmployees(empData);
        setResignations(resData);

        // Fetch checklist tasks count for each resignation
        const counts = {};
        await Promise.all(
          resData.map(async (res) => {
            try {
              const tasks = await fetchResignationChecklistTasksForHR(res.id);
              const completed = tasks.filter(t => t.status === 'Completed').length;
              counts[res.id] = { completed, total: tasks.length };
            } catch (e) {
              console.error(e);
            }
          })
        );
        setTaskCounts(counts);
      } catch (err) {
        console.error('Failed to load tasks data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const res = resignations.find(r => r.email === selectedEmployee.email);
      if (res) {
        setLoadingTasks(true);
        fetchResignationChecklistTasksForHR(res.id)
          .then(data => {
            setChecklistTasks(data);
          })
          .catch(console.error)
          .finally(() => setLoadingTasks(false));
      } else {
        setChecklistTasks([]);
      }
    }
  }, [selectedEmployee, resignations]);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const updatedTask = await updateChecklistTaskStatus(taskId, newStatus);
      setChecklistTasks(prev => {
        const next = prev.map(t => t.id === taskId ? updatedTask : t);
        const res = resignations.find(r => r.email === selectedEmployee.email);
        if (res) {
          const completed = next.filter(t => t.status === 'Completed').length;
          setTaskCounts(prevCounts => ({
            ...prevCounts,
            [res.id]: { completed, total: next.length }
          }));
        }
        return next;
      });
    } catch (err) {
      alert(err.message || 'Failed to update task status');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-[#33fb0a]/10 text-[#33fb0a] border border-[#33fb0a]/20';
      case 'scheduled': return 'bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/20';
      case 'pending': return 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20';
      default: return 'bg-[#b9cacb]/10 text-[#b9cacb] border border-[#b9cacb]/20';
    }
  };

  return (
    <div className="pt-24 px-8 pb-12 space-y-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 text-[#e4e1e9]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#e4e1e9]">Tasks</h1>
          <p className="text-[#b9cacb] text-sm mt-1">Manage employee-specific exit checklists</p>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-[#00dbe9] bg-[#00dbe9]/10 border border-[#00dbe9]/20 px-4 py-1.5 rounded-full font-bold uppercase">
            {employees.length} Employees In Notice
          </span>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="animate-spin material-symbols-outlined text-[48px] text-[#00dbe9]">progress_activity</span>
          <p className="text-[#b9cacb] text-sm">Loading checklists...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-[#1f1f24] rounded-2xl border border-dashed border-[#3b494b]/50 p-16 text-center">
          <Icon className="text-[#b9cacb] text-5xl mx-auto mb-3 opacity-50">fact_check</Icon>
          <p className="text-[#b9cacb] font-medium">No employees currently in notice period.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(emp => {
            const avatar = getAvatarUrl(emp.email);
            const name = emp.fullName || emp.username;
            const designation = emp.designation || 'Employee';
            const res = resignations.find(r => r.email === emp.email);
            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="bg-[#1f1f24] border border-[#3b494b] hover:border-[#00dbe9]/40 hover:-translate-y-0.5 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col gap-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img className="w-14 h-14 rounded-full object-cover border border-[#3b494b]/30" alt={name} src={avatar} />
                  <div>
                    <h3 className="text-lg font-bold text-[#e4e1e9]">{name}</h3>
                    <p className="text-sm text-[#b9cacb]">{designation}</p>
                    {res && taskCounts[res.id] && (
                      <p className="text-xs text-[#00dbe9] mt-1 font-semibold">
                        {taskCounts[res.id].completed} of {taskCounts[res.id].total} Tasks Completed
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-[#3b494b]/30 pt-4 mt-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider font-bold">
                    Status: In Notice
                  </span>
                  <span className="text-xs font-bold text-[#00dbe9] hover:underline flex items-center gap-1">
                    Manage Checklist <Icon className="text-sm">arrow_forward</Icon>
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Exit Checklist Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131318]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1f1f24] rounded-2xl border border-[#3b494b] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#3b494b] flex justify-between items-center bg-[#2a292f]">
              <div>
                <h2 className="text-xl font-bold text-[#e4e1e9]">Exit Checklist</h2>
                <p className="text-xs text-[#b9cacb] mt-1">{selectedEmployee.fullName || selectedEmployee.username} • {selectedEmployee.designation || 'Employee'}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/20 px-3 py-1.5 rounded-full">
                  {checklistTasks.filter(t => t.status === 'Completed').length} of {checklistTasks.length} Completed
                </span>
                <button onClick={() => setSelectedEmployee(null)} className="text-[#b9cacb] hover:text-[#ffb4ab] transition-colors">
                  <Icon>close</Icon>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {loadingTasks ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <span className="animate-spin material-symbols-outlined text-[36px] text-[#00dbe9]">progress_activity</span>
                  <p className="text-xs text-[#b9cacb]">Loading checklist tasks...</p>
                </div>
              ) : checklistTasks.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Icon className="text-4xl text-[#ffb4ab]/80">warning</Icon>
                  <p className="text-sm text-[#b9cacb]">No checklist tasks generated for this employee yet.</p>
                </div>
              ) : (
                checklistTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#2a292f]/40 border border-[#3b494b]/30">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Icon className={task.status === 'Completed' ? 'text-[#33fb0a]' : task.status === 'Scheduled' ? 'text-[#00dbe9]' : 'text-[#ffb4ab]'}>
                          {task.status === 'Completed' ? 'check_circle' : task.status === 'Scheduled' ? 'schedule' : 'pending_actions'}
                        </Icon>
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${task.status === 'Completed' ? 'line-through text-[#b9cacb]' : 'text-[#e4e1e9]'}`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#b9cacb] mt-1">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                        className={`border border-[#3b494b] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#00dbe9] font-bold ${getStatusColor(task.status)} bg-[#131318]`}
                      >
                        <option value="Pending" className="bg-[#1f1f24] text-[#ffb4ab]">PENDING</option>
                        <option value="Scheduled" className="bg-[#1f1f24] text-[#00dbe9]">SCHEDULED</option>
                        <option value="Completed" className="bg-[#1f1f24] text-[#33fb0a]">COMPLETED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
