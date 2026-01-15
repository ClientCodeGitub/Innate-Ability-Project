import { questions, pillars } from './questions';

export type Archetype = 'Executor' | 'Strategist' | 'Optimizer' | 'Connector';

export interface ComputedResult {
  archetype: Archetype;
  secondary?: Archetype;
  scores: Record<Archetype, number>;
  weightedScores: Record<Archetype, number>;
  pillarScores: Record<Pillar, Record<Archetype, number>>;
  evidence: string[]; // Explicitly reference answer patterns
  reliefFraming: string[]; // Explain why certain paths felt wrong
  activationConditions: string[]; // Where ability naturally shows up
  antiPatterns: string[]; // What suppresses or drains this ability
  sevenDayPlan: string[];
}

interface Answers {
  [questionId: string]: string | number | string[] | null;
}

type Pillar = 'cognitive' | 'reinforcement' | 'asymmetry' | 'activation';

// Map each answer value directly to archetype
const answerToArchetype: Record<string, Archetype> = {
  'executor': 'Executor',
  'strategist': 'Strategist',
  'optimizer': 'Optimizer',
  'connector': 'Connector',
};

// Evidence mapping - references specific answer patterns
const evidenceMap: Record<Archetype, Record<string, string>> = {
  Executor: {
    'q1': 'Your response to unexpected breakdowns shows an action-first approach, indicating execution-oriented cognitive processing',
    'q2': 'Your learning pattern favors immediate experimentation over extended study, suggesting practical cognition',
    'q3': 'Your tendency to act and adjust in unfamiliar situations reflects an execution-oriented predisposition',
    'q4': 'Your trust in decisions based on real-world action indicates a preference for tangible outcomes',
    'q9': 'Your faster learning in practical execution compared to others suggests effort asymmetry favoring action',
    'q10': 'Your natural ability to act under pressure without training indicates an innate execution tendency',
    'q11': 'Your impatience explaining "how to start" suggests this comes naturally to you',
    'q12': 'Your pattern of quick results when pushing beyond comfort indicates execution leverage',
    'q13': 'Your best performance when acting independently aligns with execution activation conditions',
    'q14': 'Time pressure sharpening your performance indicates execution-oriented activation',
  },
  Strategist: {
    'q1': 'Your response to breakdowns shows analytical processing, indicating strategic cognitive predisposition',
    'q2': 'Your preference for understanding theory before practice suggests strategic information processing',
    'q3': 'Your tendency to observe and map patterns in unfamiliar situations reflects analytical cognition',
    'q4': 'Your trust in decisions based on logical structure indicates strategic thinking preference',
    'q9': 'Your faster learning in abstract concepts suggests effort asymmetry favoring analysis',
    'q10': 'Your natural ability to see structure without training indicates strategic predisposition',
    'q11': 'Your impatience explaining "why it works" suggests analytical thinking comes naturally',
    'q12': 'Your pattern of clarity emerging when pushing beyond comfort indicates strategic leverage',
    'q13': 'Your best performance when solving complex problems aligns with strategic activation conditions',
    'q14': 'Cognitive challenge sharpening your performance indicates strategic-oriented activation',
  },
  Optimizer: {
    'q1': 'Your response to breakdowns shows systems thinking, indicating optimization-oriented cognitive processing',
    'q2': 'Your preference for improving existing examples suggests optimization cognition',
    'q3': 'Your tendency to look for efficiency gains in unfamiliar situations reflects optimization predisposition',
    'q4': 'Your trust in decisions based on optimization and refinement indicates systems thinking preference',
    'q9': 'Your faster learning in system improvement suggests effort asymmetry favoring optimization',
    'q10': 'Your natural ability to refine details without training indicates optimization tendency',
    'q11': 'Your impatience explaining "how to improve it" suggests optimization comes naturally',
    'q12': 'Your pattern of refinement when pushing beyond comfort indicates optimization leverage',
    'q13': 'Your best performance when improving existing work aligns with optimization activation conditions',
    'q14': 'Precision standards sharpening your performance indicates optimization-oriented activation',
  },
  Connector: {
    'q1': 'Your response to breakdowns shows coordination preference, indicating social-cognitive processing',
    'q2': 'Your preference for explaining to others suggests social-cognitive learning style',
    'q3': 'Your tendency to read social dynamics in unfamiliar situations reflects coordination predisposition',
    'q4': 'Your trust in decisions based on group alignment indicates social-cognitive preference',
    'q9': 'Your faster learning in navigating people suggests effort asymmetry favoring coordination',
    'q10': 'Your natural ability to read situations without training indicates connector tendency',
    'q11': 'Your impatience explaining "how people react" suggests social cognition comes naturally',
    'q12': 'Your pattern of broader impact when pushing beyond comfort indicates coordination leverage',
    'q13': 'Your best performance when coordinating others aligns with connector activation conditions',
    'q14': 'Social responsibility sharpening your performance indicates connector-oriented activation',
  },
};

