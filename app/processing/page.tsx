'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const messages = [
  'Analyzing behavioral patterns...',
  'Mapping activation conditions...',
  'Identifying consistent tendencies...',
  'Computing your innate ability profile...',
  'Finalizing your blueprint...',
];

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const rid = useMemo(() => {
    const ridParam = searchParams.get('rid');
    return ridParam && ridParam.length > 0 ? ridParam : null;
  }, [searchParams]);

  useEffect(() => {
    if (!rid) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 1000);

    const timeout = setTimeout(() => {
      router.push(`/results?rid=${encodeURIComponent(String(rid))}`);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [rid, router]);

  if (!rid) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-6">
            Result id missing. Please go back and submit again.
          </p>
          <button
            onClick={() => router.push('/blueprint')}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg"
          >
            Back to Blueprint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-white"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
          {messages[currentMessageIndex]}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg px-2">
          Processing your responses through our diagnostic framework...
        </p>
      </div>
    </div>
  );
}
