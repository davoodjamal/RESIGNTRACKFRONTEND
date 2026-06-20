import { useState } from 'react';
import Icon from '../Icon';

const fieldCategories = [
  {
    title: 'EMPLOYEE INFO',
    icon: 'person',
    fields: [
      { label: 'Employee Name', defaultChecked: true },
      { label: 'Employee ID', defaultChecked: true },
      { label: 'Job Title', defaultChecked: false },
    ],
  },
  {
    title: 'CASE DETAILS',
    icon: 'assignment',
    fields: [
      { label: 'Resignation Date', defaultChecked: true },
      { label: 'Effective Date', defaultChecked: true },
      { label: 'Reason for Leaving', defaultChecked: true },
      { label: 'Status', defaultChecked: true },
    ],
  },
  {
    title: 'ADMIN DATA',
    icon: 'admin_panel_settings',
    fields: [
      { label: 'Assigned Manager', defaultChecked: false },
      { label: 'Notice Period', defaultChecked: false },
      { label: 'Interview Done', defaultChecked: false },
    ],
  },
];

export default function ExportDataModal({ onClose }) {
  const [format, setFormat] = useState('csv');
  const [checkedFields, setCheckedFields] = useState(() => {
    const init = {};
    fieldCategories.forEach((cat) =>
      cat.fields.forEach((f) => { init[f.label] = f.defaultChecked; })
    );
    return init;
  });
  const [excludeInactive, setExcludeInactive] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [step, setStep] = useState('form');

  const toggleField = (label) => setCheckedFields((prev) => ({ ...prev, [label]: !prev[label] }));
  const selectAll = () => {
    const updated = {};
    fieldCategories.forEach((cat) => cat.fields.forEach((f) => { updated[f.label] = true; }));
    setCheckedFields(updated);
  };
  const clearAll = () => {
    const updated = {};
    fieldCategories.forEach((cat) => cat.fields.forEach((f) => { updated[f.label] = false; }));
    setCheckedFields(updated);
  };

  const handleExport = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 1500);
  };

  const formats = [
    { id: 'csv', label: 'CSV (Comma Separated)', desc: 'Best for raw data imports' },
    { id: 'xlsx', label: 'Excel (XLSX)', desc: 'Formatted for spreadsheet analysis' },
    { id: 'pdf', label: 'PDF Document', desc: 'Polished report for stakeholders' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className={`bg-[#1f1f24] rounded-xl shadow-xl relative overflow-hidden transition-all duration-300 animate-[fadeZoom_0.3s_ease-out] ${step === 'success' ? 'w-full max-w-[480px]' : 'w-full max-w-[900px] max-h-[90vh] overflow-y-auto p-12'}`}>
        
        {step === 'form' && (
          <>
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#2a292f] transition-colors text-[#b9cacb]">
              <Icon>close</Icon>
            </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#b9cacb] mb-1">
            <a href="#" className="hover:text-[#00dbe9] transition-colors text-xs font-medium">Cases</a>
            <Icon className="text-[14px]">chevron_right</Icon>
            <span className="text-xs font-bold text-[#00dbe9]">Export Data</span>
          </div>
          <h2 className="text-2xl font-semibold text-[#e4e1e9]">Export Resignation Data</h2>
          <p className="text-base text-[#b9cacb] mt-1">Configure your data parameters to generate a detailed report of resignation activities and trends.</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Date Range & Format */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Date Range */}
            <section className="bg-[#1f1f24] p-6 rounded-xl shadow-sm border border-[#3b494b]/20 hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#00dbe9]/10 flex items-center justify-center text-[#00dbe9]">
                  <Icon>calendar_month</Icon>
                </div>
                <h3 className="text-xl font-semibold">Date Range</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#b9cacb] mb-1">START DATE</label>
                  <input type="date" className="w-full rounded-lg border border-[#3b494b] focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 p-4 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#b9cacb] mb-1">END DATE</label>
                  <input type="date" className="w-full rounded-lg border border-[#3b494b] focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 p-4 outline-none" />
                </div>
                <div className="flex flex-wrap gap-1 mt-4">
                  {['Last 30 Days', 'Q3 2023', 'YTD'].map((preset) => (
                    <button key={preset} className="px-4 py-1 rounded-full border border-[#3b494b] text-xs font-medium hover:bg-[#2a292f] transition-colors">
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* File Format */}
            <section className="bg-[#1f1f24] p-6 rounded-xl shadow-sm border border-[#3b494b]/20 hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#00dbe9]/10 flex items-center justify-center text-[#00dbe9]">
                  <Icon>description</Icon>
                </div>
                <h3 className="text-xl font-semibold">File Format</h3>
              </div>
              <div className="space-y-2">
                {formats.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${format === f.id ? 'border-[#00dbe9] bg-[#00dbe9]/5' : 'border-[#3b494b] hover:border-[#00dbe9]'}`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={f.id}
                      checked={format === f.id}
                      onChange={() => setFormat(f.id)}
                      className="w-5 h-5 text-[#00dbe9] focus:ring-[#00dbe9]"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-bold">{f.label}</p>
                      <p className="text-xs text-[#b9cacb]">{f.desc}</p>
                    </div>
                    {format === f.id && <Icon className="ml-auto text-[#00dbe9]">check_circle</Icon>}
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Data Fields */}
          <div className="col-span-12 lg:col-span-8">
            <section className="bg-[#1f1f24] p-6 rounded-xl shadow-sm border border-[#3b494b]/20 h-full hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00dbe9]/10 flex items-center justify-center text-[#00dbe9]">
                    <Icon>checklist</Icon>
                  </div>
                  <h3 className="text-xl font-semibold">Select Data Fields</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-[#00dbe9] text-xs font-bold uppercase tracking-wider hover:underline">Select All</button>
                  <span className="text-[#3b494b]">|</span>
                  <button onClick={clearAll} className="text-[#b9cacb] text-xs font-bold uppercase tracking-wider hover:underline">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {fieldCategories.map((cat) => (
                  <div key={cat.title} className="space-y-4">
                    <h4 className="text-xs font-bold text-[#b9cacb] flex items-center gap-1">
                      <Icon className="text-[18px]">{cat.icon}</Icon> {cat.title}
                    </h4>
                    <div className="space-y-2">
                      {cat.fields.map((f) => (
                        <label key={f.label} className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedFields[f.label] || false}
                            onChange={() => toggleField(f.label)}
                            className="w-5 h-5 rounded text-[#00dbe9] focus:ring-[#00dbe9]"
                          />
                          <span className="text-sm">{f.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Advanced Options */}
              <div className="mt-12 pt-6 border-t border-[#2a292f]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00dbe9]/10 flex items-center justify-center text-[#00dbe9]">
                    <Icon>tune</Icon>
                  </div>
                  <h3 className="text-xl font-semibold">Advanced Options</h3>
                </div>
                <label className="flex items-center justify-between p-4 bg-[#2a292f] rounded-lg cursor-pointer">
                  <div>
                    <p className="text-sm font-bold">Exclude Inactive Users</p>
                    <p className="text-xs text-[#b9cacb]">Only show currently employed admins</p>
                  </div>
                  <button
                    onClick={() => setExcludeInactive(!excludeInactive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${excludeInactive ? 'bg-[#00dbe9]' : 'bg-[#3b494b]'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-[#1f1f24] transition-transform ${excludeInactive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </label>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-end gap-4">
          <button onClick={onClose} className="px-12 py-4 rounded-lg border border-[#b9cacb] text-[#b9cacb] text-sm font-semibold hover:bg-[#2a292f] transition-all active:scale-95">
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={processing}
            className="px-12 py-4 rounded-lg bg-[#00dbe9] text-white text-sm font-semibold shadow-md hover:bg-[#00dbe9] transition-all active:scale-[0.98] flex items-center gap-4 disabled:opacity-70"
          >
            {processing ? (
              <><Icon className="animate-spin">sync</Icon> Processing...</>
            ) : (
              <><Icon>download</Icon> Generate Export</>
            )}
          </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="flex flex-col animate-[fadeZoom_0.3s_ease-out]">
            {/* Graphic/Icon Header */}
            <div className="pt-12 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#33fb0a]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(46,125,50,0.15)]">
                <Icon className="text-[48px] text-[#33fb0a]" fill>check_circle</Icon>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1b20] text-center px-12">Export Ready for Download</h3>
              <p className="text-sm text-[#b9cacb] text-center px-12 mt-4">
                Your registration data export has been successfully generated and is ready for download.
              </p>
            </div>
            {/* File Details Section */}
            <div className="mx-12 my-12 p-6 bg-[#1f1f24] rounded-lg border border-[#3b494b] flex items-center gap-6">
              <div className="w-12 h-12 bg-[#00dbe9]/5 rounded flex items-center justify-center">
                <Icon className="text-[#00dbe9]" fill>description</Icon>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-[#1a1b20] truncate">registration_export_Q3.{format}</p>
                <p className="text-xs text-[#b9cacb]">{format === 'pdf' ? '1.2 MB' : '2.4 MB'} • {format.toUpperCase()} Format</p>
              </div>
              <div className="text-[#33fb0a]">
                <Icon>verified</Icon>
              </div>
            </div>
            {/* Modal Footer/Actions */}
            <div className="p-6 bg-[#1f1f24] flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full h-12 bg-[#00dbe9] hover:bg-[#0e4296] text-white font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Icon className="text-[20px]">download</Icon> Download File
              </button>
              <button
                onClick={onClose}
                className="w-full h-12 bg-transparent hover:bg-[#e9e7ee] text-[#b9cacb] font-bold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
            {/* Tiny Decorative Progress Line */}
            <div className="h-1.5 w-full bg-[#33fb0a]"></div>
          </div>
        )}
      </div>


      <style>{`
        @keyframes fadeZoom {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
