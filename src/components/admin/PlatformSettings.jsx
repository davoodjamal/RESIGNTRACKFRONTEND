import { useState } from 'react';
import Icon from '../Icon';

export default function PlatformSettings({ user }) {
  const [settings, setSettings] = useState({
    adminName: user?.username || 'Eleanor Vance',
    adminEmail: user?.email || 'e.vance@enterprise.com',
    companyName: 'Acme Global Corporation',
    primaryContact: 'hr-noreply@acmeglobal.com'
  });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // mock save action
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-[#e4e1e9] mb-1">Settings</h2>
        <p className="text-base text-[#b9cacb]">
          Configure enterprise preferences, security policies, and administrative details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Primary Settings */}
        <div className="lg:col-span-3 space-y-6">

          {/* Organization Profile */}
          <section className="bg-[#1f1f24]/90 backdrop-blur-md rounded-xl p-6 border border-[#c3c6d5]/50 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#c3c6d5] pb-4 mb-6">
              <Icon className="text-[#00dbe9] text-2xl">domain</Icon>
              <h2 className="text-xl font-semibold text-[#e4e1e9]">Organization Profile</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="flex-grow space-y-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wide text-[#b9cacb] mb-2">Company Name</label>
                    <input
                      name="companyName"
                      className="w-full border border-[#c3c6d5] rounded-lg px-4 py-2 text-sm focus:border-[#00dbe9] focus:ring-1 focus:ring-[#00dbe9] outline-none transition-all h-10 bg-[#1f1f24] text-[#e4e1e9]"
                      type="text"
                      value={settings.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wide text-[#b9cacb] mb-2">Primary Contact / Reply-To</label>
                    <input
                      name="primaryContact"
                      className="w-full border border-[#c3c6d5] rounded-lg px-4 py-2 text-sm focus:border-[#00dbe9] focus:ring-1 focus:ring-[#00dbe9] outline-none transition-all h-10 bg-[#1f1f24] text-[#e4e1e9]"
                      type="email"
                      value={settings.primaryContact}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-12 flex justify-end gap-4 border-t border-[#c3c6d5] pt-6">
        <button className="px-4 py-2 h-10 rounded-lg text-xs font-medium text-[#b9cacb] hover:bg-[#e7e7f1] transition-colors flex items-center justify-center">
          Discard Changes
        </button>
        <button 
          onClick={handleSave}
          className="bg-[#00dbe9] text-black px-4 py-2 h-10 rounded-lg text-xs font-medium hover:bg-[#00a8b0] transition-colors shadow-sm flex items-center justify-center"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
