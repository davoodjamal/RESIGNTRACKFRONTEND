import Icon from '../Icon';

export default function SystemSettings() {
  return (
    <div className="p-8 mt-16 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-[#00dbe9] mb-2">System Settings</h2>
          <p className="text-base text-[#505f76]">Manage global configurations for the Pro-Exit Enterprise platform.</p>
        </div>
        <div className="flex gap-4">
          <button className="h-11 px-6 rounded-lg border border-[#b9cacb] text-[#e4e1e9] hover:bg-[#2a292f] transition-colors font-medium">
            Discard Changes
          </button>
          <button className="h-11 px-6 rounded-lg bg-[#00dbe9] text-white shadow-lg hover:opacity-90 active:scale-95 transition-all font-bold">
            Save Changes
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* General Settings */}
        <section className="col-span-12 lg:col-span-8 bg-[#1f1f24] rounded-xl p-6 shadow-sm border border-[#3b494b]">
          <div className="flex items-center gap-2 mb-6 border-b border-[#eeedf5] pb-4">
            <Icon className="text-[#00dbe9]">corporate_fare</Icon>
            <h3 className="text-xl font-semibold text-[#e4e1e9]">General Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Company Name</label>
              <input className="w-full h-11 px-4 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-sm focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 outline-none transition-all" type="text" defaultValue="Pro-Exit Enterprise" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Timezone</label>
              <select className="w-full h-11 px-4 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-sm focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 outline-none transition-all">
                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                <option>(GMT+00:00) Universal Coordinated Time</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Language Preferences</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-4 py-1.5 bg-[#00dbe9] text-[#131318] rounded-full text-xs font-medium flex items-center">
                  English (US) <Icon className="text-[16px] ml-1 cursor-pointer hover:text-[#e4e1e9]">close</Icon>
                </span>
                <button className="px-4 py-1.5 border border-dashed border-[#b9cacb] rounded-full text-xs font-medium text-[#b9cacb] hover:bg-[#eeedf5] transition-colors">
                  + Add Language
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Authentication */}
        <section className="col-span-12 lg:col-span-4 bg-[#1f1f24] rounded-xl p-6 shadow-sm border border-[#3b494b] flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-[#eeedf5] pb-4">
            <Icon className="text-[#00dbe9]">security</Icon>
            <h3 className="text-xl font-semibold text-[#e4e1e9]">Security</h3>
          </div>
          <div className="space-y-6 flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#e4e1e9]">Two-Factor Authentication</p>
                <p className="text-xs font-medium tracking-wide text-[#b9cacb]">Require 2FA for all administrators</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#3b494b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#1f1f24] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00dbe9]"></div>
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Password Policy</label>
              <select className="w-full h-11 px-4 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-sm focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 outline-none transition-all">
                <option>Standard (8+ chars)</option>
                <option>Enterprise (12+ chars, complex)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Session Timeout (Minutes)</label>
              <input className="w-full h-11 px-4 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-sm focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 outline-none transition-all" type="number" defaultValue="30" />
            </div>
          </div>
        </section>

        {/* Regional Defaults */}
        <section className="col-span-12 lg:col-span-5 bg-[#1f1f24] rounded-xl p-6 shadow-sm border border-[#3b494b]">
          <div className="flex items-center gap-2 mb-6 border-b border-[#eeedf5] pb-4">
            <Icon className="text-[#00dbe9]">language</Icon>
            <h3 className="text-xl font-semibold text-[#e4e1e9]">Regional Defaults</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Default Currency</label>
              <div className="relative">
                <select className="w-full h-11 px-4 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-sm focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 outline-none transition-all appearance-none cursor-pointer pr-12">
                  <option>USD ($) - United States Dollar</option>
                  <option>EUR (€) - Euro</option>
                  <option>GBP (£) - British Pound</option>
                </select>
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#505f76]">expand_more</Icon>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Date Format</label>
              <div className="relative">
                <select className="w-full h-11 px-4 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-sm focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 outline-none transition-all appearance-none cursor-pointer pr-12">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#505f76]">expand_more</Icon>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium tracking-wide text-[#b9cacb]">Fiscal Year Start</label>
              <select className="w-full h-11 px-4 rounded-lg border border-[#3b494b] bg-[#1f1f24] text-sm focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/20 outline-none transition-all">
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* System Status Banner */}
      <div className="mt-12 bg-[#00dbe9]/5 border border-[#00dbe9]/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#00dbe9] flex items-center justify-center shrink-0">
            <Icon className="text-white" style={{ fontVariationSettings: "'FILL' 1" }}>info</Icon>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-[#00dbe9]">System Health</h4>
            <p className="text-sm text-[#505f76]">All configurations are currently synced across 4 global regions.</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-medium tracking-wide text-[#b9cacb]">Last audit log entry</p>
          <p className="text-xs font-bold tracking-wide text-[#e4e1e9]">Today, 10:42 AM by Admin</p>
        </div>
      </div>
    </div>
  );
}
