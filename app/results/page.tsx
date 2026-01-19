'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MethodologyDisclaimer from '@/components/MethodologyDisclaimer';
import PaywallOverlay from '@/components/PaywallOverlay';
import { ComputedResult } from '@/lib/scoring';
import { totalQuestions } from '@/lib/questions';

type ResultRow = {
  id: number;
  answers: Record<string, any>;
  computed_result: ComputedResult;
  is_paid: boolean;
  unlocked_at?: string | null;
  created_at?: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rid = useMemo(() => {
    const ridParam = searchParams.get('rid');
    return ridParam && ridParam.length > 0 ? ridParam : null;
  }, [searchParams]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultRow | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    if (!rid) {
      setLoading(false);
      setError('Result id missing. Please try again.');
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/results/get?rid=${encodeURIComponent(rid)}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || 'Failed to load results');
          setLoading(false);
          return;
        }

        setResult(data.result);
        setLoading(false);
      } catch (e) {
        setError('Network error. Please try again.');
        setLoading(false);
      }
    };

    run();
  }, [rid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mb-6" />
          <div className="text-xl font-semibold">Loading your blueprint...</div>
        </div>
      </div>
    );
  }

  if (error || !result || !result.computed_result) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-6">{error || 'Result not found.'}</p>
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

  const computedResult = result.computed_result;
  const isPaid = !!result.is_paid;

  const handleUnlock = async () => {
    if (!rid) return;

    setIsUnlocking(true);
    try {
      const response = await fetch('/api/lemon/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rid }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        console.error('Checkout error:', data);
        alert(data?.error || 'Failed to start checkout. Please try again.');
        setIsUnlocking(false);
        return;
      }

      if (!data?.url) {
        alert('Checkout URL missing. Please try again.');
        setIsUnlocking(false);
        return;
      }

      window.location.href = data.url;
    } catch (e) {
      console.error('Checkout error:', e);
      alert('An error occurred. Please try again.');
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header Section */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Your Innate Ability Blueprint</h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Based on {totalQuestions} behavioral pattern indicators
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              Home
            </button>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl">
            These results reflect consistent behavioral tendencies identified through your responses. 
            They are not fixed traits, predictions, or deterministic labels. Patterns can vary across contexts and change over time.
          </p>
        </div>
      </div>

      <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${!isPaid ? 'blur-sm select-none pointer-events-none' : ''}`}>
        {/* Primary Archetype Card */}
        <div className="mb-8 sm:mb-12 p-6 sm:p-8 md:p-10 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl border-2 border-gray-800 shadow-xl">
          <div className="flex items-start justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2 sm:mb-3">Your Dominant Innate Ability</div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent break-words">
                {computedResult.archetype}
              </h2>
              {computedResult.secondary && (
                <div className="text-base sm:text-lg text-gray-300 mt-2 sm:mt-3">
                  Secondary tendency: <span className="font-semibold text-white">{computedResult.secondary}</span>
                </div>
              )}
            </div>
            <div className="hidden sm:flex flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-800 border-2 border-gray-700 items-center justify-center ml-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-400">
                {computedResult.archetype.charAt(0)}
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
            This functional archetype represents where your effort <span className="text-white font-medium">tends to multiply</span> based on 
            consistent behavioral patterns identified through your responses. It reflects tendencies, not fixed traits.
          </p>
        </div>

        {/* Evidence Section */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-white"></div>
            <h3 className="text-2xl sm:text-3xl font-bold">Evidence from Your Responses</h3>
          </div>
          <p className="text-gray-400 mb-4 sm:mb-6 text-xs sm:text-sm max-w-2xl">
            Based on consistent patterns in your responses, here's the evidence pointing to this archetype:
          </p>
          <div className="space-y-3 sm:space-y-4">
            {computedResult.evidence.map((item, index) => (
              <div 
                key={index} 
                className="p-4 sm:p-6 bg-gray-900 rounded-lg sm:rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-400">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed flex-1">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Relief Framing */}
        <section className="mb-8 sm:mb-12 p-6 sm:p-8 bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-800">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Understanding Your Patterns</h3>
          <p className="text-gray-400 mb-4 sm:mb-6 text-xs sm:text-sm">
            If certain paths have felt wrong or forced, it's likely because they don't align with your innate ability patterns:
          </p>
          <div className="space-y-3 sm:space-y-4">
            {computedResult.reliefFraming.map((item, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-950 rounded-lg border border-gray-800">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                  <span className="text-xs text-gray-400">→</span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed flex-1">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Activation Conditions & Anti-Patterns Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Activation Conditions */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-green-500"></div>
              <h3 className="text-xl sm:text-2xl font-bold">Activation Conditions</h3>
            </div>
            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
              Your innate ability tends to express itself most fully under these conditions:
            </p>
            <div className="space-y-2 sm:space-y-3">
              {computedResult.activationConditions.map((condition, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-800 flex items-start gap-2 sm:gap-3"
                >
                  <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed flex-1">{condition}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Anti-Patterns */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-red-500"></div>
              <h3 className="text-xl sm:text-2xl font-bold">What Suppresses Your Ability</h3>
            </div>
            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
              These conditions tend to suppress or diminish your natural performance:
            </p>
            <div className="space-y-2 sm:space-y-3">
              {computedResult.antiPatterns.map((pattern, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-red-900/30 flex items-start gap-2 sm:gap-3"
                >
                  <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed flex-1">{pattern}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 7-Day Activation Plan */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-blue-500"></div>
            <h3 className="text-2xl sm:text-3xl font-bold">Your 7-Day Activation Plan</h3>
          </div>
          <p className="text-gray-400 mb-4 sm:mb-6 text-xs sm:text-sm max-w-2xl">
            Concrete steps to align with your innate ability patterns:
          </p>
          <div className="space-y-3 sm:space-y-4">
            {computedResult.sevenDayPlan.map((day, index) => (
              <div 
                key={index} 
                className="p-4 sm:p-6 bg-gray-900 rounded-lg sm:rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                    <span className="text-sm sm:text-lg font-bold text-white">Day {index + 1}</span>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed flex-1 pt-1 sm:pt-2">{day}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Disclaimer */}
        <MethodologyDisclaimer />

        {/* Footer Actions */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => router.push('/blueprint')}
            className="px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-lg hover:bg-gray-900 hover:border-gray-600 transition-colors w-full sm:w-auto"
          >
            Take Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
          >
            Return Home
          </button>
        </div>
      </div>

      {!isPaid && (
        <PaywallOverlay
          onUnlock={handleUnlock}
          isLoading={isUnlocking}
          buttonLabel="Pay to Unlock"
        />
      )}
    </div>
  );
}
