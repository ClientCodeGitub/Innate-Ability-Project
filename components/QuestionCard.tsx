import React from 'react';
import { Question } from '@/lib/questions';

interface QuestionCardProps {
  question: Question;
  value: string | number | string[] | null;
  onChange: (value: string | number | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isLast: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  onNext,
  onBack,
  canGoBack,
  isLast,
}) => {
  const handleNext = () => {
    if (question.required && (value === null || value === undefined || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value.trim() === ''))) {
      return; // Don't proceed if required question is not answered
    }
    onNext();
  };

  const renderInput = () => {
    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-2 sm:space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex items-start sm:items-center p-3 sm:p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  className="mt-1 sm:mt-0 mr-3 w-4 h-4 sm:w-5 sm:h-5 text-black bg-white border-gray-400 focus:ring-black flex-shrink-0"
                />
                <span className="text-black text-sm sm:text-base">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'multi':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2 sm:space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex items-start sm:items-center p-3 sm:p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedValues.includes(option.value as string)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selectedValues, option.value as string]);
                    } else {
                      onChange(selectedValues.filter(v => v !== option.value));
                    }
                  }}
                  className="mt-1 sm:mt-0 mr-3 w-4 h-4 sm:w-5 sm:h-5 text-black bg-white border-gray-400 focus:ring-black flex-shrink-0"
                />
                <span className="text-black text-sm sm:text-base">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        const scaleValue = typeof value === 'number' ? value : question.min || 1;
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.minLabel}</span>
              <span>{question.maxLabel}</span>
            </div>
            <input
              type="range"
              min={question.min || 1}
              max={question.max || 10}
              value={scaleValue}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="text-center text-2xl font-bold text-black">
              {scaleValue}
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:border-gray-400 focus:outline-none resize-none"
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 leading-tight">
        {question.question}
      </h2>
      {question.description && (
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
          {question.description}
        </p>
      )}
      <div className="mb-6 sm:mb-8">
        {renderInput()}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`px-5 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
            canGoBack
              ? 'border-2 border-black text-black hover:bg-black hover:text-white'
              : 'border-2 border-gray-300 text-gray-300 cursor-not-allowed'
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={question.required && (value === null || value === undefined || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === ''))}
          className={`px-5 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
            question.required && (value === null || value === undefined || 
              (Array.isArray(value) && value.length === 0) ||
              (typeof value === 'string' && value.trim() === ''))
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
