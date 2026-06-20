import Icon from './Icon';

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#191c1e]/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f1f24] p-10 rounded-[24px] shadow-2xl max-w-md w-full relative border border-[#3b494b] animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 text-[#b9cacb] hover:text-[#00dbe9] transition-colors p-1 bg-[#2a292f] rounded-full hover:bg-[#2a292f]">
          <Icon>close</Icon>
        </button>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
            <Icon className="text-[40px]">support_agent</Icon>
          </div>
          <h3 className="text-3xl font-black text-[#e4e1e9] tracking-tight">Need Help?</h3>
          <p className="text-base font-medium text-[#b9cacb] leading-relaxed">If you're experiencing issues with the offboarding process, please contact your HR administrator.</p>
          <div className="w-full space-y-3 pt-6">
            <div className="flex items-center gap-4 p-5 bg-[#2a292f] rounded-xl border border-[#3b494b]">
              <Icon className="text-[#00dbe9] text-[24px]">mail</Icon>
              <span className="text-base font-bold text-[#e4e1e9]">admin@resigntrack.com</span>
            </div>
            <div className="flex items-center gap-4 p-5 bg-[#2a292f] rounded-xl border border-[#3b494b]">
              <Icon className="text-[#00dbe9] text-[24px]">call</Icon>
              <span className="text-base font-bold text-[#e4e1e9]">+1 (555) 123-4567</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-[#76777d] pt-4 uppercase tracking-wider">Available Mon-Fri, 9AM-6PM EST</p>
        </div>
      </div>
    </div>
  );
}
