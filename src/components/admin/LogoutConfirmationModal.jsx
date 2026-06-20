import Icon from '../Icon';

export default function LogoutConfirmationModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#191c1e]/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f1f24] p-10 rounded-[24px] shadow-2xl max-w-sm w-full relative border border-[#3b494b] animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#b9cacb] hover:text-[#00dbe9] transition-colors p-1 bg-[#2a292f] rounded-full"
          aria-label="Close logout confirmation"
        >
          <Icon>close</Icon>
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="w-20 h-20 rounded-full bg-[#ffe082]/30 flex items-center justify-center text-[#5a4300] mb-2">
            <Icon className="text-[40px]">lock</Icon>
          </div>

          <h3 className="text-2xl font-black text-[#e4e1e9] tracking-tight">Logout Account</h3>
          <p className="text-sm font-medium text-[#b9cacb] leading-relaxed px-2">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </p>

          <div className="w-full flex flex-col gap-3 pt-6">
            <button
              onClick={onConfirm}
              className="w-full py-3.5 px-4 bg-[#00dbe9] text-white font-bold text-base rounded-xl shadow-md hover:bg-[#00dbe9]/90 transition-all"
            >
              Logout Now
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-transparent text-[#b9cacb] font-bold text-base rounded-xl hover:bg-[#2a292f] transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs font-semibold text-[#76777d] pt-4 flex items-center justify-center gap-1.5 uppercase tracking-wider">
            <Icon className="text-[14px]">security</Icon>
            Your session will be securely ended.
          </p>
        </div>
      </div>
    </div>
  );
}
