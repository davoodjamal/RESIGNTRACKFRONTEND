import { useEffect, useState } from 'react';
import Icon from '../Icon';

const defaultAssets = [
  {
    id: 'MBP-2023-9941X',
    name: 'MacBook Pro 16" (M2 Max)',
    desc: 'Main Productivity Workstation',
    icon: 'laptop_mac',
    status: 'In Progress',
    history: [
      { time: '2027-03-12 09:21', note: 'Assigned to employee.' },
      { time: '2027-03-21 08:15', note: 'Return kit requested.' }
    ]
  },
  {
    id: 'ID-SJ-4402',
    name: 'Company ID Card',
    desc: 'Global Access Tier 1',
    icon: 'badge',
    status: 'Pending Kit Pickup',
    history: [
      { time: '2027-03-12 09:21', note: 'Issued by Security.' }
    ]
  },
  {
    id: 'FOB-667',
    name: 'Security Key Fob',
    desc: 'After-hours Building Entry',
    icon: 'vpn_key',
    status: 'Collected',
    history: [
      { time: '2027-03-14 14:30', note: 'Returned at security desk.' }
    ]
  },
  {
    id: 'MON-DELL-882',
    name: 'Dell UltraSharp 27"',
    desc: '4K External Display',
    icon: 'monitor',
    status: 'Damaged',
    history: [
      { time: '2027-03-13 11:05', note: 'Screen crack reported.' }
    ]
  }
];

const allActions = [
  { label: 'View Asset Details', action: 'details', icon: 'preview', subtitle: 'See full asset record' },
  { label: 'Asset History', action: 'history', icon: 'history', subtitle: 'Review past events' },
  { label: 'Contact IT Support', action: 'contact', icon: 'support_agent', subtitle: 'Open support guidance' }
];

const menuByStatus = {
  'Pending Kit Pickup': [
    { label: 'Schedule Pickup', action: 'schedulePickup', icon: 'schedule', subtitle: 'Book a pickup window' },
    { label: 'Mark as Collected', action: 'markCollected', icon: 'inventory', subtitle: 'Asset has been collected' },
    { label: 'Report Issue', action: 'reportIssue', icon: 'report_problem', subtitle: 'Raise a kit concern' }
  ],
  'In Progress': [
    { label: 'Update Status', action: 'updateStatus', icon: 'edit', subtitle: 'Adjust current state' },
    { label: 'Add Notes', action: 'addNotes', icon: 'note_add', subtitle: 'Save additional context' }
  ],
  Collected: [
    { label: 'Confirm Return', action: 'confirmReturn', icon: 'check_circle', subtitle: 'Finalize collection' },
    { label: 'Download Receipt', action: 'downloadReceipt', icon: 'download', subtitle: 'Save return receipt' }
  ],
  Damaged: [
    { label: 'Report Damage', action: 'reportIssue', icon: 'report', subtitle: 'Document a damaged item' },
    { label: 'Upload Evidence', action: 'uploadEvidence', icon: 'upload_file', subtitle: 'Attach photos or docs' },
    { label: 'Escalate to HR/Admin', action: 'escalate', icon: 'warning_amber', subtitle: 'Request leadership review' }
  ],
  Escalated: [
    { label: 'Update Status', action: 'updateStatus', icon: 'edit', subtitle: 'Change status if resolved' }
  ]
};

const displayStatus = {
  'In Progress': 'In Progress',
  'Pending Kit Pickup': 'Pending Pickup',
  Collected: 'Collected',
  Damaged: 'Damaged',
  Escalated: 'Escalated'
};

