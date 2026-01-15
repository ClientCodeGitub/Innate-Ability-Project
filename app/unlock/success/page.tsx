'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function UnlockSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rid = searchParams.get('rid');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!rid) {
      router.push('/');
      return;
    }

    // Poll for unlock status
    const checkUnlock = async () => {
      try {
        const response = await fetch(`/api/results/get?rid=${rid}`);
        if (response.ok) {
          const data = await response.json();
          if (data.unlocked) {
            setIsUnlocked(true);
            setIsChecking(false);
            // Redirect to results page after a short delay
            setTimeout(() => {
              router.push(`/results?rid=${rid}`);
            }, 2000);
          } else {
            // Continue polling
            setTimeout(checkUnlock, 2000);
          }
        }
      } catch (error) {
        console.error('Error checking unlock status:', error);
        setIsChecking(false);
      }
    };

    // Start polling after a short delay
    const timeout = setTimeout(checkUnlock, 1000);
    return () => clearTimeout(timeout);
  }, [rid, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {isChecking ? (
          <>
            <div className="mb-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Payment received, unlocking...
            </h1>
            <p className="text-gray-400 text-lg">
              Please wait while we verify your payment and unlock your results.
            </p>
          </>
        ) : isUnlocked ? (
          <>
            <div className="mb-8 text-6xl">✅</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Success! Your results are unlocked.
            </h1>
            <p className="text-gray-400 text-lg">
              Redirecting you to your results...
            </p>
          </>
        ) : (
          <>
            <div className="mb-8 text-6xl">⏳</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Payment received
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              We're processing your payment. This may take a few moments.
            </p>
            <button
              onClick={() => rid && router.push(`/results?rid=${rid}`)}
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Check Results Page
            </button>
          </>
        )}
      </div>
    </div>
  );
}
