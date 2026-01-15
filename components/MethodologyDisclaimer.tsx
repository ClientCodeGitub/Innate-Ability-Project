import React from 'react';

const MethodologyDisclaimer = () => {
  return (
    <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-gray-900 rounded-lg border border-gray-800">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">Methodology & Scientific Basis</h3>
      
      <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Individual Differences Psychology</h4>
          <p>
            This diagnostic process is grounded in research on stable behavioral and cognitive variation between individuals. 
            It differentiates between ability expression (how ability manifests) versus ability level (how much ability exists), 
            drawing on key concepts from intelligence research including fluid versus crystallized reasoning patterns.
          </p>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Behavioral Genetics (Non-Deterministic Framing)</h4>
          <p>
            Research indicates that genetic predispositions influence ease, energy regulation, and effort asymmetry—where 
            equal effort produces unequal outcomes across individuals. This framework emphasizes tendencies, not destiny. 
            Behavioral patterns can change over time and vary across contexts.
          </p>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Trait Activation Theory</h4>
          <p>
            Traits express differently depending on situational cues. Your innate ability tends to emerge under specific 
            environmental conditions. The diagnostic identifies these activation conditions rather than assuming fixed 
            expression across all contexts.
          </p>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Self-Determination Theory (SDT)</h4>
          <p>
            Autonomy, competence, and relatedness function as motivation regulators. Misalignment between your innate 
            ability patterns and your environment tends to suppress performance—not due to lack of discipline, but 
            due to misalignment with natural tendencies.
          </p>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Flow Theory</h4>
          <p>
            Engagement tends to occur when challenge matches skill level. This diagnostic focuses on identifying 
            the "type of difficulty" that pulls you in, rather than simply measuring enjoyment or preference.
          </p>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Effort Asymmetry Principle</h4>
          <p>
            Equal effort produces unequal outcomes across individuals. Your innate ability shows where effort tends 
            to compound faster—where the same investment yields greater returns. This is not about talent versus 
            effort, but about identifying your natural leverage points.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-400 italic">
            <strong className="text-gray-300">Important:</strong> This product is science-informed and diagnostic in nature. 
            It does not provide clinical, medical, or psychological diagnoses. Results reflect behavioral tendencies 
            identified through your responses, not fixed traits or predictions. Use these insights as a starting point 
            for self-understanding and alignment, not as definitive labels or limitations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MethodologyDisclaimer;
