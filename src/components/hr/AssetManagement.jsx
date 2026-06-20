import { useMemo, useState } from 'react';
import Icon from '../Icon';

const employees = [
  { name: 'Marcus Thorne', role: 'Full Stack Developer', email: 'm.thorne@proexit.com' },
  { name: 'Sarah Jenkins', role: 'Senior Product Designer', email: 's.jenkins@proexit.com' },
  { name: 'David Chen', role: 'Lead DevOps', email: 'd.chen@proexit.com' },
  { name: 'Amelia Scott', role: 'HR Specialist', email: 'a.scott@proexit.com' }
];

const statusStyles = {
  Available: 'bg-[#33fb0a]/10 text-[#33fb0a]',
  Assigned: 'bg-[#00dbe9]/10 text-[#00dbe9]',
  'Under Maintenance': 'bg-[#ffc107]/10 text-[#ffc107]',
  Retired: 'bg-[#b9cacb]/10 text-[#b9cacb]'
};

export default function AssetManagement({
  assets,
  assetAuditTrail,
  onAssignAsset,
  onReturnAsset,
  onUpdateAssetStatus,
  onCreateAsset,
  embedded = false
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAssetId, setSelectedAssetId] = useState(assets.find((asset) => asset.status === 'Available')?.id || '');
  const [selectedReturnAssetId, setSelectedReturnAssetId] = useState(assets.find((asset) => asset.status === 'Assigned')?.id || '');
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState(employees[0].email);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnCondition, setReturnCondition] = useState('Good');
  const [returnRemarks, setReturnRemarks] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Asset creation form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState('Laptop');
  const [newAssetStatus, setNewAssetStatus] = useState('Available');
  const [newAssetWarranty, setNewAssetWarranty] = useState('');
  const [newAssetNotes, setNewAssetNotes] = useState('');
  const [createError, setCreateError] = useState('');

  const today = useMemo(() => new Date(), []);

  const filteredAssets = assets.filter((asset) => {
    const searchable = `${asset.tag} ${asset.name} ${asset.type} ${asset.assignedTo || ''}`.toLowerCase();
    const matchesQuery = searchable.includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    return matchesQuery && matchesStatus && matchesType;
  });

  const summary = {
    Total: assets.length,
    Available: assets.filter((asset) => asset.status === 'Available').length,
    Assigned: assets.filter((asset) => asset.status === 'Assigned').length,
    'Under Maintenance': assets.filter((asset) => asset.status === 'Under Maintenance').length,
    Retired: assets.filter((asset) => asset.status === 'Retired').length
  };

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);
  const selectedReturnAsset = assets.find((asset) => asset.id === selectedReturnAssetId);
  const selectedEmployee = employees.find((employee) => employee.email === selectedEmployeeEmail);
  const availableAssets = assets.filter((asset) => asset.status === 'Available');
  const assignedAssets = assets.filter((asset) => asset.status === 'Assigned');
  const warrantyExpiring = assets.filter((asset) => daysUntil(asset.warrantyExpiry, today) <= 45 && daysUntil(asset.warrantyExpiry, today) >= 0);
  const overdueReturns = assets.filter((asset) => asset.status === 'Assigned' && daysUntil(asset.dueBack, today) < 0);

  const handleAssign = () => {
    if (!selectedAsset || !selectedEmployee) return;
    onAssignAsset(selectedAsset.id, selectedEmployee);
  };

  const handleReturn = (assetId = selectedReturnAssetId) => {
    const asset = assets.find((item) => item.id === assetId);
    if (!asset || asset.status !== 'Assigned') return;

    onReturnAsset(assetId, {
      returnDate,
      condition: returnCondition,
      remarks: returnRemarks || 'No remarks'
    });
    setConfirmationMessage(`${asset.tag} was returned by ${asset.assignedTo} and is now Available.`);
    setReturnRemarks('');
    const nextAssignedAsset = assignedAssets.find((item) => item.id !== assetId);
    setSelectedReturnAssetId(nextAssignedAsset?.id || '');
  };

  return (
    <div className={`${embedded ? 'px-0 pt-0 pb-0' : 'pt-24 px-8 pb-12'} max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6`}>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold text-[#e4e1e9] leading-tight">Asset Management</h2>
          <p className="text-[#b9cacb] text-sm mt-1">Track hardware custody, returns, warranty risk, and maintenance activity.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="px-3 py-2 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-xs text-[#b9cacb]">
            {overdueReturns.length} overdue returns
          </span>
          <span className="px-3 py-2 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-xs text-[#b9cacb]">
            {warrantyExpiring.length} warranties expiring soon
          </span>
          {onCreateAsset && (
            <button
              onClick={() => {
                setNewAssetTag('');
                setNewAssetName('');
                setNewAssetType('Laptop');
                setNewAssetStatus('Available');
                setNewAssetWarranty('');
                setNewAssetNotes('');
                setCreateError('');
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00dbe9] text-[#131318] text-xs font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,219,233,0.3)]"
            >
              <Icon className="text-sm">add</Icon>
              Create Asset
            </button>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Object.entries(summary).map(([label, value]) => (
          <div key={label} className="bg-[#1f1f24] border border-[#3b494b] rounded-lg p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9cacb] uppercase tracking-wider">{label}</span>
              <Icon className="text-[#00dbe9]">{label === 'Total' ? 'inventory_2' : 'devices'}</Icon>
            </div>
            <p className="text-3xl font-bold text-[#e4e1e9] mt-3">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#1f1f24] border border-[#3b494b] rounded-lg p-5 space-y-5">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <h3 className="text-xl font-semibold text-[#e4e1e9]">Asset List</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Icon className="absolute left-3 top-2.5 text-[#b9cacb] text-lg">search</Icon>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search assets or employees"
                  className="w-full sm:w-64 bg-[#131318] border border-[#3b494b] rounded-lg pl-10 pr-3 py-2 text-sm text-[#e4e1e9] placeholder-[#b9cacb] focus:outline-none focus:border-[#00dbe9]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
              >
                <option value="all">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
              >
                <option value="all">All Types</option>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Mobile">Mobile</option>
                <option value="Access Card">Access Card</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-[#3b494b] text-xs text-[#b9cacb] uppercase tracking-wider">
                  <th className="py-3 font-medium">Asset</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Assigned To</th>
                  <th className="py-3 font-medium">Due Back</th>
                  <th className="py-3 font-medium">Warranty</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b494b]/60">
                {filteredAssets.map((asset) => {
                  const overdue = asset.status === 'Assigned' && daysUntil(asset.dueBack, today) < 0;
                  const warrantyDays = daysUntil(asset.warrantyExpiry, today);
                  return (
                    <tr key={asset.id} className="text-sm">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-[#e4e1e9]">{asset.name}</p>
                        <p className="text-xs text-[#b9cacb]">{asset.tag} • {asset.type}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[asset.status]}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-[#b9cacb]">{asset.assignedTo || 'Unassigned'}</td>
                      <td className={`py-4 pr-4 ${overdue ? 'text-[#ffb4ab] font-semibold' : 'text-[#b9cacb]'}`}>
                        {asset.dueBack || '-'}
                      </td>
                      <td className={`py-4 pr-4 ${warrantyDays <= 45 ? 'text-[#ffc107]' : 'text-[#b9cacb]'}`}>
                        {asset.warrantyExpiry}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {asset.status === 'Assigned' && (
                            <button
                              onClick={() => {
                                setSelectedReturnAssetId(asset.id);
                                setConfirmationMessage('');
                              }}
                              className="px-3 py-2 rounded-lg bg-[#00dbe9] text-[#131318] text-xs font-semibold hover:opacity-90 transition-all"
                            >
                              Return
                            </button>
                          )}
                          <select
                            value={asset.status}
                            onChange={(event) => onUpdateAssetStatus(asset.id, event.target.value)}
                            className="bg-[#131318] border border-[#3b494b] rounded-lg px-2 py-2 text-xs text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                          >
                            <option value="Available">Available</option>
                            <option value="Assigned" disabled>Assigned</option>
                            <option value="Under Maintenance">Maintenance</option>
                            <option value="Retired">Retired</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1f1f24] border border-[#3b494b] rounded-lg p-5 space-y-4">
            <h3 className="text-xl font-semibold text-[#e4e1e9]">Assign Asset</h3>
            <select
              value={selectedAssetId}
              onChange={(event) => setSelectedAssetId(event.target.value)}
              className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-3 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
            >
              {availableAssets.length === 0 && <option>No available assets</option>}
              {availableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.tag} - {asset.name}</option>
              ))}
            </select>
            <select
              value={selectedEmployeeEmail}
              onChange={(event) => setSelectedEmployeeEmail(event.target.value)}
              className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-3 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
            >
              {employees.map((employee) => (
                <option key={employee.email} value={employee.email}>{employee.name} - {employee.role}</option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={!selectedAsset || selectedAsset.status !== 'Available'}
              className="w-full bg-[#00dbe9] text-[#131318] font-semibold rounded-lg py-3 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Assign Available Asset
            </button>
            <p className="text-xs text-[#b9cacb]">Assigned assets are locked from reassignment until returned.</p>
          </div>

          <div className="bg-[#1f1f24] border border-[#3b494b] rounded-lg p-5 space-y-4">
            <h3 className="text-xl font-semibold text-[#e4e1e9]">Return Workflow</h3>
            {confirmationMessage && (
              <div className="flex items-start gap-3 rounded-lg border border-[#33fb0a]/30 bg-[#33fb0a]/10 p-3 text-sm text-[#33fb0a]">
                <Icon className="text-lg">check_circle</Icon>
                <span>{confirmationMessage}</span>
              </div>
            )}
            <select
              value={selectedReturnAssetId}
              onChange={(event) => {
                setSelectedReturnAssetId(event.target.value);
                setConfirmationMessage('');
              }}
              className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-3 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
            >
              {assignedAssets.length === 0 && <option value="">No assigned assets</option>}
              {assignedAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.tag} - {asset.name} assigned to {asset.assignedTo}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-3 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
            />
            <select
              value={returnCondition}
              onChange={(event) => setReturnCondition(event.target.value)}
              className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-3 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
            >
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Lost">Lost</option>
            </select>
            <textarea
              value={returnRemarks}
              onChange={(event) => setReturnRemarks(event.target.value)}
              placeholder="Optional return remarks"
              rows="3"
              className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-3 text-sm text-[#e4e1e9] placeholder-[#b9cacb] focus:outline-none focus:border-[#00dbe9]"
            />
            {selectedReturnAsset && (
              <div className="rounded-lg border border-[#3b494b] bg-[#2a292f] p-3">
                <p className="text-sm font-semibold text-[#e4e1e9]">{selectedReturnAsset.name}</p>
                <p className="text-xs text-[#b9cacb]">Assigned to {selectedReturnAsset.assignedTo} - due {selectedReturnAsset.dueBack}</p>
              </div>
            )}
            <button
              onClick={() => handleReturn()}
              disabled={!selectedReturnAsset || selectedReturnAsset.status !== 'Assigned'}
              className="w-full bg-[#00dbe9] text-[#131318] font-semibold rounded-lg py-3 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Process Return
            </button>
          </div>

          <div className="bg-[#1f1f24] border border-[#3b494b] rounded-lg p-5">
            <h3 className="text-xl font-semibold text-[#e4e1e9] mb-4">Audit Trail</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {assetAuditTrail.map((entry) => (
                <div key={entry.id} className="border-l-2 border-[#00dbe9] pl-3">
                  <p className="text-sm text-[#e4e1e9]">{entry.action}</p>
                  <p className="text-xs text-[#b9cacb]">{entry.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#1f1f24] border border-[#3b494b] rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-[#3b494b]/60">
              <h3 className="text-xl font-bold text-[#e4e1e9] flex items-center gap-2">
                <Icon className="text-[#00dbe9]">add_box</Icon>
                Register New Asset
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-[#b9cacb] hover:text-[#e4e1e9] transition-colors"
              >
                <Icon>close</Icon>
              </button>
            </div>

            {createError && (
              <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {createError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-1">Asset Tag *</label>
                <input
                  type="text"
                  placeholder="e.g. LT-5510, MN-1203"
                  value={newAssetTag}
                  onChange={(e) => setNewAssetTag(e.target.value)}
                  className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2.5 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-1">Asset Name *</label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro 16, Dell 27 Monitor"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2.5 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-1">Type</label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value)}
                    className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2.5 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Access Card">Access Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-1">Initial Status</label>
                  <select
                    value={newAssetStatus}
                    onChange={(e) => setNewAssetStatus(e.target.value)}
                    className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2.5 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-1">Warranty Expiry</label>
                <input
                  type="date"
                  value={newAssetWarranty}
                  onChange={(e) => setNewAssetWarranty(e.target.value)}
                  className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2.5 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#b9cacb] mb-1">Maintenance / Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Clean setup, initial sync completed"
                  value={newAssetNotes}
                  onChange={(e) => setNewAssetNotes(e.target.value)}
                  className="w-full bg-[#131318] border border-[#3b494b] rounded-lg px-3 py-2 text-sm text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#3b494b] text-[#b9cacb] hover:bg-[#2a292f] hover:text-[#e4e1e9] font-semibold rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newAssetTag.trim() || !newAssetName.trim()) {
                    setCreateError('Asset Tag and Asset Name are required.');
                    return;
                  }
                  if (assets.some(a => a.tag.toLowerCase() === newAssetTag.trim().toLowerCase())) {
                    setCreateError(`Asset with tag "${newAssetTag}" already exists.`);
                    return;
                  }

                  onCreateAsset({
                    tag: newAssetTag.trim(),
                    name: newAssetName.trim(),
                    type: newAssetType,
                    status: newAssetStatus,
                    warrantyExpiry: newAssetWarranty || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    maintenanceNotes: newAssetNotes.trim()
                  });

                  setShowCreateModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-[#00dbe9] text-[#131318] font-bold rounded-lg hover:opacity-90 transition-all text-sm shadow-[0_0_15px_rgba(0,219,233,0.3)]"
              >
                Register Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function daysUntil(dateString, today) {
  if (!dateString) return 999;
  const target = new Date(dateString);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}
