import { useState } from 'react';
import Icon from '../Icon';
import ExportDataModal from './ExportDataModal';

export default function ResignationsOversight({ resignations = [] }) {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showExport, setShowExport] = useState(false);

  // Since we might not receive real resignations from App.jsx initially, let's provide fallback mock data matching the prototype
  const mockResignations = resignations.length > 0 ? resignations : [
    { name: 'Jane Doe', id: 'EMP-8273', date: 'Oct 24, 2023', status: 'Pending' },
    { name: 'Alex Smith', id: 'EMP-9102', date: 'Oct 22, 2023', status: 'Processing' },
    { name: 'Michael Wong', id: 'EMP-7731', date: 'Oct 18, 2023', status: 'Completed' },
    { name: 'Sarah Jenkins', id: 'EMP-6542', date: 'Oct 15, 2023', status: 'Escalated' },
    { name: 'Robert Brown', id: 'EMP-4421', date: 'Oct 12, 2023', status: 'Processing' },
    { name: 'Linda Lee', id: 'EMP-3390', date: 'Oct 10, 2023', status: 'Pending' }
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-[#e4e1e9] mb-1">All Resignations</h2>
          <p className="text-sm text-[#b9cacb]">
            Manage and oversee all employee resignation requests.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowExport(true)}
            className="bg-[#1f1f24] text-[#b9cacb] border border-[#3b494b] rounded-lg h-10 px-4 flex items-center gap-2 text-xs font-medium hover:bg-[#2a292f] hover:shadow-md transition-all duration-200 shadow-sm"
          >
            <Icon className="text-[18px]">download</Icon>
            Export Data (CSV/Excel)
          </button>
        </div>
      </div>

      {/* Data Table / List View */}
      <div className="bg-[#1f1f24] rounded-xl shadow-sm border border-[#3b494b] overflow-hidden">
        {/* Filters/Toolbar */}
        <div className="p-4 border-b border-[#3b494b] flex flex-wrap gap-4 justify-between items-center bg-[#131318]">
          <div className="flex gap-2">
            <select
              className="bg-[#1f1f24] border-[#3b494b] text-[#e4e1e9] rounded-lg h-10 px-4 text-sm focus:ring-[#00dbe9] focus:border-[#00dbe9] shadow-sm outline-none border"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Pending Review</option>
              <option>Processing</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="text-xs font-medium text-[#b9cacb]">
            Showing 1-{mockResignations.length} of {mockResignations.length} records
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1f1f24] border-b border-[#3b494b]">
                <th className="p-4 text-xs font-semibold text-[#b9cacb] uppercase tracking-wider">Employee Name</th>
                <th className="p-4 text-xs font-semibold text-[#b9cacb] uppercase tracking-wider">Resignation Date</th>
                <th className="p-4 text-xs font-semibold text-[#b9cacb] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b494b] text-sm">
              {mockResignations.map((req, i) => (
                <tr key={i} className="hover:bg-[#2a292f] transition-all duration-200 ease-in-out group animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms` }}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center text-[#00dbe9] text-xs font-bold">
                        {getInitials(req.name)}
                      </div>
                      <div>
                        <div className="font-medium text-[#e4e1e9] group-hover:text-[#00dbe9] transition-colors duration-200">
                          {req.name}
                        </div>
                        <div className="text-xs text-[#b9cacb]">
                          {req.id || req.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#b9cacb]">
                    {req.date || req.submissionDate}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-[11px] font-medium border ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Data Modal */}
      {showExport && <ExportDataModal onClose={() => setShowExport(false)} />}
    </div>
  );
}