const reliefFramingMap: Record<Archetype, string[]> = {
  Executor: [
    'If extended planning or analysis paralysis has felt wrong, it\'s because your ability tends to activate through action, not through extended contemplation',
    'If you\'ve struggled with abstract discussions without concrete outcomes, it\'s because your ability requires tangible results to express itself',
    'If pressure and deadlines have felt energizing rather than draining, it\'s because these conditions tend to activate your execution-oriented ability',
    'If being asked to wait or delay action has felt frustrating, it\'s because your ability tends to express itself through immediate execution',
  ],
  Strategist: [
    'If being pushed to act quickly without analysis has felt wrong, it\'s because your ability tends to require time to process and synthesize',
    'If constant interruptions or pressure to execute without understanding has felt frustrating, it\'s because your ability tends to activate through deep thinking',
    'If abstract concepts and theory have felt more natural than concrete tasks, it\'s because your cognitive predisposition tends to favor analytical processing',
    'If you\'ve struggled in environments that value speed over depth, it\'s because your ability tends to express itself through comprehensive understanding',
  ],
  Optimizer: [
    'If chaotic environments or constant change have felt wrong, it\'s because your ability tends to require stable systems to improve',
    'If being asked to create from scratch rather than improve what exists has felt frustrating, it\'s because your ability tends to activate through refinement',
    'If you\'ve found yourself naturally noticing inefficiencies and wanting to fix them, it\'s because optimization tends to be your natural leverage point',
    'If environments that don\'t allow time for refinement have felt draining, it\'s because your ability tends to express itself through iterative improvement',
  ],
  Connector: [
    'If isolated work or lack of social interaction has felt wrong, it\'s because your ability tends to activate through coordination and collaboration',
    'If environments that don\'t allow for relationship building have felt frustrating, it\'s because your ability tends to require social dynamics to express itself',
    'If you\'ve found yourself naturally facilitating group outcomes, it\'s because coordination tends to be where your effort multiplies',
    'If tasks requiring individual contribution without coordination needs have felt draining, it\'s because your ability tends to express itself through social interaction',
  ],
};

const activationConditionsMap: Record<Archetype, string[]> = {
  Executor: [
    'Clear objectives with defined parameters and immediate feedback',
    'Time pressure and deadlines that create urgency without overwhelming complexity',
    'Environments where action and results are valued over extended planning',
    'Tasks that allow for decisive execution and tangible outcomes',
    'Independent work with autonomy to act quickly',
  ],
  Strategist: [
    'Extended periods of uninterrupted focus for deep analysis',
    'Complex problems requiring synthesis of multiple information sources',
    'Environments that value strategic thinking and comprehensive understanding',
    'Time and space to develop thorough approaches before execution',
    'Challenges that require logical structure and pattern recognition',
  ],
  Optimizer: [
    'Stable systems or processes that allow for iterative improvement',
    'Environments where refinement and efficiency are valued',
    'Clear parameters within which to optimize and enhance',
    'Opportunities to improve existing structures rather than create from scratch',
    'Precision standards and quality-focused contexts',
  ],
  Connector: [
    'Dynamic social environments with opportunities for collaboration',
    'Situations requiring coordination of multiple people or groups',
    'Environments that value relationship building and team facilitation',
    'Contexts where group outcomes depend on effective coordination',
    'Social responsibility and interpersonal challenge',
  ],
};

