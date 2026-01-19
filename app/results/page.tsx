'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MethodologyDisclaimer from '@/components/MethodologyDisclaimer';
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
      <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mb-6" />
          <div className="text-xl font-semibold">Loading your blueprint...</div>
        </div>
      </div>
    );
  }

  if (error || !result || !result.computed_result) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || 'Result not found.'}</p>
          <button
            onClick={() => router.push('/blueprint')}
            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Blueprint
          </button>
        </div>
      </div>
    );
  }

  const computedResult = result.computed_result;
  const isPaid = !!result.is_paid;

  const getDirectionalConclusion = (resultData: ComputedResult) => {
    const secondaryNote = resultData.secondary
      ? ` A secondary tendency toward ${resultData.secondary.toLowerCase()} patterns appears when the context demands it.`
      : '';

    switch (resultData.archetype) {
      case 'Executor':
        return {
          corePattern:
            `A consistent pattern appears around action-first cognition: you tend to convert ambiguity into movement, then refine in real time.${secondaryNote}`,
          paths: [
            {
              title: 'Execution & Delivery Roles',
              body:
                'These paths reward decisive movement, ownership of outcomes, and rapid iteration. Your answers suggest you gain clarity through doing rather than extended analysis, which fits environments where shipping matters.',
            },
            {
              title: 'Operations & Field Enablement',
              body:
                'Roles that keep systems running under real constraints align with your action bias. You are likely to perform best when results are tangible and feedback is immediate.',
            },
            {
              title: 'Rapid Problem Response',
              body:
                'Contexts that involve time pressure or real-world stakes tend to activate your strengths. You appear to stabilize situations through execution rather than debate.',
            },
          ],
          latentTalents: [
            'Contextual decisiveness: the ability to choose a direction quickly when others stall becomes valuable as responsibility increases.',
            'Momentum creation: you generate movement that helps teams exit analysis loops and converge on action.',
          ],
          blockers: [
            'Environments dominated by prolonged planning without execution or clear deliverables.',
            'Cultures that penalize speed and reward only theoretical correctness.',
            'Roles with minimal feedback loops or delayed outcomes.',
          ],
          nextStep:
            'Run a small test: compare your energy and clarity in a fast-feedback task versus a long planning task, and note where your performance is measurably stronger.',
        };
      case 'Strategist':
        return {
          corePattern:
            `A consistent pattern appears around analytical synthesis: you tend to build clarity by structuring information before acting.${secondaryNote}`,
          paths: [
            {
              title: 'Strategy & Systems Planning',
              body:
                'These paths value depth of analysis, framing, and long-range thinking. Your answers indicate you perform best when you can map patterns and build coherent structures.',
            },
            {
              title: 'Research, Insight, and Forecasting',
              body:
                'Roles that reward careful reasoning and conceptual modeling align with your cognitive style. You appear to gain leverage by understanding why something works before moving.',
            },
            {
              title: 'Complex Problem Design',
              body:
                'Work that involves translating ambiguity into a structured plan fits your strengths. You are likely to thrive when complexity is high and speed is less important than accuracy.',
            },
          ],
          latentTalents: [
            'Systems mapping: the ability to surface root causes and non-obvious relationships becomes increasingly valuable with scale.',
            'Strategic restraint: knowing when not to act quickly can protect long-term outcomes.',
          ],
          blockers: [
            'High-interruption environments that prevent deep focus.',
            'Roles that reward speed over thoroughness or evidence.',
            'Contexts with unclear data and pressure to act without understanding.',
          ],
          nextStep:
            'Test your fit by allocating uninterrupted time to a complex problem and comparing the quality of your output to a rushed version.',
        };
      case 'Optimizer':
        return {
          corePattern:
            `A consistent pattern appears around refinement and systems improvement: you tend to notice gaps and optimize existing structures.${secondaryNote}`,
          paths: [
            {
              title: 'Process & Quality Improvement',
              body:
                'These paths center on reducing friction and improving reliability. Your answers suggest you gain traction by making what exists work better rather than starting from zero.',
            },
            {
              title: 'Operations Optimization',
              body:
                'Roles that reward efficiency, stability, and incremental gains align with your tendency to refine. You likely perform best when you can measure improvements over time.',
            },
            {
              title: 'Product or System Optimization',
              body:
                'Work that involves iterating on a system, product, or workflow fits your strengths. Your leverage appears to increase when there is a baseline to improve.',
            },
          ],
          latentTalents: [
            'Compounding refinement: small, consistent improvements add up and become a competitive advantage over time.',
            'Risk reduction: your attention to weak points helps prevent hidden failures later.',
          ],
          blockers: [
            'Constantly changing environments with no stable baseline.',
            'Pressure to create from scratch without time for iteration.',
            'Cultures that prioritize novelty over reliability.',
          ],
          nextStep:
            'Choose one recurring process and run a two-step improvement cycle; track what changes and how stability or output quality shifts.',
        };
      case 'Connector':
      default:
        return {
          corePattern:
            `A consistent pattern appears around coordination and social cognition: you tend to read dynamics and align people toward outcomes.${secondaryNote}`,
          paths: [
            {
              title: 'Partnerships & Stakeholder Alignment',
              body:
                'These paths reward relationship-building and multi-party coordination. Your answers suggest you create leverage by aligning perspectives and removing friction between groups.',
            },
            {
              title: 'Team Facilitation & Enablement',
              body:
                'Roles that focus on collaboration, communication, and shared goals fit your profile. You appear to perform best when outcomes depend on people moving together.',
            },
            {
              title: 'Community or Client-Centric Roles',
              body:
                'Work that depends on trust, engagement, and long-term rapport aligns with your strengths. You likely thrive where sustained relationships matter.',
            },
          ],
          latentTalents: [
            'Signal sensing: you notice subtle interpersonal dynamics that others miss, which helps prevent coordination breakdowns.',
            'Bridge building: you can translate between different priorities and languages across teams or stakeholders.',
          ],
          blockers: [
            'Isolated environments with limited collaboration or feedback.',
            'Cultures that treat coordination as secondary to individual output.',
            'Roles that minimize relationship-building or long-term stakeholder continuity.',
          ],
          nextStep:
            'Run a small coordination test: bring two viewpoints into a shared plan and observe where alignment produces measurable progress.',
        };
    }
  };

  const directional = getDirectionalConclusion(computedResult);

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

  const lockedClass = !isPaid ? 'blur-sm select-none' : '';

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Your Innate Ability Blueprint</h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Based on {totalQuestions} behavioral pattern indicators
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Home
            </button>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm max-w-2xl">
            These results reflect consistent behavioral tendencies identified through your responses. 
            They are not fixed traits, predictions, or deterministic labels. Patterns can vary across contexts and change over time.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Primary Archetype Card */}
        <div className="mb-8 sm:mb-12 p-6 sm:p-8 md:p-10 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 sm:mb-3">Your Dominant Innate Ability</div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-black break-words">
                {computedResult.archetype}
              </h2>
              {computedResult.secondary && (
                <div className="text-base sm:text-lg text-gray-700 mt-2 sm:mt-3">
                  Secondary tendency: <span className="font-semibold text-black">{computedResult.secondary}</span>
                </div>
              )}
            </div>
            <div className="hidden sm:flex flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-100 border-2 border-gray-300 items-center justify-center ml-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-600">
                {computedResult.archetype.charAt(0)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
            This functional archetype represents where your effort <span className="text-black font-medium">tends to multiply</span> based on 
            consistent behavioral patterns identified through your responses. It reflects tendencies, not fixed traits.
          </p>
        </div>

        {/* Evidence Section */}
        <section className={`mb-8 sm:mb-12 ${lockedClass}`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-black"></div>
            <h3 className="text-2xl sm:text-3xl font-bold">Evidence from Your Responses</h3>
          </div>
          <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm max-w-2xl">
            Based on consistent patterns in your responses, here's the evidence pointing to this archetype:
          </p>
          <div className="space-y-3 sm:space-y-4">
            {computedResult.evidence.map((item, index) => (
              <div 
                key={index} 
                className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-600">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-1">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Relief Framing */}
        <section className={`mb-8 sm:mb-12 p-6 sm:p-8 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 ${lockedClass}`}>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Understanding Your Patterns</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
            If certain paths have felt wrong or forced, it's likely because they don't align with your innate ability patterns:
          </p>
          <div className="space-y-3 sm:space-y-4">
            {computedResult.reliefFraming.map((item, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs text-gray-500">→</span>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-1">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Activation Conditions & Anti-Patterns Grid */}
        <div className={`grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 ${lockedClass}`}>
          {/* Activation Conditions */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-green-500"></div>
              <h3 className="text-xl sm:text-2xl font-bold">Activation Conditions</h3>
            </div>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
              Your innate ability tends to express itself most fully under these conditions:
            </p>
            <div className="space-y-2 sm:space-y-3">
              {computedResult.activationConditions.map((condition, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start gap-2 sm:gap-3"
                >
                  <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed flex-1">{condition}</p>
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
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
              These conditions tend to suppress or diminish your natural performance:
            </p>
            <div className="space-y-2 sm:space-y-3">
              {computedResult.antiPatterns.map((pattern, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-red-200 flex items-start gap-2 sm:gap-3"
                >
                  <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed flex-1">{pattern}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 7-Day Activation Plan */}
        <section className={`mb-8 sm:mb-12 ${lockedClass}`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-blue-500"></div>
            <h3 className="text-2xl sm:text-3xl font-bold">Your 7-Day Activation Plan</h3>
          </div>
          <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm max-w-2xl">
            Concrete steps to align with your innate ability patterns:
          </p>
          <div className="space-y-3 sm:space-y-4">
            {computedResult.sevenDayPlan.map((day, index) => (
              <div 
                key={index} 
                className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 inline-flex items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xs sm:text-sm px-3 py-1.5 sm:px-3.5 sm:py-2 min-w-[3rem] sm:min-w-[3.5rem] text-center leading-tight">
                    Day {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-1 pt-0 sm:pt-1">{day}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Disclaimer */}
        <div className={lockedClass}>
          <MethodologyDisclaimer />
        </div>

        {/* Directional Conclusion */}
        <section className={`mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-gray-200 ${lockedClass}`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-black"></div>
            <h3 className="text-2xl sm:text-3xl font-bold">Your Directional Conclusion</h3>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mb-6 sm:mb-8">
            Directional Conclusion – Your Most Promising Paths
          </p>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold mb-2">Core Strength Pattern</h4>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {directional.corePattern}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold mb-4">High-Probability Paths</h4>
              <div className="space-y-4">
                {directional.paths.map((path, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-gray-50">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Priority {idx + 1}
                    </div>
                    <h5 className="text-base sm:text-lg font-semibold text-black mb-2">{path.title}</h5>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{path.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold mb-3">Latent (Hidden) Talents</h4>
              <div className="space-y-2">
                {directional.latentTalents.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-gray-700"></div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold mb-3">Blocking Environments Warning</h4>
              <div className="space-y-2">
                {directional.blockers.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-gray-700"></div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold mb-2">Optional Grounded Next Step</h4>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {directional.nextStep}
              </p>
            </div>
          </div>
        </section>

        {/* Footer Actions removed */}
      </div>

      {!isPaid && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-1">Explore everything for $19</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Unlock the full blueprint, evidence mapping, and the complete directional conclusion.
                </p>
              </div>
              <button
                onClick={handleUnlock}
                disabled={isUnlocking}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isUnlocking
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isUnlocking ? 'Processing...' : 'Explore everything for $19'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
