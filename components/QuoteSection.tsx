import React from 'react';

const QuoteSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="border-l-4 border-gray-300 pl-4 sm:pl-6 md:pl-8">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 mb-4 sm:mb-6 italic leading-relaxed">
            "When we are in flow, we are not bored, and we are not anxious. We are not questioning ourselves. We are simply doing."
          </blockquote>
          <cite className="text-base sm:text-lg text-gray-600 font-semibold not-italic">
            — Mihaly Csikszentmihalyi, Flow Theory
          </cite>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
