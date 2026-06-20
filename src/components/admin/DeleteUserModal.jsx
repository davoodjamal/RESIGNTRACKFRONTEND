import Icon from '../Icon';

export default function DeleteUserModal({ user, onClose, onDelete }) {
  const userId = user?.id || `RT-${(user?.email || user?.username || 'user').length.toString().padStart(4, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#131318]/60 backdrop-blur-md">
      <div className="bg-[#1f1f24] w-full max-w-md rounded-2xl shadow-2xl border border-[#c4c6cf] overflow-hidden transform transition-all animate-[fadeZoom_0.3s_ease-out]">
        <div className="p-6 pb-0 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#ffb4ab]/10 text-[#ffb4ab] rounded-full flex items-center justify-center mb-4">
            <Icon className="text-4xl">warning</Icon>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1e]">Delete User</h2>
        </div>
        <div className="p-6">
          <p className="text-[#44474e] text-center mb-6 leading-relaxed">
            Are you sure you want to permanently delete this user account? This action cannot be undone and will revoke all access immediately.
          </p>
          <div className="bg-[#f0f0f7] rounded-xl p-4 border border-[#c4c6cf] flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-[#3b494b] flex items-center justify-center font-bold text-[#535f70]">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className="font-bold text-[#1a1c1e]">{user?.username || 'Unknown'}</h4>
              <p className="text-sm text-[#535f70]">{user?.role || 'User'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-[#c4c6cf] text-[#44474e] font-bold hover:bg-[#3b494b] transition-all active:scale-95">
              Cancel
            </button>
            <button onClick={() => { onDelete?.(); onClose(); }} className="flex-1 px-4 py-3 rounded-xl bg-[#ffb4ab] text-white font-bold hover:brightness-110 shadow-lg shadow-[#ffb4ab]/20 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Icon className="text-sm">delete</Icon>Delete User
            </button>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#f0f0f7]/50 border-t border-[#c4c6cf] text-center">
          <p className="text-[10px] text-[#44474e] uppercase tracking-widest font-semibold">User ID: {userId}</p>
        </div>
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
