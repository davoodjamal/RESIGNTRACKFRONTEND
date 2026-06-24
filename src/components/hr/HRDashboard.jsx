import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchUsers } from '../../api';

const defaultImages = {
  'employee@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM',
  's.jenkins@proexit.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM',
  'm.thorne@proexit.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx00e0JA3DjVmVcgIHzfND6gfG4t4cu97HdNYF7ZOVvVstX20sxZHtLzlpKnfYiBsXIjB4uU3VfhdG65Rt6I8WYGRD7F0FnHPXxJwfepy26l7wqbWetRZxfW9ohMZgkOIdJRgZ0sglqWH7M_Qc2o9PfXmWLGoEBth14r4gViMPyoB26k3mNvyyNFBi5POm_bzbEylNrQ-YZ47Uj7X4Qbb6RvxgsLjTzbmbBtKWrU1HyIjx9uxB4H2O52VjuFe9KY38t-Tsw2xPcDnw',
  'h.vane@proexit.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY3sNS9BDt87YdUm4dsk8gYhqJQrY7GpUezYWUGFT3w5h4bdBIPwTA8jsm0DwHRUqDwmsMbwFzEx117GlawhMe6yyIXV9hi5iAMuF_4ys-RNc_qYoHJNwdMLuLocEspBtNgWplpj0WYZG2IzUQ3NsJZ7Tdn__UO5LnCDh_QC2vPf4zMqQYv9RrfPsEv5i44JzwjlTLYsNLUQpRQMIwVM48U-7oJGi-yYcrCdvslrl_zqurXw_atB-Ch9mSo3wgdjMJ9XYq9Hip4jdt',
  'd.chen@proexit.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWAbMTfIVBZ4KH5jccOYcL5HAooey-wtK4ZU2rgAGG0pT4yprJlnCkgfJ_QuHPgrXCREYkUqRu7BtGo3Yn9nFc9tyFz30Fg-YnrPwaZdbCvBs-wLrrrK-GY4EuZ4GKCE9qq00tlTe6TuwwXD4-Ztpz_LAJOJgkofNNqrxXcr09fCs1U4QfeB5f-IBHi5LtkTkExhrCWzt3IMy_YXqKoaPwyM2f9VvFaiBzLsVn46WYJoiAw_mNA5zL3AwJje0XzMz72-jL9YezJ4Jz',
  'a.scott@proexit.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS6zOYX9ZStGDJsHLC4nFp9A2YKazMKN4lcQ2jY-hTaB_VmhBmCAIjYC3BAAWppmNrj8xXvDm4iDoBoQLtuA6ziYc9U2md4XGQNYggeOLR4wKqOEOId9RPs-Gp1RBYaadt9n2hJBcTjNFWnKtNKhumTivzFwHhInFBBcLUf_zMQ9hn5f64t9AjO5G9kNTob8Gj3suVY7IVZxwJ1CaIE1ll31JrPST45eBTWB9l1hpr6hJ3KPUAT1ZsCQq1T_L-wAc0XNI13CokECIO',
  'davood@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx00e0JA3DjVmVcgIHzfND6gfG4t4cu97HdNYF7ZOVvVstX20sxZHtLzlpKnfYiBsXIjB4uU3VfhdG65Rt6I8WYGRD7F0FnHPXxJwfepy26l7wqbWetRZxfW9ohMZgkOIdJRgZ0sglqWH7M_Qc2o9PfXmWLGoEBth14r4gViMPyoB26k3mNvyyNFBi5POm_bzbEylNrQ-YZ47Uj7X4Qbb6RvxgsLjTzbmbBtKWrU1HyIjx9uxB4H2O52VjuFe9KY38t-Tsw2xPcDnw',
  'amal@resigntrack.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM'
};

const getAvatarUrl = (email) => {
  return defaultImages[email] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM';
};

