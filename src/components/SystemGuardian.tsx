import React, { useEffect, useState } from 'react';

export const SystemGuardian: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('System error:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-[#0B0E11] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-rose-500 text-2xl font-black mb-4">SYSTEM ERROR</div>
          <div className="text-gray-400 mb-6">An unexpected error occurred</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors"
          >
            RELOAD SYSTEM
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