const antiPatternsMap: Record<Archetype, string[]> = {
  Executor: [
    'Endless planning without action or analysis paralysis',
    'Abstract discussions without concrete outcomes or deliverables',
    'Lack of clear objectives or constantly shifting parameters',
    'Environments that penalize quick action in favor of extended contemplation',
    'Pressure to delay execution for further analysis',
  ],
  Strategist: [
    'Constant interruptions or pressure to act quickly without analysis',
    'Lack of information or resources needed for comprehensive understanding',
    'Environments that value speed over depth of thinking',
    'Tasks that require immediate execution without strategic consideration',
    'Pressure to skip analysis and jump to action',
  ],
  Optimizer: [
    'Chaotic systems or constant change without stability',
    'Pressure to create from scratch rather than improve existing structures',
    'Environments that don\'t allow time for refinement and iteration',
    'Lack of clear systems or processes to optimize',
    'Pressure to accept "good enough" without improvement opportunities',
  ],
  Connector: [
    'Isolated work without opportunities for collaboration',
    'Environments that don\'t value relationship building or social coordination',
    'Lack of opportunities to facilitate group outcomes',
    'Tasks that require individual contribution without coordination needs',
    'Pressure to work independently without social interaction',
  ],
};

const sevenDayPlanMap: Record<Archetype, string[]> = {
  Executor: [
    'Day 1: Identify one clear objective you can execute today. Complete it fully, then notice what made it feel natural versus forced',
    'Day 2: Create a list of 3-5 concrete tasks with clear parameters. Execute them under self-imposed time constraints and observe your response',
    'Day 3: Notice where time pressure or deadlines actually help you perform better. Document these activation conditions',
    'Day 4: Identify one area where you\'ve been overthinking. Take decisive action instead and observe the difference in effort and outcome',
    'Day 5: Set up your environment to minimize planning time and maximize execution time. Notice how this affects your energy',
    'Day 6: Practice making quick decisions on smaller items. Notice how this feels versus extended deliberation',
    'Day 7: Review the week. Where did action feel effortless? Where did it feel forced? Use this pattern to guide your next steps',
  ],
  Strategist: [
    'Day 1: Block 2-3 hours of uninterrupted time for deep thinking on a complex problem. Notice how this feels versus rushed analysis',
    'Day 2: Gather information from multiple sources on a topic you\'re exploring. Synthesize the key insights without pressure to act',
    'Day 3: Create a comprehensive analysis or strategic plan. Allow yourself time to think it through fully before execution',
    'Day 4: Identify where you\'ve been rushed into action. What would better understanding have enabled? Document the difference',
    'Day 5: Set up your environment to protect deep thinking time. Minimize interruptions and distractions',
    'Day 6: Practice explaining your strategic thinking to others. Notice how articulation deepens understanding',
    'Day 7: Review the week. Where did analysis feel natural? Where did it feel forced? Use this pattern to guide your next steps',
  ],
  Optimizer: [
    'Day 1: Identify one system or process you interact with regularly. Map out how it currently works and where inefficiencies exist',
    'Day 2: Find 3 specific inefficiencies or areas for improvement in that system. Document them without pressure to fix immediately',
    'Day 3: Propose one concrete improvement. Test it and measure the impact. Notice how refinement feels',
    'Day 4: Look for patterns in your improvements. What types of optimization come most naturally to you?',
    'Day 5: Set up your environment to allow for iterative refinement. Create space for improvement cycles without pressure',
    'Day 6: Practice explaining your optimization thinking to others. Notice how this clarifies your approach',
    'Day 7: Review the week. Where did improvement feel effortless? Where did it feel forced? Use this pattern to guide your next steps',
  ],
  Connector: [
    'Day 1: Identify one situation where coordination or facilitation would improve outcomes. Notice what this requires and how it feels',
    'Day 2: Reach out to 2-3 people you haven\'t connected with recently. Focus on understanding their perspectives without agenda',
    'Day 3: Facilitate a conversation or meeting. Notice how coordination feels when it\'s your natural role versus forced',
    'Day 4: Identify where you\'ve been working in isolation. What would collaboration enable? Document the difference',
    'Day 5: Set up your environment to maximize social interaction and coordination opportunities',
    'Day 6: Practice bringing people together around shared goals. Notice how this amplifies outcomes',
    'Day 7: Review the week. Where did coordination feel natural? Where did it feel forced? Use this pattern to guide your next steps',
  ],
};

