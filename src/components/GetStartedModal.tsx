import React, { useState } from 'react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative w-full max-w-md rounded-3xl p-6 border shadow-2xl z-10 ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#787b86] hover:text-[#131722]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#2962ff] to-[#7c3aed] text-white mb-3 shadow-md">
            <svg className="h-8 w-auto text-white" fill="currentColor" viewBox="0 0 36 28">
              <rect height="28" rx="2" width="8" x="0" y="0"></rect>
              <path d="M12 0h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H12V0z"></path>
              <path d="M26 12h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8V12z"></path>
              <path d="M12 20h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8v-8z"></path>
            </svg>
          </div>

          <h2 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
            Markets, everywhere
          </h2>
          <p className="text-xs text-[#787b86] mt-1 max-w-xs mx-auto">
            Experience next-level market analysis, real-time quotes, and cloud paper trading.
          </p>
        </div>

        {/* Feature bullets */}
        <div className="space-y-2.5 mb-5 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-[#089981]/15 text-[#089981] flex items-center justify-center shrink-0">
              ✓
            </div>
            <span><strong>Real-time data:</strong> Global indices, US equities, crypto & forex</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-[#089981]/15 text-[#089981] flex items-center justify-center shrink-0">
              ✓
            </div>
            <span><strong>Interactive Charts:</strong> Candlestick & line modes with live hover</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-[#089981]/15 text-[#089981] flex items-center justify-center shrink-0">
              ✓
            </div>
            <span><strong>$100,000 Paper Trading:</strong> Practice trading risk-free</span>
          </div>
        </div>

        {success ? (
          <div className="p-4 bg-[#089981]/15 text-[#089981] rounded-xl text-center font-bold text-sm">
            🎉 Welcome! Your Pro Paper Account is ready.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to activate free account"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#2962ff] ${
                  isDark ? 'bg-[#131722] border-[#2a2e39] text-white' : 'bg-gray-50 border-[#e0e3eb]'
                }`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#2962ff] to-[#7c3aed] shadow-md hover:opacity-95 active:scale-98 transition-all cursor-pointer"
            >
              Get started for free
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
