import { useState } from 'react';
import Icon from '../Icon';
import { createUser } from '../../api';

const permissionOptions = [
  { id: 'resignations', label: 'Manage Resignations', desc: 'Approve or deny exit requests and oversee offboarding workflows.', defaultOn: true },
  { id: 'reports', label: 'View Reports', desc: 'Access analytics dashboard and export resignation reports.', defaultOn: true },
  { id: 'maintenance', label: 'System Maintenance', desc: 'Configure platform settings and global integrations.', defaultOn: false },
];

const roleOptions = [
  { value: 'admin', label: 'System Admin' },
  { value: 'hr', label: 'HR Manager' },
  { value: 'employee', label: 'Employee' },
];

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  password: '',
  designation: '',
  address: '',
  role: 'hr',
  joinDate: new Date().toISOString().split('T')[0],
};

export default function CreateUserModal({ onClose, onRefreshUsers, onNavigateUsers }) {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [form, setForm] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState(() => {
    const init = {};
    permissionOptions.forEach((permission) => {
      init[permission.id] = permission.defaultOn;
    });
    return init;
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setForm(initialFormState);
    setShowPassword(false);
    setPermissions(() => {
      const init = {};
      permissionOptions.forEach((permission) => {
        init[permission.id] = permission.defaultOn;
      });
      return init;
    });
    setErrors({});
    setApiError('');
    setSubmitting(false);
    setStep('form');
  };

  const closeModal = () => {
    resetForm();
    onClose?.();
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required.';
    }

    if (!form.dob.trim()) {
      nextErrors.dob = 'Date of birth is required.';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!form.designation.trim()) {
      nextErrors.designation = 'Designation is required.';
    }

    if (!form.address.trim()) {
      nextErrors.address = 'Residential address is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        dob: form.dob,
        password: form.password,
        designation: form.designation.trim(),
        address: form.address.trim(),
        role: form.role,
        joinDate: form.joinDate,
        permissions: Object.keys(permissions).filter((key) => permissions[key]),
      };

      await createUser(payload);
      setStep('success');
    } catch (error) {
      setApiError(error.message || 'Unable to create user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    resetForm();
    onClose?.();
    onRefreshUsers?.();
    onNavigateUsers?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(25, 27, 34, 0.55)' }}>
      <div className="bg-[#1f1f24] w-full max-w-6xl max-h-[calc(100vh-4rem)] rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-[fadeZoom_0.3s_ease-out]">
        {step === 'form' && (
          <form className="px-10 py-8 max-h-[calc(100vh-5rem)] overflow-y-auto" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-[#00dbe9]">Create New User</h2>
                <p className="mt-2 text-base font-medium text-[#b9cacb]">Create a new user account with personal details and permissions in the admin portal.</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 pt-8">
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <section className="rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-8 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <Icon className="text-[#00dbe9] text-[20px]">account_circle</Icon>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Profile Photo</h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-40 w-40 items-center justify-center rounded-full border border-[#3b494b] bg-[#2a292f] p-1 shadow-sm">
                      <Icon className="text-[#b9cacb] text-[48px]">photo_camera</Icon>
                    </div>
                    <button type="button" className="text-sm font-semibold text-[#00dbe9] transition-colors hover:underline">Upload Avatar</button>
                    <p className="mt-2 text-xs text-[#b9cacb]">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-8 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <Icon className="text-[#00dbe9] text-[20px]">badge</Icon>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Work Information</h3>
                  </div>
                  <div className="flex flex-col gap-6">
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Employee ID</span>
                      <input
                        disabled
                        value={`NEW-${Date.now().toString().slice(-5)}`}
                        className="rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#b9cacb] outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Designation</span>
                      <input
                        type="text"
                        value={form.designation}
                        onChange={(event) => setForm({ ...form, designation: event.target.value })}
                        className={`rounded-xl border px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] ${errors.designation ? 'border-[#ef4444]' : 'border-[#3b494b]'}`}
                        placeholder="Senior Lead Designer"
                      />
                      {errors.designation && <span className="text-xs text-[#ef4444]">{errors.designation}</span>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Join Date</span>
                      <input
                        type="date"
                        value={form.joinDate}
                        onChange={(event) => setForm({ ...form, joinDate: event.target.value })}
                        className="rounded-xl border px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] border-[#3b494b]"
                      />
                    </label>
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
                        type="text"
                        value={form.fullName}
                        onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                        className={`rounded-xl border px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] ${errors.fullName ? 'border-[#ef4444]' : 'border-[#3b494b]'}`}
                        placeholder="Alex Thompson"
                      />
                      {errors.fullName && <span className="text-xs text-[#ef4444]">{errors.fullName}</span>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Email Address</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        className={`rounded-xl border px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] ${errors.email ? 'border-[#ef4444]' : 'border-[#3b494b]'}`}
                        placeholder="alex.thompson@resigntrack.com"
                      />
                      {errors.email && <span className="text-xs text-[#ef4444]">{errors.email}</span>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Role</span>
                      <div className="relative">
                        <select
                          value={form.role}
                          onChange={(event) => setForm({ ...form, role: event.target.value })}
                          className="w-full rounded-xl border border-[#3b494b] bg-[#2a292f] px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 appearance-none"
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-[#1f1f24] text-[#e4e1e9]">
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Icon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#b9cacb]">expand_more</Icon>
                      </div>
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Phone Number</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        className={`rounded-xl border px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] ${errors.phone ? 'border-[#ef4444]' : 'border-[#3b494b]'}`}
                        placeholder="+1 (555) 012-3456"
                      />
                      {errors.phone && <span className="text-xs text-[#ef4444]">{errors.phone}</span>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Date of Birth</span>
                      <input
                        type="date"
                        value={form.dob}
                        onChange={(event) => setForm({ ...form, dob: event.target.value })}
                        className={`rounded-xl border px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] ${errors.dob ? 'border-[#ef4444]' : 'border-[#3b494b]'}`}
                      />
                      {errors.dob && <span className="text-xs text-[#ef4444]">{errors.dob}</span>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#e4e1e9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Password</span>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={(event) => setForm({ ...form, password: event.target.value })}
                          className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] ${errors.password ? 'border-[#ef4444]' : 'border-[#3b494b]'}`}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b9cacb] transition-colors hover:text-[#00dbe9]"
                        >
                          <Icon className="text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</Icon>
                        </button>
                      </div>
                      {errors.password && <span className="text-xs text-[#ef4444]">{errors.password}</span>}
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
                        value={form.address}
                        onChange={(event) => setForm({ ...form, address: event.target.value })}
                        className={`rounded-xl border px-4 py-3 text-sm text-[#e4e1e9] outline-none transition focus:border-[#00dbe9] focus:ring-2 focus:ring-[#00dbe9]/30 bg-[#2a292f] ${errors.address ? 'border-[#ef4444]' : 'border-[#3b494b]'}`}
                        placeholder="742 Evergreen Terrace, Cyber City, CA 90210, United States"
                      />
                      {errors.address && <span className="text-xs text-[#ef4444]">{errors.address}</span>}
                    </label>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#3b494b] bg-[#1f1f24] p-8 shadow-sm">
                  <div className="mb-8 flex items-center gap-3">
                    <Icon className="text-[#00dbe9] text-[20px]">verified_user</Icon>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9cacb]">Manage Permissions</h3>
                  </div>
                  <div className="space-y-3">
                    {permissionOptions.map((permission) => (
                      <button
                        key={permission.id}
                        type="button"
                        onClick={() => setPermissions((prev) => ({ ...prev, [permission.id]: !prev[permission.id] }))}
                        className={`w-full rounded-3xl border px-5 py-4 text-left transition-all ${permissions[permission.id] ? 'border-[#00dbe9] bg-[#0d1f24]' : 'border-[#3b494b] bg-[#17171c] hover:border-[#00dbe9]'}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#e4e1e9]">{permission.label}</p>
                            <p className="text-sm text-[#b9cacb] mt-1">{permission.desc}</p>
                          </div>
                          <div className={`h-6 w-12 rounded-full p-[3px] transition ${permissions[permission.id] ? 'bg-[#00dbe9]' : 'bg-[#3b494b]'}`}>
                            <span className={`block h-5 w-5 rounded-full bg-[#1f1f24] transition-transform ${permissions[permission.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {apiError && <p className="mt-4 text-sm text-[#ef4444]">{apiError}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[#4d5b63] px-6 py-3 text-sm font-semibold text-[#b9cacb] transition-colors hover:border-[#00dbe9] hover:text-[#00dbe9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#00dbe9] px-8 py-3 text-sm font-bold text-[#071014] shadow-[0_10px_20px_rgba(0,219,233,0.20)] transition-all hover:bg-[#00c4d4] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Icon className="animate-spin">progress_activity</Icon>
                    Creating...
                  </span>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#00dbe9]/10 text-[#00dbe9] shadow-lg shadow-[#00dbe9]/15">
              <Icon className="text-4xl">check</Icon>
            </div>
            <h2 className="text-3xl font-semibold text-[#e4e1e9]">User Created Successfully</h2>
            <p className="mt-3 text-sm text-[#b9cacb] max-w-lg mx-auto">
              The new user has been added and will receive an invitation email with next steps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
              <button
                type="button"
                onClick={handleSuccessClose}
                className="inline-flex items-center justify-center rounded-2xl bg-[#00dbe9] px-8 py-3 text-sm font-semibold text-[#071014] hover:bg-[#00c4d6] transition-all"
              >
                View All Users
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-2xl border border-[#4d5b63] px-8 py-3 text-sm font-semibold text-[#b9cacb] hover:bg-[#23252b] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeZoom {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
