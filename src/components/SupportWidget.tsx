import React, { useState } from 'react';

export const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support message:', message);
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-2xl flex items-center justify-center text-white font-black transition-all z-50"
      >
        ?
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-[#181C25] border border-[#2B3139] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-[#2B3139]">
            <div className="font-black text-sm">SUPPORT</div>
            <div className="text-xs text-gray-400 mt-1">How can we help?</div>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full h-32 bg-[#0B0E11] border border-[#2B3139] rounded-xl p-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <button
              type="submit"
              className="w-full mt-3 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-sm transition-colors"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      )}
    </>
  );
};
