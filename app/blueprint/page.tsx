'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions, totalQuestions, pillars } from '@/lib/questions';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';

type AnswerValue = string | number | string[] | null;

export default function BlueprintPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];
  const currentPillar = pillars[currentQuestion.pillar];

  // Calculate which pillar we're in and progress within pillar
  const pillarQuestions = questions.filter(q => q.pillar === currentQuestion.pillar);
  const pillarStartIndex = questions.findIndex(q => q.pillar === currentQuestion.pillar);
  const pillarProgress = currentStep - pillarStartIndex + 1;
  const pillarTotal = pillarQuestions.length;

  const handleAnswerChange = (value: string | number | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // prevent double submit
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/results/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error('Error creating result:', data);
        alert(data?.error || 'Failed to save your answers. Please try again.');
        return;
      }

      // ✅ Accept both API shapes: { rid: 14 } OR { id: 14 }
      const rid = data?.rid ?? data?.id;

      if (rid === null || rid === undefined) {
        console.error('Missing rid/id returned from API:', data);
        alert('Something went wrong: result id missing. Please try again.');
        return;
      }

      const ridStr = String(rid);
      console.log('Created result rid:', ridStr);

      router.push(`/processing?rid=${encodeURIComponent(ridStr)}`);
      // If you want to skip processing:
      // router.push(`/results?rid=${encodeURIComponent(ridStr)}`);
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Overall Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
            <span>
              Question {currentStep + 1} of {totalQuestions}
            </span>
            <span>{Math.round(((currentStep + 1) / totalQuestions) * 100)}%</span>
          </div>
          <ProgressBar current={currentStep + 1} total={totalQuestions} />
        </div>

        {/* Pillar Indicator */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-xs sm:text-sm text-gray-400 mb-1">Current Pillar</div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">{currentPillar.label}</h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">{currentPillar.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
            <span>
              Pillar {pillarProgress} of {pillarTotal}
            </span>
            <span>•</span>
            <span>
              {currentQuestion.pillar === 'cognitive' && 'Pillar A'}
              {currentQuestion.pillar === 'reinforcement' && 'Pillar B'}
              {currentQuestion.pillar === 'asymmetry' && 'Pillar C'}
              {currentQuestion.pillar === 'activation' && 'Pillar D'}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="mt-8">
          <QuestionCard
            question={currentQuestion}
            value={answers[currentQuestion.id] ?? null}
            onChange={handleAnswerChange}
            onNext={handleNext}
            onBack={handleBack}
            canGoBack={currentStep > 0}
            isLast={currentStep === totalQuestions - 1}
          />
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-white text-xl">Processing your responses...</div>
          </div>
        )}
      </div>
    </div>
  );
}