const getResignationStatusColor = (status) => {
  const normStatus = status ? status.toLowerCase() : '';
  switch (normStatus) {
    case 'pending review':
    case 'pending':
      return 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]';
    case 'processing':
      return 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]';
    case 'completed':
    case 'approved':
      return 'bg-[#e2e3e5] text-[#383d41] border-[#d6d8db]';
    case 'escalated':
    case 'rejected':
      return 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]';
    case 'withdrawn':
    case 'withdraw':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function HRDashboard({ resignations, setActiveTab, onViewEmployee }) {
  const [employees, setEmployees] = useState([]);

  const getNoticeTrackerData = () => {
    const activeExits = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    (resignations || []).forEach(res => {
      if (res.status === 'Pending' || res.status === 'More Info Requested') {
        const relievingDate = res.relievingDate ? new Date(res.relievingDate) : null;
        if (!relievingDate) return;
        relievingDate.setHours(0,0,0,0);

        const submissionDate = res.submissionDate ? new Date(res.submissionDate) : new Date();
        submissionDate.setHours(0,0,0,0);

        const timeDiff = relievingDate.getTime() - today.getTime();
        const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        const totalDuration = Math.max(1, Math.ceil((relievingDate.getTime() - submissionDate.getTime()) / (1000 * 3600 * 24)));
        const elapsed = Math.max(0, totalDuration - daysLeft);
        const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

        const emp = employees.find(e => e.email === res.email);
        const role = emp ? (emp.designation || 'Employee') : (res.department || 'Employee');
        const empId = emp ? emp.id : null;

        let color = 'bg-[#00dbe9]';
        let textColor = 'text-[#00dbe9]';
        if (daysLeft <= 5) {
          color = 'bg-[#ffb4ab]';
          textColor = 'text-[#ffb4ab]';
        } else if (daysLeft <= 15) {
          color = 'bg-[#ffb4ab]/60';
          textColor = 'text-[#ffb4ab]/80';
        }

        activeExits.push({
          id: res.id,
          name: res.name,
          role: role,
          days: `${daysLeft} Day${daysLeft !== 1 ? 's' : ''}`,
          progress: `${progress}%`,
          color: color,
          text: textColor,
          daysVal: daysLeft,
          empId: empId
        });
      }
    });

    return activeExits.sort((a, b) => a.daysVal - b.daysVal);
  };
  const [metrics, setMetrics] = useState({
    activeCount: 0,
    inNoticeCount: 0,
    resignedCount: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const users = await fetchUsers({ role: 'employee' });
        setEmployees(users);
        let active = 0;
        let inNotice = 0;
        let resigned = 0;

        users.forEach(user => {
          if (user.status === 'Active') {
            active++;
          } else if (user.status === 'In-Notice') {
            inNotice++;
          } else if (user.status === 'Resigned') {
            resigned++;
          }
        });

        setMetrics({
          activeCount: active,
          inNoticeCount: inNotice,
          resignedCount: resigned,
          loading: false,
          error: null,
        });
      } catch (err) {
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to load metrics',
        }));
      }
    };

    loadMetrics();
  }, []);

  const sortedResignations = [...(resignations || [])].sort((a, b) => b.id - a.id);

  return (
    <div className="pt-24 px-8 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 text-[#e4e1e9]">
      {/* Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="bg-[#1f1f24] p-6 rounded-lg shadow-lg border border-[#3b494b] flex flex-col justify-between hover:border-[#00dbe9]/20 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#00dbe9]/5 rounded-lg text-[#00dbe9]">
              <Icon>groups</Icon>
            </div>
            <span className="text-[#33fb0a] text-xs font-medium flex items-center gap-1">
              <Icon className="text-sm">trending_up</Icon> +2.4%
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Total Employees</h3>
            <p className="text-[32px] font-semibold text-[#e4e1e9] mt-1 leading-none">
              {metrics.loading ? '...' : metrics.activeCount}
            </p>
          </div>
        </div>

        {/* Active Resignations */}
        <div className="bg-[#1f1f24] p-6 rounded-lg shadow-lg border border-[#3b494b] flex flex-col justify-between hover:border-[#00dbe9]/20 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#1f1f24] rounded-lg text-[#b9cacb]">
              <Icon>assignment_late</Icon>
            </div>
            <span className="text-[#ffb4ab] text-xs font-medium flex items-center gap-1">
              <Icon className="text-sm">trending_up</Icon> +12%
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Active Resignations</h3>
            <p className="text-[32px] font-semibold text-[#e4e1e9] mt-1 leading-none">
              {metrics.loading ? '...' : metrics.inNoticeCount}
            </p>
          </div>
        </div>

        {/* Completed Offboarding */}
        <div className="bg-[#1f1f24] p-6 rounded-lg shadow-lg border border-[#3b494b] flex flex-col justify-between hover:border-[#00dbe9]/20 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#33fb0a]/5 rounded-lg text-[#33fb0a]">
              <Icon>check_circle</Icon>
            </div>
            <span className="text-[#33fb0a] text-xs font-medium flex items-center gap-1">
              <Icon className="text-sm">check</Icon> Target Met
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Completed Offboarding</h3>
            <p className="text-[32px] font-semibold text-[#e4e1e9] mt-1 leading-none">
              {metrics.loading ? '...' : metrics.resignedCount}
            </p>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[480px]">
        {/* Resignation Requests (2/3 width) */}
        <div className="lg:col-span-2 bg-[#1f1f24] rounded-lg shadow-lg p-6 flex flex-col border border-[#3b494b] overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#e4e1e9]">Resignation Requests</h2>
            <p className="text-sm text-[#b9cacb]">Incoming employee resignation submissions</p>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            {sortedResignations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-12">
                <Icon className="text-[#b9cacb] text-4xl opacity-50">mail_outline</Icon>
                <p className="text-sm text-[#b9cacb] font-medium">No resignation requests submitted yet.</p>
              </div>
            ) : (
              sortedResignations.map((req) => {
                const emp = employees.find(e => e.email === req.email);
                const avatar = getAvatarUrl(req.email);
                return (
                  <div key={req.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#2a292f]/40 border border-[#3b494b]/30 hover:bg-[#2a292f]/80 transition-all">
                    <div className="flex items-center gap-4">
                      <img className="w-12 h-12 rounded-full object-cover border border-[#3b494b]/30" alt={req.name} src={avatar} />
                      <div>
                        <p className="text-sm font-semibold text-[#e4e1e9]">{req.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-[#b9cacb]">Submitted a resignation request</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getResignationStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          if (emp) {
                            onViewEmployee(emp.id);
                          } else {
                            console.error("Employee not found for email:", req.email);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/20 hover:bg-[#00dbe9] hover:text-[#131318] text-xs font-bold transition-all flex items-center gap-1"
                      >
                        View Request
                        <Icon className="text-sm">arrow_forward</Icon>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Notice Period Tracker (1/3 width) */}
        <div className="bg-[#1f1f24] rounded-lg shadow-lg p-6 flex flex-col border border-[#3b494b] overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#e4e1e9]">Notice Tracker</h2>
            <p className="text-sm text-[#b9cacb]">Active exit windows</p>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {getNoticeTrackerData().length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-12">
                <Icon className="text-[#b9cacb] text-4xl opacity-50">person_off</Icon>
                <p className="text-sm text-[#b9cacb] font-medium">No active notice periods.</p>
              </div>
            ) : (
              getNoticeTrackerData().map((employee, idx) => (
                <div
                  key={idx}
                  onClick={() => employee.empId && onViewEmployee(employee.empId)}
                  className={`flex items-center gap-4 p-2 rounded-lg hover:bg-[#2a292f]/60 transition-all ${employee.empId ? 'cursor-pointer' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#1f1f24] flex items-center justify-center text-[#b9cacb]">
                    <Icon>person</Icon>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#e4e1e9]">{employee.name}</p>
                    <p className="text-[11px] font-medium text-[#b9cacb] uppercase tracking-tight">{employee.role}</p>
                  </div>
                  <div className="text-right">
                    <p className={`${employee.text} font-semibold text-sm`}>{employee.days}</p>
                    <div className="w-12 h-1 bg-[#1f1f24] rounded-full mt-1 overflow-hidden">
                      <div className={`h-full ${employee.color}`} style={{ width: employee.progress }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setActiveTab('Directory')} className="mt-4 text-[13px] font-semibold text-[#00dbe9] flex items-center justify-center gap-2 hover:translate-x-1 transition-all h-10">
            View All Active Notices <Icon className="text-base">arrow_forward</Icon>
          </button>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </section>
    </div>
  );
}
