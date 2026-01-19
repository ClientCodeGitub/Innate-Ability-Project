'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmailCapturePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // rid is always a string from the URL. We'll also compute a safe number version.
  const ridStr = useMemo(() => {
    const ridParam = searchParams.get('rid');
    return ridParam && ridParam.length > 0 ? ridParam : null;
  }, [searchParams]);

  const ridNumber = useMemo(() => {
    if (!ridStr) return null;
    const n = Number(ridStr);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  }, [ridStr]);

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ridStr || !ridNumber) {
      setError('Invalid result id. Please go back and submit again.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid email.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/results/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ Send rid as a NUMBER so Zod z.number() won’t reject it
        body: JSON.stringify({ rid: ridNumber, email: email.trim() }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || 'Failed to save your email. Please try again.');
        return;
      }

      // Go to results page using the original string rid for URL cleanliness
      router.push(`/results?rid=${encodeURIComponent(ridStr)}`);
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If rid is missing OR invalid, show the fallback UI
  if (!ridStr || !ridNumber) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-xl">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-6">
            Result id missing. Please go back and submit again.
          </p>
          <button
            onClick={() => router.push('/blueprint')}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Blueprint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Before we show your results
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-6">
          Enter your email so we can deliver your blueprint and follow up with your results.
          You can continue regardless of payment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
              required
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
              isSubmitting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Continue to Results'}
          </button>

          <p className="text-xs text-gray-500">
            This is not a clinical assessment. Results are science-informed and reflect tendencies,
            not fixed traits.
          </p>
        </form>
      </div>
    </div>
  );
}
