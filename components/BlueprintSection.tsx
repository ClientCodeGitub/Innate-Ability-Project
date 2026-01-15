import React from 'react';

const BlueprintSection = () => {
  const pillars = [
    {
      letter: 'A',
      title: 'Cognitive–Temperamental Predispositions',
      description: 'Understanding how you naturally process information and respond to cognitive demands, based on individual differences psychology.',
    },
    {
      letter: 'B',
      title: 'Early Reinforcement & Conditioning',
      description: 'Identifying patterns from your formative experiences that shaped your behavioral tendencies, grounded in behavioral genetics research.',
    },
    {
      letter: 'C',
      title: 'Effort Asymmetry (Leverage Detection)',
      description: 'Mapping where your effort naturally multiplies versus where it feels forced, informed by Flow Theory and effort asymmetry research.',
    },
    {
      letter: 'D',
      title: 'Activation Conditions',
      description: 'Determining the conditions under which your innate ability expresses itself most fully, based on Trait Activation Theory.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 sm:mb-4">
            The Diagnostic Framework
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
            A science-informed process structured across four pillars to identify consistent behavioral patterns
          </p>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto px-2">
            Not a personality test. A structured diagnostic approach grounded in established psychological research.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <div key={index} className="bg-white p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3 sm:mb-4">
                <div className="text-3xl sm:text-4xl font-bold text-gray-800 mr-3 sm:mr-4">Pillar {pillar.letter}</div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">{pillar.title}</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlueprintSection;
