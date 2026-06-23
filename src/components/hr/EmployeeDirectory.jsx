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

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700';
    case 'In-Notice':
      return 'bg-amber-100 text-amber-700';
    case 'Resigned':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-green-100 text-green-700';
  }
};

const getJoinDate = (email, id) => {
  const hash = id || (email ? email.length : 12);
  const years = [2019, 2020, 2021, 2022, 2023];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = years[hash % years.length];
  const month = months[hash % months.length];
  const day = String((hash * 7) % 28 + 1).padStart(2, '0');
  return `${month} ${day}, ${year}`;
};

export default function EmployeeDirectory({ onEmployeeClick }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Active');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUsers({ role: 'employee', status: statusFilter });
        setEmployees(data);
        setCurrentPage(1); // Reset to page 1 on filter change
      } catch (err) {
        setError(err.message || 'Failed to load employees.');
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [statusFilter]);

  const handleCardClick = (emp) => {
    onEmployeeClick?.(emp.id);
  };

  const totalPages = Math.max(1, Math.ceil(employees.length / itemsPerPage));
  const displayedEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startIndex = employees.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, employees.length);

  return (
    <div className="pt-24 px-8 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-500 text-[#e4e1e9]">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-[32px] font-bold text-[#00dbe9] leading-tight">Directory</h2>
          <p className="text-base text-[#b9cacb] mt-1">Manage and monitor your workforce transition states.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#b9cacb]">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1f1f24] border-[#3b494b] rounded-lg text-sm py-2 px-4 focus:ring-[#00dbe9] focus:border-[#00dbe9] text-[#e4e1e9]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In-Notice">In-Notice</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading, Error and Grid Views */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="animate-spin material-symbols-outlined text-[48px] text-[#00dbe9]">progress_activity</span>
          <p className="text-[#b9cacb] text-sm">Fetching employees...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border border-[#3b494b]/30 rounded-xl bg-[#1e1e24]/40">
          <span className="material-symbols-outlined text-[48px] text-[#ffb4ab]">error</span>
          <p className="text-[#ffb4ab] text-sm font-semibold">{error}</p>
          <button
            onClick={() => setStatusFilter(statusFilter)}
            className="px-4 py-2 bg-[#00dbe9] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
          >
            Retry
          </button>
        </div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border border-dashed border-[#3b494b]/50 rounded-xl bg-[#1f1f24]/20">
          <span className="material-symbols-outlined text-[48px] text-[#b9cacb]/80">group_off</span>
          <p className="text-[#b9cacb] text-base font-medium">No employees found with status "{statusFilter}".</p>
        </div>
      ) : (
        <>
          {/* Bento Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedEmployees.map((emp) => {
              const name = emp.fullName || emp.username;
              const designation = emp.designation || 'Employee';
              const avatar = getAvatarUrl(emp.email);
              const joinDate = getJoinDate(emp.email, emp.id);
              const statusColor = getStatusColor(emp.status);

              return (
                <div
                  key={emp.id}
                  onClick={() => handleCardClick(emp)}
                  className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50 flex flex-col gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img className="w-14 h-14 rounded-full object-cover border border-[#3b494b]/30" alt={name} src={avatar} />
                      <div>
                        <h3 className="text-lg font-bold text-[#e4e1e9]">{name}</h3>
                        <p className="text-sm text-[#b9cacb]">{designation}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>{emp.status}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-2 border-t border-[#3b494b]/20">
                    <div>
                      <p className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider">Join Date</p>
                      <p className="text-sm font-medium">{joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[#b9cacb] mt-auto">
                    <div className="flex items-center gap-1">
                      <Icon className="text-base">mail</Icon>
                      <span className="text-xs truncate max-w-[150px]">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon className="text-base">call</Icon>
                      <span className="text-xs">{emp.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-12">
            <p className="text-xs font-medium text-[#b9cacb]">
              Showing {startIndex} to {endIndex} of {employees.length} employees
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 flex items-center justify-center border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={currentPage === 1}
              >
                <Icon>chevron_left</Icon>
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                    currentPage === page
                      ? 'bg-[#00dbe9] text-white font-bold'
                      : 'border border-[#3b494b] hover:bg-[#2a292f]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="w-10 h-10 flex items-center justify-center border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={currentPage === totalPages}
              >
                <Icon>chevron_right</Icon>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
