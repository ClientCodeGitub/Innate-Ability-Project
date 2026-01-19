import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
          Ready to Understand Your Innate Ability?
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Move from confused effort and forced discipline to clarity, alignment, and actionable next steps based on your behavioral patterns
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Link href="/blueprint" className="px-8 sm:px-10 py-4 sm:py-5 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-base sm:text-lg text-center">
            Start Your Journey
          </Link>
          <button className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-colors text-base sm:text-lg w-full sm:w-auto">
            Schedule a Call
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
