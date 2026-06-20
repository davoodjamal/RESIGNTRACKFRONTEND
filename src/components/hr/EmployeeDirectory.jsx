import Icon from '../Icon';

export default function EmployeeDirectory({ setActiveTab, setSelectedEmployee }) {
  const handleCardClick = (emp) => {
    if (emp.name !== 'Marcus Thorne') return;
    setSelectedEmployee(emp);
    setActiveTab('Resignations');
  };

  return (
    <div className="pt-24 px-8 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-[32px] font-bold text-[#00dbe9] leading-tight">Directory</h2>
          <p className="text-base text-[#b9cacb] mt-1">Manage and monitor your workforce transition states.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#b9cacb]">Status</label>
            <select className="bg-[#1f1f24] border-[#3b494b] rounded-lg text-sm py-2 px-4 focus:ring-[#00dbe9] focus:border-[#00dbe9]">
              <option>All Statuses</option>
              <option>Active</option>
              <option>In-Notice</option>
              <option>Resigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bento Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          {
            name: 'Sarah Jenkins',
            role: 'Senior Product Designer',
            status: 'Active',
            statusColor: 'bg-green-100 text-green-700',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDp0nZai5ic4toQDoBtjQMrJAivFopGgH1jUAiVLTq_f5BYy-h3wFlaFs5J4UbwnVCrsJq0botwTQJjwp2C0nmfYGZpAAnIKNtQ_HinjPlMfoJOSLS5vNH7Wc0SMgDlN0uVBX5eT3FMlBiMriatn2t8niS9dANx1nnFgG1AzsHoO3ZvLZbYgqqmAqe2jJm7v3pvGBo30hvCx4XR-p1rPBIfyAsZe5-lyFSEwHyGjg7Xcmy8jUsgVV4Uq4Wr5V4YV4ff4T5Qha0HGRM',
            dept: 'Product Management',
            join: 'Oct 12, 2021',
            email: 's.jenkins@proexit.com',
            phone: '+1 555-0123'
          },
          {
            name: 'Marcus Thorne',
            role: 'Full Stack Engineer',
            status: 'In-Notice',
            statusColor: 'bg-amber-100 text-amber-700',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx00e0JA3DjVmVcgIHzfND6gfG4t4cu97HdNYF7ZOVvVstX20sxZHtLzlpKnfYiBsXIjB4uU3VfhdG65Rt6I8WYGRD7F0FnHPXxJwfepy26l7wqbWetRZxfW9ohMZgkOIdJRgZ0sglqWH7M_Qc2o9PfXmWLGoEBth14r4gViMPyoB26k3mNvyyNFBi5POm_bzbEylNrQ-YZ47Uj7X4Qbb6RvxgsLjTzbmbBtKWrU1HyIjx9uxB4H2O52VjuFe9KY38t-Tsw2xPcDnw',
            dept: 'Engineering',
            join: 'Jan 05, 2019',
            email: 'm.thorne@proexit.com',
            phone: '+1 555-4421'
          },
          {
            name: 'Helena Vane',
            role: 'VP of Sales',
            status: 'Resigned',
            statusColor: 'bg-red-100 text-red-700',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY3sNS9BDt87YdUm4dsk8gYhqJQrY7GpUezYWUGFT3w5h4bdBIPwTA8jsm0DwHRUqDwmsMbwFzEx117GlawhMe6yyIXV9hi5iAMuF_4ys-RNc_qYoHJNwdMLuLocEspBtNgWplpj0WYZG2IzUQ3NsJZ7Tdn__UO5LnCDh_QC2vPf4zMqQYv9RrfPsEv5i44JzwjlTLYsNLUQpRQMIwVM48U-7oJGi-yYcrCdvslrl_zqurXw_atB-Ch9mSo3wgdjMJ9XYq9Hip4jdt',
            dept: 'Sales & Marketing',
            join: 'Mar 30, 2022',
            email: 'h.vane@proexit.com',
            phone: '+1 555-9822'
          },
          {
            name: 'David Chen',
            role: 'Lead DevOps',
            status: 'Active',
            statusColor: 'bg-green-100 text-green-700',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWAbMTfIVBZ4KH5jccOYcL5HAooey-wtK4ZU2rgAGG0pT4yprJlnCkgfJ_QuHPgrXCREYkUqRu7BtGo3Yn9nFc9tyFz30Fg-YnrPwaZdbCvBs-wLrrrK-GY4EuZ4GKCE9qq00tlTe6TuwwXD4-Ztpz_LAJOJgkofNNqrxXcr09fCs1U4QfeB5f-IBHi5LtkTkExhrCWzt3IMy_YXqKoaPwyM2f9VvFaiBzLsVn46WYJoiAw_mNA5zL3AwJje0XzMz72-jL9YezJ4Jz',
            dept: 'Engineering',
            join: 'July 18, 2020',
            email: 'd.chen@proexit.com',
            phone: '+1 555-3211'
          },
          {
            name: 'Amelia Scott',
            role: 'HR Specialist',
            status: 'Active',
            statusColor: 'bg-green-100 text-green-700',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS6zOYX9ZStGDJsHLC4nFp9A2YKazMKN4lcQ2jY-hTaB_VmhBmCAIjYC3BAAWppmNrj8xXvDm4iDoBoQLtuA6ziYc9U2md4XGQNYggeOLR4wKqOEOId9RPs-Gp1RBYaadt9n2hJBcTjNFWnKtNKhumTivzFwHhInFBBcLUf_zMQ9hn5f64t9AjO5G9kNTob8Gj3suVY7IVZxwJ1CaIE1ll31JrPST45eBTWB9l1hpr6hJ3KPUAT1ZsCQq1T_L-wAc0XNI13CokECIO',
            dept: 'HR & Admin',
            join: 'Nov 22, 2022',
            email: 'a.scott@proexit.com',
            phone: '+1 555-5567'
          }
        ].map((emp, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(emp)}
            className="bg-[#1f1f24] p-6 rounded-xl border border-[#3b494b]/50 flex flex-col gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img className="w-14 h-14 rounded-full object-cover border border-[#3b494b]/30" alt={emp.name} src={emp.img} />
                <div>
                  <h3 className="text-lg font-bold text-[#e4e1e9]">{emp.name}</h3>
                  <p className="text-sm text-[#b9cacb]">{emp.role}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.statusColor}`}>{emp.status}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-2 border-t border-[#3b494b]/20">
              <div>
                <p className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider">Join Date</p>
                <p className="text-sm font-medium">{emp.join}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#b9cacb] mt-auto">
              <div className="flex items-center gap-1">
                <Icon className="text-base">mail</Icon>
                <span className="text-xs">{emp.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon className="text-base">call</Icon>
                <span className="text-xs">{emp.phone}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Employee CTA removed */}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-12">
        <p className="text-xs font-medium text-[#b9cacb]">Showing 5 of 124 employees</p>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-all disabled:opacity-30" disabled>
            <Icon>chevron_left</Icon>
          </button>
          <button className="w-10 h-10 bg-[#00dbe9] text-white rounded-lg text-sm font-bold flex items-center justify-center">1</button>
          <button className="w-10 h-10 border border-[#3b494b] rounded-lg text-sm font-medium hover:bg-[#2a292f] transition-all flex items-center justify-center">2</button>
          <button className="w-10 h-10 border border-[#3b494b] rounded-lg text-sm font-medium hover:bg-[#2a292f] transition-all flex items-center justify-center">3</button>
          <button className="w-10 h-10 flex items-center justify-center border border-[#3b494b] rounded-lg hover:bg-[#2a292f] transition-all">
            <Icon>chevron_right</Icon>
          </button>
        </div>
      </div>
    </div>
  );
}
