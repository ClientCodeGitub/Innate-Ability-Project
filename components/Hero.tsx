import React from 'react';
import Link from "next/link";


const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white text-black px-4 sm:px-6 py-12 sm:py-0">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
          Innate Ability
          <span className="block text-gray-700">Blueprint</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-3 sm:mb-4 max-w-2xl mx-auto px-2">
          A science-informed diagnostic process to understand your behavioral patterns and identify where your effort naturally multiplies
        </p>
        <p className="text-base sm:text-lg text-gray-500 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Not a personality test. Not clinical. A structured approach to clarity, alignment, and actionable next steps.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Link href="/blueprint" className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center text-sm sm:text-base">
            Start the Blueprint
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