export default function AssetManagement({ user, resignation, assets: propAssets, onUpdateAssetStatus }) {
  const storageKey = `resigntrack-assets-${user?.email || 'guest'}`;
  const [assets, setAssets] = useState([]);
  const [modal, setModal] = useState({ type: null, asset: null, value: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (propAssets && propAssets.length > 0) {
      const formatted = propAssets.map(a => {
        const displayTag = a.tag || a.id.toString();
        return {
          id: displayTag,
          dbId: a.id,
          name: a.name,
          desc: a.notes || `${a.type} assigned to you`,
          icon: a.type === 'Laptop' ? 'laptop_mac' : a.type === 'Monitor' ? 'monitor' : a.type === 'Mobile' ? 'smartphone' : 'badge',
          status: a.status === 'Available' ? 'Collected' : a.status === 'Assigned' ? 'In Progress' : a.status,
          history: []
        };
      });
      setAssets(formatted);
    } else {
      setAssets([]);
    }
  }, [propAssets]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateAsset = async (assetId, changes, historyNote) => {
    // If status is changed, propagate to backend
    if (changes.status && onUpdateAssetStatus) {
      let dbStatus = changes.status;
      if (changes.status === 'In Progress') dbStatus = 'Assigned';
      else if (changes.status === 'Collected') dbStatus = 'Available';

      const matched = propAssets.find(a => (a.tag || a.id.toString()) === assetId);
      if (matched) {
        await onUpdateAssetStatus(matched.id, dbStatus);
      }
    }

    setAssets((prev) =>
      prev.map((item) =>
        item.id === assetId
          ? {
            ...item,
            ...changes,
            history: historyNote ? [{ time: new Date().toLocaleString(), note: historyNote }, ...(item.history || [])] : item.history
          }
          : item
      )
    );
  };

  const showToastMessage = (message) => {
    setToast(message);
  };

  const handleConfirm = () => {
    const { asset, value } = modal;
    if (!asset) return;
    switch (value) {
      case 'schedulePickup':
        updateAsset(asset.id, { status: 'In Progress' }, 'Pickup scheduled with IT support.');
        showToastMessage('Pickup scheduled successfully.');
        break;
      case 'markCollected':
        updateAsset(asset.id, { status: 'Collected' }, 'Asset marked as collected.');
        showToastMessage('Asset marked as collected.');
        break;
      case 'reportIssue':
        updateAsset(asset.id, { status: 'Damaged' }, 'Damage issue reported for asset.');
        showToastMessage('Issue reported and asset flagged as damaged.');
        break;
      case 'confirmReturn':
        updateAsset(asset.id, { status: 'Collected' }, 'Return confirmed by employee.');
        showToastMessage('Return confirmed successfully.');
        break;
      case 'escalate':
        updateAsset(asset.id, { status: 'Escalated' }, 'Asset issue escalated to HR/Admin.');
        showToastMessage('Escalation sent to HR/Admin.');
        break;
      default:
        break;
    }
    setModal({ type: null, asset: null, value: '' });
  };

  const handleSaveNotes = () => {
    const { asset, value } = modal;
    updateAsset(asset.id, { notes: value }, 'Internal note added.');
    showToastMessage('Notes saved for asset.');
    setModal({ type: null, asset: null, value: '' });
  };

  const handleSaveEvidence = () => {
    const { asset, value } = modal;
    updateAsset(asset.id, { evidence: value }, 'Evidence uploaded for damage report.');
    showToastMessage('Evidence uploaded successfully.');
    setModal({ type: null, asset: null, value: '' });
  };

  const handleUpdateStatus = () => {
    const { asset, value } = modal;
    updateAsset(asset.id, { status: value }, `Status updated to ${value}.`);
    showToastMessage(`Status updated to ${displayStatus[value] || value}.`);
    setModal({ type: null, asset: null, value: '' });
  };

  const totalAssets = assets.length;
  const returnedAssets = assets.filter(a => a.status === 'Collected').length;
  const damagedOrEscalated = assets.filter(a => a.status === 'Damaged' || a.status === 'Escalated').length;
  const pendingReturn = assets.filter(a => a.status === 'In Progress' || a.status === 'Pending Kit Pickup').length;

  let step1State = 'pending';
  let step2State = 'pending';
  let step3State = 'pending';

  if (totalAssets === 0) {
    step1State = 'completed';
    step2State = 'completed';
    step3State = 'completed';
  } else {
    // Step 1: Drop off
    if (pendingReturn === 0) {
      step1State = 'completed';
    } else {
      step1State = 'active';
    }

    // Step 2: IT Inspection
    if (step1State === 'completed') {
      if (damagedOrEscalated > 0) {
        step2State = 'active'; // issue flagged
      } else if (returnedAssets === totalAssets) {
        step2State = 'completed';
      } else {
        step2State = 'active';
      }
    } else if (returnedAssets > 0) {
      step2State = 'active';
    }

    // Step 3: Final Clearance
    if (step1State === 'completed' && step2State === 'completed') {
      step3State = 'completed';
    } else if (step1State === 'completed' && step2State === 'active') {
      step3State = 'pending'; // blocked by inspection issue
    }
  }

  const renderStep = (title, subtitle, state, hasLine = true) => {
    let circleElement = null;
    let titleClass = 'text-base font-bold text-[#76777d]';
    let subtitleClass = 'text-xs font-medium text-[#76777d] mt-0.5';
    let lineClass = 'w-0.5 h-12 bg-[#3b494b]';

    if (state === 'completed') {
      circleElement = (
        <div className="w-8 h-8 rounded-full bg-[#00dbe9] flex items-center justify-center shadow-sm">
          <Icon className="text-[16px] text-[#131318] font-bold">check</Icon>
        </div>
      );
      titleClass = 'text-base font-bold text-[#e4e1e9]';
      subtitleClass = 'text-xs font-medium text-[#b9cacb] mt-0.5';
    } else if (state === 'active') {
      circleElement = (
        <div className="w-8 h-8 rounded-full border-4 border-[#00dbe9] bg-[#1f1f24] shadow-sm animate-pulse"></div>
      );
      titleClass = 'text-base font-bold text-[#e4e1e9]';
      subtitleClass = 'text-xs font-medium text-[#b9cacb] mt-0.5';
    } else {
      circleElement = (
        <div className="w-8 h-8 rounded-full border-4 border-[#3b494b] bg-[#2a292f]"></div>
      );
    }

    return (
      <div className="flex gap-5">
        <div className="flex flex-col items-center">
          {circleElement}
          {hasLine && <div className={lineClass}></div>}
        </div>
        <div className="pt-1">
          <p className={titleClass}>{title}</p>
          <p className={subtitleClass}>{subtitle}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl bg-[#111827] border border-[#00dbe9]/20 px-6 py-4 text-sm shadow-2xl text-[#e4e1e9] animate-in fade-in duration-200">
          {toast}
        </div>
      )}

      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black text-[#00dbe9] tracking-tight">My Assets</h2>
          <p className="text-base text-[#b9cacb] mt-2 font-medium">Manage and track company property assigned to you.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-[#1f1f24] p-8 rounded-2xl flex flex-col items-start gap-8 relative overflow-hidden shadow-sm border border-[#3b494b]">
          <div className="relative z-10 w-full">
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-[#00dbe9]">Offboarding Procedure</h3>
            <p className="text-sm max-w-xl mb-8 leading-relaxed text-[#b9cacb]">
              All company assets must be returned by your last working day ({resignation?.relievingDate || 'TBD'}). Please ensure all data is backed up and your accounts are signed out from the hardware.
            </p>
            <div className="flex flex-wrap gap-4 w-full">
              <div className="bg-[#131318] p-4 rounded-xl flex-1 min-w-[200px] border border-[#3b494b]">
                <Icon className="block mb-2 text-[#00dbe9] text-[28px]">location_on</Icon>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#b9cacb]">Return Location</p>
                <p className="text-sm font-medium text-[#e4e1e9]">IT HUB, 4th Floor, Sector B</p>
              </div>
              <div className="bg-[#131318] p-4 rounded-xl flex-1 min-w-[200px] border border-[#3b494b]">
                <Icon className="block mb-2 text-[#00dbe9] text-[28px]">schedule</Icon>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#b9cacb]">Operating Hours</p>
                <p className="text-sm font-medium text-[#e4e1e9]">Mon-Fri: 09:00 - 17:00</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block absolute -right-10 -bottom-10 opacity-10">
            <Icon className="text-[240px] text-[#00dbe9]">inventory_2</Icon>
          </div>
        </div>

        <div className="bg-[#2a292f] p-8 rounded-2xl border border-[#3b494b] shadow-sm">
          <h3 className="text-xl font-bold text-[#00dbe9] mb-6">Verification Timeline</h3>
          <div className="space-y-0 relative">
            {renderStep('Drop off Assets', 'Last Working Day', step1State, true)}
            {renderStep('IT Inspection', 'Within 24 Hours', step2State, true)}
            {renderStep('Final Clearance', 'After Verification', step3State, false)}
          </div>
        </div>
      </div>

      <div className="bg-[#1f1f24] rounded-2xl border border-[#3b494b] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#3b494b] bg-[#2a292f] flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#00dbe9]">Assigned Items</h3>
          <span className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider bg-[#1f1f24] px-3 py-1 rounded-full border border-[#3b494b]">Showing {assets.length} Assets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3b494b]">
                <th className="px-8 py-5 text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Asset Details</th>
                <th className="px-8 py-5 text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Serial Number</th>
                {resignation && resignation.status === 'Approved' && (
                  <th className="px-8 py-5 text-xs font-bold text-[#b9cacb] uppercase tracking-wider text-right">Return Status</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b494b]">
              {assets.map((asset) => {
                return (
                  <tr key={asset.id} className="hover:bg-[#2a292f] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
                          <Icon className="text-[24px]">{asset.icon}</Icon>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#e4e1e9]">{asset.name}</p>
                          <p className="text-xs font-medium text-[#b9cacb] mt-0.5">{asset.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <code className="text-xs font-bold bg-[#2a292f] text-[#00dbe9] px-2.5 py-1.5 rounded-lg border border-[#3b494b]">{asset.id}</code>
                    </td>
                    {resignation && resignation.status === 'Approved' && (
                      <td className="px-8 py-5 text-right">
                        {asset.status === 'In Progress' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#d8e2ff] text-[#001a42] border border-[#00dbe9]/20">
                            <span className="w-2 h-2 rounded-full bg-[#00dbe9]"></span>
                            In Progress
                          </span>
                        )}
                        {asset.status === 'Pending Kit Pickup' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ffe082]/30 text-[#5a4300] border border-[#5a4300]/20">
                            <span className="w-2 h-2 rounded-full bg-[#5a4300]"></span>
                            Pending Pickup
                          </span>
                        )}
                        {asset.status === 'Collected' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#d4edda]/80 text-[#155724] border border-[#c3e6cb]">
                            <span className="w-2 h-2 rounded-full bg-[#155724]"></span>
                            Collected
                          </span>
                        )}
                        {asset.status === 'Damaged' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">
                            <span className="w-2 h-2 rounded-full bg-[#721c24]"></span>
                            Damaged
                          </span>
                        )}
                        {asset.status === 'Escalated' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#f0d9ff] text-[#5f2dde] border border-[#d9bbff]">
                            <span className="w-2 h-2 rounded-full bg-[#5f2dde]"></span>
                            Escalated
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal.type && modal.asset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-[28px] border border-[#3b494b] bg-[#1f1f24] p-8 shadow-2xl">
            <button
              onClick={() => setModal({ type: null, asset: null, value: '' })}
              className="absolute top-5 right-5 rounded-full border border-[#3b494b] bg-[#131318] p-3 text-[#b9cacb] hover:text-[#00dbe9] transition-colors"
            >
              <Icon>close</Icon>
            </button>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#e4e1e9]">
                  {modal.type === 'details' && 'Asset Details'}
                  {modal.type === 'history' && 'Asset History'}
                  {modal.type === 'contact' && 'Contact IT Support'}
                  {modal.type === 'confirm' && 'Confirm Action'}
                  {modal.type === 'notes' && 'Add Notes'}
                  {modal.type === 'updateStatus' && 'Update Status'}
                  {modal.type === 'receipt' && 'Download Receipt'}
                  {modal.type === 'evidence' && 'Upload Evidence'}
                </h3>
                <p className="text-sm text-[#b9cacb] mt-2">
                  {modal.type === 'details' && 'Review the asset metadata and last action history.'}
                  {modal.type === 'history' && 'Historical events associated with this asset are shown below.'}
                  {modal.type === 'contact' && 'Reach out to IT support for assistance with this asset.'}
                  {modal.type === 'confirm' && 'Please confirm the action before it is finalized.'}
                  {modal.type === 'notes' && 'Record additional context or handoff notes for this asset.'}
                  {modal.type === 'updateStatus' && 'Choose the next asset state from the available options.'}
                  {modal.type === 'receipt' && 'Review and download the return receipt.'}
                  {modal.type === 'evidence' && 'Attach evidence for the damaged asset.'}
                </p>
              </div>

              {modal.type === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-2xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
                        <Icon>{modal.asset.icon}</Icon>
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-[#e4e1e9]">{modal.asset.name}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8f99a6]">{modal.asset.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-[#b9cacb]">Status</div>
                      <div className="text-base font-semibold text-[#e4e1e9]">{displayStatus[modal.asset.status] || modal.asset.status}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-[#b9cacb]">Description</div>
                      <div className="text-base text-[#e4e1e9]">{modal.asset.desc}</div>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                    <div className="text-sm text-[#b9cacb]">Latest Activity</div>
                    <div className="text-base text-[#e4e1e9]">{modal.asset.history?.[0]?.note || 'No recent activity recorded.'}</div>
                    {modal.asset.notes && (
                      <div className="pt-4 border-t border-[#3b494b]">
                        <div className="text-sm text-[#b9cacb]">Notes</div>
                        <div className="text-base text-[#e4e1e9]">{modal.asset.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modal.type === 'history' && (
                <div className="space-y-4 rounded-3xl border border-[#3b494b] bg-[#131318] p-6 max-h-60 overflow-y-auto">
                  {modal.asset.history?.map((entry, index) => (
                    <div key={index} className="rounded-2xl bg-[#1f1f24] p-4 border border-[#2c353b]">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#8f99a6]">{entry.time}</div>
                      <div className="mt-2 text-sm text-[#e4e1e9]">{entry.note}</div>
                    </div>
                  ))}
                </div>
              )}

              {modal.type === 'contact' && (
                <div className="space-y-4 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                  <div className="flex items-center gap-4 rounded-2xl bg-[#1f1f24] p-5 border border-[#2c353b]">
                    <span className="w-12 h-12 rounded-2xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
                      <Icon>support_agent</Icon>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-[#e4e1e9]">IT Support</p>
                      <p className="text-sm text-[#b9cacb]">support@resigntrack.com</p>
                      <p className="text-sm text-[#b9cacb]">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#1f1f24] p-5 border border-[#2c353b]">
                    <p className="text-sm font-medium text-[#e4e1e9]">Message</p>
                    <p className="text-sm text-[#b9cacb] mt-2">"I need help coordinating the return of {modal.asset.name}."</p>
                  </div>
                </div>
              )}

              {modal.type === 'confirm' && (
                <div className="space-y-6 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                  <p className="text-sm text-[#b9cacb]">Are you sure you want to proceed?</p>
                  <div className="rounded-2xl bg-[#1f1f24] p-5 border border-[#2c353b]">
                    <div className="font-semibold text-[#e4e1e9]">{modal.asset.name}</div>
                    <div className="text-xs text-[#8f99a6] mt-1">
                      Action: {modal.value === 'schedulePickup' ? 'Schedule Pickup' : modal.value === 'markCollected' ? 'Mark as Collected' : modal.value === 'reportIssue' ? 'Report Issue' : modal.value === 'confirmReturn' ? 'Confirm Return' : modal.value === 'escalate' ? 'Escalate' : ''}
                    </div>
                  </div>
                </div>
              )}

              {modal.type === 'notes' && (
                <div className="space-y-4 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                  <textarea
                    value={modal.value}
                    onChange={(e) => setModal((prev) => ({ ...prev, value: e.target.value }))}
                    rows={6}
                    className="w-full rounded-3xl border border-[#3b494b] bg-[#1f1f24] p-4 text-sm text-[#e4e1e9] focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 outline-none transition-all"
                    placeholder="Add notes for the asset handoff or special handling instructions..."
                  />
                </div>
              )}

              {modal.type === 'updateStatus' && (
                <div className="space-y-4 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                  <select
                    value={modal.value}
                    onChange={(e) => setModal((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-full rounded-3xl border border-[#3b494b] bg-[#1f1f24] p-4 text-sm text-[#e4e1e9] focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 outline-none transition-all"
                  >
                    {Object.keys(displayStatus).map((statusKey) => (
                      <option key={statusKey} value={statusKey}>{displayStatus[statusKey]}</option>
                    ))}
                  </select>
                </div>
              )}

              {modal.type === 'receipt' && (
                <div className="space-y-4 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                  <div className="rounded-2xl bg-[#1f1f24] p-5 border border-[#2c353b]">
                    <p className="text-sm text-[#8f99a6]">Receipt for {modal.asset.name}</p>
                    <p className="text-base font-semibold text-[#e4e1e9] mt-3">Return confirmed on {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-[#b9cacb] mt-1">Reference: {modal.asset.id}-RET</p>
                  </div>
                </div>
              )}

              {modal.type === 'evidence' && (
                <div className="space-y-4 rounded-3xl border border-[#3b494b] bg-[#131318] p-6">
                  <input
                    type="text"
                    value={modal.value}
                    onChange={(e) => setModal((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder="Enter evidence description or file name"
                    className="w-full rounded-3xl border border-[#3b494b] bg-[#1f1f24] p-4 text-sm text-[#e4e1e9] focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 outline-none transition-all"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={() => setModal({ type: null, asset: null, value: '' })}
                className="rounded-3xl border border-[#3b494b] bg-[#1f1f24] px-6 py-3 text-sm font-semibold text-[#b9cacb] hover:border-[#00dbe9] hover:text-[#00dbe9] transition-all"
              >
                Cancel
              </button>
              {(modal.type === 'details' || modal.type === 'history') && (
                <button
                  type="button"
                  onClick={() => setModal({ type: null, asset: null, value: '' })}
                  className="rounded-3xl bg-[#00dbe9] px-6 py-3 text-sm font-semibold text-[#08131f] hover:bg-[#1de9ef] transition-all"
                >
                  Close
                </button>
              )}
              {modal.type === 'contact' && (
                <button
                  type="button"
                  onClick={() => {
                    showToastMessage('IT Support has been contacted.');
                    setModal({ type: null, asset: null, value: '' });
                  }}
                  className="rounded-3xl bg-[#00dbe9] px-6 py-3 text-sm font-semibold text-[#08131f] hover:bg-[#1de9ef] transition-all"
                >
                  Send Request
                </button>
              )}
              {modal.type === 'confirm' && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="rounded-3xl bg-[#00dbe9] px-6 py-3 text-sm font-semibold text-[#08131f] hover:bg-[#1de9ef] transition-all"
                >
                  Confirm
                </button>
              )}
              {modal.type === 'notes' && (
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="rounded-3xl bg-[#00dbe9] px-6 py-3 text-sm font-semibold text-[#08131f] hover:bg-[#1de9ef] transition-all"
                >
                  Save Notes
                </button>
              )}
              {modal.type === 'updateStatus' && (
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="rounded-3xl bg-[#00dbe9] px-6 py-3 text-sm font-semibold text-[#08131f] hover:bg-[#1de9ef] transition-all"
                >
                  Update Status
                </button>
              )}
              {modal.type === 'receipt' && (
                <button
                  type="button"
                  onClick={() => {
                    showToastMessage('Receipt downloaded successfully.');
                    setModal({ type: null, asset: null, value: '' });
                  }}
                  className="rounded-3xl bg-[#00dbe9] px-6 py-3 text-sm font-semibold text-[#08131f] hover:bg-[#1de9ef] transition-all"
                >
                  Download Receipt
                </button>
              )}
              {modal.type === 'evidence' && (
                <button
                  type="button"
                  onClick={handleSaveEvidence}
                  className="rounded-3xl bg-[#00dbe9] px-6 py-3 text-sm font-semibold text-[#08131f] hover:bg-[#1de9ef] transition-all"
                >
                  Save Evidence
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