export function computeResult(answers: Answers): ComputedResult {
  // Initialize scores per pillar
  const pillarScores: Record<Pillar, Record<Archetype, number>> = {
    cognitive: { Executor: 0, Strategist: 0, Optimizer: 0, Connector: 0 },
    reinforcement: { Executor: 0, Strategist: 0, Optimizer: 0, Connector: 0 },
    asymmetry: { Executor: 0, Strategist: 0, Optimizer: 0, Connector: 0 },
    activation: { Executor: 0, Strategist: 0, Optimizer: 0, Connector: 0 },
  };

  // Collect evidence from answers
  const evidence: string[] = [];

  // Process each answer
  questions.forEach((question) => {
    const answer = answers[question.id];
    if (!answer || typeof answer !== 'string') return;

    const archetype = answerToArchetype[answer];
    if (!archetype) return;

    // Add to pillar score
    pillarScores[question.pillar][archetype] += 1;

    // Collect evidence
    const evidenceText = evidenceMap[archetype]?.[question.id];
    if (evidenceText) {
      evidence.push(evidenceText);
    }
  });

  // Calculate weighted scores
  const weightedScores: Record<Archetype, number> = {
    Executor: 0,
    Strategist: 0,
    Optimizer: 0,
    Connector: 0,
  };

  // Apply pillar weights
  Object.entries(pillarScores).forEach(([pillar, scores]) => {
    const pillarWeight = pillars[pillar as Pillar].weight;
    Object.entries(scores).forEach(([archetype, score]) => {
      weightedScores[archetype as Archetype] += score * pillarWeight;
    });
  });

  // Find primary and secondary archetypes
  const sortedArchetypes = Object.entries(weightedScores).sort((a, b) => b[1] - a[1]);
  const primary = sortedArchetypes[0][0] as Archetype;
  const primaryScore = sortedArchetypes[0][1];
  const secondaryScore = sortedArchetypes[1][1];
  
  // Secondary if within 15% of primary
  const secondary = secondaryScore > 0 && secondaryScore >= primaryScore * 0.85
    ? sortedArchetypes[1][0] as Archetype
    : undefined;

  // Limit evidence to 4-5 most relevant items
  const finalEvidence = evidence.slice(0, 5);

  return {
    archetype: primary,
    secondary,
    scores: {
      Executor: pillarScores.cognitive.Executor + pillarScores.reinforcement.Executor + 
                pillarScores.asymmetry.Executor + pillarScores.activation.Executor,
      Strategist: pillarScores.cognitive.Strategist + pillarScores.reinforcement.Strategist + 
                  pillarScores.asymmetry.Strategist + pillarScores.activation.Strategist,
      Optimizer: pillarScores.cognitive.Optimizer + pillarScores.reinforcement.Optimizer + 
                 pillarScores.asymmetry.Optimizer + pillarScores.activation.Optimizer,
      Connector: pillarScores.cognitive.Connector + pillarScores.reinforcement.Connector + 
                 pillarScores.asymmetry.Connector + pillarScores.activation.Connector,
    },
    weightedScores,
    pillarScores,
    evidence: finalEvidence,
    reliefFraming: reliefFramingMap[primary],
    activationConditions: activationConditionsMap[primary],
    antiPatterns: antiPatternsMap[primary],
    sevenDayPlan: sevenDayPlanMap[primary],
  };
}
