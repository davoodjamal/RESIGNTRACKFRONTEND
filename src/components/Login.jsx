import { useState } from 'react';
import HelpModal from './HelpModal';
import { login } from '../api';

const credentials = {
  employee: { email: 'employee@resigntrack.com', password: 'employee123' },
  hr: { email: 'hr@resigntrack.com', password: 'hr123' },
  admin: { email: 'admin@resigntrack.com', password: 'admin123' }
};

const roleLabels = {
  employee: 'Employee',
  hr: 'HR Manager',
  admin: 'Admin'
};

const officeImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDktBqKRimN0yYbXvlik-9Ygrw4skd0xsk6JWMe7TelWqMD4F8guVQADtPIGN24woMFi8ij6JF_kxjzjZNnjfZwSRn1AC45M6RBIbsNql3v6PZCgL5JoH7v-Ppms4JpMbOezywwyIgvxq-hkuWuw65yWy2IEijuN7KXzTFepkPjnDgr02sELASBPxDkH64Pq4iri5PPtFUBmqweZyBPE7PZ_8HeRruRpjc8aZ2-p_-Trpf6bfT78atAIGhpiMR9vq6szAEzg-avgi3q';

export default function Login({ onLoginSuccess, users = [] }) {
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState(credentials.employee.email);
  const [password, setPassword] = useState(credentials.employee.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const getRoleCredentials = (selectedRole) => {
    const storedUser = users.find((item) => item.role === selectedRole);
    return storedUser || credentials[selectedRole];
  };

  const handleRoleChange = (selectedRole) => {
    const targetCredentials = getRoleCredentials(selectedRole);
    setRole(selectedRole);
    setEmail(targetCredentials.email);
    setPassword(targetCredentials.password);
    setError('');
    setSuccess(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password, role);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(data.role, data.email);
      }, 800);
    } catch (err) {
      setLoading(false);
      setError(err.message || `Authorization failed for ${roleLabels[role]}.`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-pattern px-margin-mobile md:px-margin-desktop py-8 text-[#e4e1e9] selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          className="w-full h-full object-cover"
          src={officeImage}
          alt="Minimal corporate office atrium with glass partitions and diffused professional lighting"
        />
      </div>

      <div className="relative z-10 w-full max-w-[448px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-stack-lg">
          <div className="flex items-center gap-unit mb-unit">
            <span
              className="material-symbols-outlined text-[#00dbe9] text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_tree
            </span>
            <h1 className="text-[20px] leading-7 font-black text-[#00dbe9] tracking-tight">
              RESIGN TRACK
            </h1>
          </div>
          <p className="text-sm leading-5 text-[#b9cacb]">Employee Exit &amp; Analysis Portal</p>
        </div>

        <div className="bg-[#0e0e13] login-card rounded-xl p-stack-lg md:p-10">
          <div className="mb-stack-lg">
            <h2 className="text-[20px] leading-7 font-semibold text-[#e4e1e9] mb-unit">Welcome</h2>
            <p className="text-xs leading-[18px] text-[#b9cacb]">            
              Enter your credentials to access the resignation management system.
            </p>
          </div>

          <form className="space-y-stack-md" onSubmit={handleLogin}>
            <div className="space-y-unit mb-stack-md">
              <label className="text-xs leading-[18px] font-bold text-[#e4e1e9]">Select Role</label>
              <div className="flex p-1 bg-[#1f1f24] border border-[#3b494b] rounded-lg gap-1">
                {Object.keys(credentials).map((item) => (
                  <label key={item} className="flex-1">
                    <input
                      checked={role === item}
                      className="sr-only"
                      name="role"
                      type="radio"
                      value={item}
                      onChange={() => handleRoleChange(item)}
                    />
                    <div
                      className={`flex items-center justify-center py-2 rounded text-xs leading-4 tracking-[0.05em] font-semibold cursor-pointer transition-all hover:bg-[#00dbe9]/5 ${
                        role === item ? 'bg-[#00dbe9] text-[#00363a]' : 'text-[#b9cacb]'
                      }`}
                    >
                      {roleLabels[item]}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-unit">
              <label className="text-xs leading-[18px] font-bold text-[#e4e1e9]" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  mail
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-[#1f1f24] border border-[#3b494b] rounded-lg text-sm leading-5 text-[#e4e1e9] focus:outline-none focus:ring-2 focus:ring-[#00dbe9]/20 focus:border-[#00dbe9] transition-all"
                  id="email"
                  placeholder="name@softwarecorp.com"
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-unit">
              <div className="flex justify-between items-center gap-4">
                <label className="text-xs leading-[18px] font-bold text-[#e4e1e9]" htmlFor="password">
                  Password
                </label>
                <a
                  className="text-xs leading-4 tracking-[0.05em] font-semibold text-secondary hover:underline"
                  href="#"
                  onClick={(event) => event.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-10 pr-12 py-3 bg-surface border border-outline-variant rounded-lg text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  id="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-error-container border border-error/30 text-on-error-container rounded-lg text-xs font-medium">
                <span className="material-symbols-outlined text-[18px] text-error">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                id="remember"
                type="checkbox"
              />
              <label className="text-xs leading-[18px] text-on-surface-variant cursor-pointer" htmlFor="remember">
                Remember this device for 30 days
              </label>
            </div>

            <button
              className={`w-full text-xs leading-4 tracking-[0.05em] font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all mt-stack-md shadow-sm ${
                success
                  ? 'bg-secondary-container text-on-secondary'
                  : 'bg-primary text-on-primary hover:opacity-90'
              } disabled:cursor-wait`}
              disabled={loading || success}
              type="submit"
            >
              {loading && (
                <>
                  <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                  <span>Authenticating...</span>
                </>
              )}
              {success && (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Success</span>
                </>
              )}
              {!loading && !success && (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-stack-lg pt-stack-md border-t border-outline-variant flex flex-col items-center gap-unit">
            <p className="text-xs leading-[18px] text-on-surface-variant">Don't have an account?</p>
            <button className="text-xs leading-4 tracking-[0.05em] font-semibold text-secondary hover:bg-secondary/5 px-4 py-2 rounded-lg transition-colors">
              Request Portal Access
            </button>
          </div>
        </div>

        <footer className="mt-stack-lg flex justify-center gap-stack-md text-on-surface-variant text-xs leading-4 tracking-[0.05em] font-semibold">
          <button className="hover:text-primary transition-colors" type="button" onClick={() => setIsHelpOpen(true)}>
            Need Help?
          </button>
          {['Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
            <div key={item} className="contents">
              <span className="text-outline-variant">•</span>
              <a className="hover:text-primary transition-colors" href="#" onClick={(event) => event.preventDefault()}>
                {item}
              </a>
            </div>
          ))}
        </footer>
      </div>
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </main>
  );
}
