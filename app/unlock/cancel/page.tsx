'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function UnlockCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 text-6xl">❌</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Payment Cancelled
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Your payment was cancelled. Your results are still available, but they remain locked until you complete the purchase.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
