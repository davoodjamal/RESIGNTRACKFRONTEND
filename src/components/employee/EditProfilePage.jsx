import { useState } from 'react';
import Icon from '../Icon';

export default function EditProfilePage({ user, onBack, onSaveProfile }) {
  const [fullName, setFullName] = useState(user.fullName || user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [dob, setDob] = useState(user.dob || '');
  const [designation, setDesignation] = useState(user.designation || '');
  const [address, setAddress] = useState(user.address || '');

  const handleSave = () => {
    onSaveProfile({
      fullName,
      email,
      phone,
      dob: dob || null,
      designation,
      address
    });
  };

  return (
    <div className="mt-8 p-8 overflow-y-auto custom-scrollbar flex-1 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3b494b] bg-[#1f1f24] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b9cacb] transition-colors hover:border-[#00dbe9] hover:text-[#00dbe9]"
            >
              <Icon className="text-[18px]">arrow_back</Icon>
              Back to profile
            </button>
            <h2 className="text-4xl font-black tracking-tight text-[#00dbe9]">Edit Profile</h2>
            <p className="mt-2 text-base font-medium text-[#b9cacb]">
              Update your personal, work, and contact information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 pt-4">
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <Icon className="text-[#00dbe9] text-[20px]">account_circle</Icon>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Profile Photo</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-40 w-40 items-center justify-center rounded-full border border-[#3b494b] bg-[#2a292f] p-1 shadow-sm">
                  <img
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQI74YAqB82dLSQR__tJX5_BpX1qP5vLExRbcVoFIqVIRFrj3abqgQ1Xox4qfYA29EC_JvKq2EE2V57T2SzyZ8TyP7jExZqVjUdMIdYaeQRPJK91YC9sRLieRN-k6K8frD4ePFn4VwkoVuLFiNNfCG7kUdGCxd2Fhls-0NVMSVpAUqAAd_mVoxHwyUOzvVO1Ds0IFYOcKG1qPh8IDiDcqExRSSVFUi8KCxMcLcp7-sI17qhsP89UapTBhP9OONjEjuCHJRsEEEC_M"
                  />
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#00dbe9] transition-colors hover:underline"
                >
                  Change Avatar
                </button>
                <p className="mt-2 text-xs text-[#b9cacb]">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <section className="rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                <Icon className="text-[#00dbe9] text-[20px]">person_outline</Icon>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Full Name</span>
                  <input
                    className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Email Address</span>
                  <input
                    disabled
                    className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#b9cacb] outline-none"
                    value={email}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Phone Number</span>
                  <input
                    className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Date of Birth</span>
                  <input
                    type="date"
                    className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                <Icon className="text-[#00dbe9] text-[20px]">badge</Icon>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Work Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Employee ID</span>
                  <input disabled className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#b9cacb] outline-none" value={"EMP-" + String(user.id || '').padStart(4, '0')} />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9] md:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Designation</span>
                  <input
                    className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Join Date</span>
                  <input disabled className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#b9cacb] outline-none" defaultValue="September 14, 2019" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                <Icon className="text-[#00dbe9] text-[20px]">home_pin</Icon>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Contact Details</h3>
              </div>
              <div className="space-y-6">
                <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Residential Address</span>
                  <textarea
                    rows="3"
                    className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </label>
              </div>
            </section>

            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-[#3b494b] px-6 py-3 text-sm font-semibold text-[#b9cacb] transition-colors hover:border-[#00dbe9] hover:text-[#00dbe9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-[#00dbe9] px-8 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(0,219,233,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#00c4d4]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
