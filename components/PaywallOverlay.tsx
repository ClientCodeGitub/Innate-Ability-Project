import React from 'react';

interface PaywallOverlayProps {
  onUnlock: () => void;
  isLoading?: boolean;
  buttonLabel?: string;
}

const PaywallOverlay: React.FC<PaywallOverlayProps> = ({ onUnlock, isLoading = false, buttonLabel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg max-w-2xl w-full p-8 md:p-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Your blueprint is ready.
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Unlock your full innate ability map and exact next steps based on behavioral pattern analysis.
        </p>
        
        <div className="text-left mb-8 space-y-4">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-white mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-lg">
              Your dominant innate ability archetype (based on consistent behavioral patterns)
            </span>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-white mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-lg">
              Evidence from your responses (why this archetype fits you)
            </span>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-white mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-lg">
              Activation conditions (where your ability shows up) and anti-patterns (what suppresses it)
            </span>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-white mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-lg">
              A concrete 7-day activation plan tailored to your patterns
            </span>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-5xl font-bold text-white mb-2">$19</div>
          <div className="text-gray-400">one-time unlock</div>
        </div>

        <button
          onClick={onUnlock}
          disabled={isLoading}
          className={`w-full px-8 py-4 bg-white text-black font-semibold rounded-lg text-lg transition-colors ${
            isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-200'
          }`}
        >
          {isLoading ? 'Processing...' : (buttonLabel || 'Unlock My Results')}
        </button>
      </div>
    </div>
  );
};

export default PaywallOverlay;
