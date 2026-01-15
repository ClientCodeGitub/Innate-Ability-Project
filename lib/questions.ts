export type QuestionType = 'single';

export type Pillar = 'cognitive' | 'reinforcement' | 'asymmetry' | 'activation';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  pillar: Pillar;
  pillarLabel: string;
  pillarNumber: number;
  type: QuestionType;
  question: string;
  description?: string;
  options: QuestionOption[];
  required: boolean;
}

export const questions: Question[] = [
  // PILLAR I – Cognitive & Temperamental Predispositions (Q1–Q4)
  {
    id: 'q1',
    pillar: 'cognitive',
    pillarLabel: 'Cognitive & Temperamental Predispositions',
    pillarNumber: 1,
    type: 'single',
    question: 'When something breaks unexpectedly, what do you do first?',
    required: true,
    options: [
      { id: 'q1-a', label: 'Act and fix immediately', value: 'executor' },
      { id: 'q1-b', label: 'Step back and analyze causes', value: 'strategist' },
      { id: 'q1-c', label: 'Look for how the system could be improved', value: 'optimizer' },
      { id: 'q1-d', label: 'Pull others in and coordinate', value: 'connector' },
    ],
  },
  {
    id: 'q2',
    pillar: 'cognitive',
    pillarLabel: 'Cognitive & Temperamental Predispositions',
    pillarNumber: 1,
    type: 'single',
    question: 'When learning something new, what feels most natural?',
    required: true,
    options: [
      { id: 'q2-a', label: 'Experiment immediately', value: 'executor' },
      { id: 'q2-b', label: 'Understand the theory', value: 'strategist' },
      { id: 'q2-c', label: 'Improve an existing example', value: 'optimizer' },
      { id: 'q2-d', label: 'Explain it to someone else', value: 'connector' },
    ],
  },
  {
    id: 'q3',
    pillar: 'cognitive',
    pillarLabel: 'Cognitive & Temperamental Predispositions',
    pillarNumber: 1,
    type: 'single',
    question: 'In unfamiliar situations, you tend to:',
    required: true,
    options: [
      { id: 'q3-a', label: 'Act and adjust', value: 'executor' },
      { id: 'q3-b', label: 'Observe and map patterns', value: 'strategist' },
      { id: 'q3-c', label: 'Look for efficiency gains', value: 'optimizer' },
      { id: 'q3-d', label: 'Read social dynamics', value: 'connector' },
    ],
  },
  {
    id: 'q4',
    pillar: 'cognitive',
    pillarLabel: 'Cognitive & Temperamental Predispositions',
    pillarNumber: 1,
    type: 'single',
    question: 'You trust decisions most when they\'re based on:',
    required: true,
    options: [
      { id: 'q4-a', label: 'Real-world action', value: 'executor' },
      { id: 'q4-b', label: 'Logical structure', value: 'strategist' },
      { id: 'q4-c', label: 'Optimization and refinement', value: 'optimizer' },
      { id: 'q4-d', label: 'Group alignment', value: 'connector' },
    ],
  },

  // PILLAR II – Early Reinforcement & Conditioning (Q5–Q8)
  {
    id: 'q5',
    pillar: 'reinforcement',
    pillarLabel: 'Early Reinforcement & Conditioning',
    pillarNumber: 2,
    type: 'single',
    question: 'Growing up, you were most praised for:',
    required: true,
    options: [
      { id: 'q5-a', label: 'Getting things done', value: 'executor' },
      { id: 'q5-b', label: 'Being smart or logical', value: 'strategist' },
      { id: 'q5-c', label: 'Being creative or original', value: 'optimizer' },
      { id: 'q5-d', label: 'Being helpful or responsible', value: 'connector' },
    ],
  },
  {
    id: 'q6',
    pillar: 'reinforcement',
    pillarLabel: 'Early Reinforcement & Conditioning',
    pillarNumber: 2,
    type: 'single',
    question: 'You learned early that it was better to:',
    required: true,
    options: [
      { id: 'q6-a', label: 'Take initiative', value: 'executor' },
      { id: 'q6-b', label: 'Be correct', value: 'strategist' },
      { id: 'q6-c', label: 'Be expressive', value: 'optimizer' },
      { id: 'q6-d', label: 'Be agreeable', value: 'connector' },
    ],
  },
  {
    id: 'q7',
    pillar: 'reinforcement',
    pillarLabel: 'Early Reinforcement & Conditioning',
    pillarNumber: 2,
    type: 'single',
    question: 'Which tendency did you learn to hide or soften?',
    required: true,
    options: [
      { id: 'q7-a', label: 'Taking charge', value: 'executor' },
      { id: 'q7-b', label: 'Overthinking', value: 'strategist' },
      { id: 'q7-c', label: 'Being unconventional', value: 'optimizer' },
      { id: 'q7-d', label: 'Needing independence', value: 'connector' },
    ],
  },
  {
    id: 'q8',
    pillar: 'reinforcement',
    pillarLabel: 'Early Reinforcement & Conditioning',
    pillarNumber: 2,
    type: 'single',
    question: 'You disappointed authority figures most when you:',
    required: true,
    options: [
      { id: 'q8-a', label: 'Acted too independently', value: 'executor' },
      { id: 'q8-b', label: 'Questioned logic', value: 'strategist' },
      { id: 'q8-c', label: 'Didn\'t follow conventions', value: 'optimizer' },
      { id: 'q8-d', label: 'Disrupted harmony', value: 'connector' },
    ],
  },

  // PILLAR III – Effort Asymmetry (Q9–Q12)
  {
    id: 'q9',
    pillar: 'asymmetry',
    pillarLabel: 'Effort Asymmetry (Leverage Detection)',
    pillarNumber: 3,
    type: 'single',
    question: 'Compared to others, what do you learn faster with the same effort?',
    required: true,
    options: [
      { id: 'q9-a', label: 'Practical execution', value: 'executor' },
      { id: 'q9-b', label: 'Abstract concepts', value: 'strategist' },
      { id: 'q9-c', label: 'System improvement', value: 'optimizer' },
      { id: 'q9-d', label: 'Navigating people', value: 'connector' },
    ],
  },
  {
    id: 'q10',
    pillar: 'asymmetry',
    pillarLabel: 'Effort Asymmetry (Leverage Detection)',
    pillarNumber: 3,
    type: 'single',
    question: 'What do people assume required training, but didn\'t for you?',
    required: true,
    options: [
      { id: 'q10-a', label: 'Acting under pressure', value: 'executor' },
      { id: 'q10-b', label: 'Seeing structure', value: 'strategist' },
      { id: 'q10-c', label: 'Refining details', value: 'optimizer' },
      { id: 'q10-d', label: 'Reading situations', value: 'connector' },
    ],
  },
  {
    id: 'q11',
    pillar: 'asymmetry',
    pillarLabel: 'Effort Asymmetry (Leverage Detection)',
    pillarNumber: 3,
    type: 'single',
    question: 'What do you get impatient explaining because it feels obvious?',
    required: true,
    options: [
      { id: 'q11-a', label: 'How to start', value: 'executor' },
      { id: 'q11-b', label: 'Why it works', value: 'strategist' },
      { id: 'q11-c', label: 'How to improve it', value: 'optimizer' },
      { id: 'q11-d', label: 'How people react', value: 'connector' },
    ],
  },
  {
    id: 'q12',
    pillar: 'asymmetry',
    pillarLabel: 'Effort Asymmetry (Leverage Detection)',
    pillarNumber: 3,
    type: 'single',
    question: 'When you push slightly beyond comfort, results tend to:',
    required: true,
    options: [
      { id: 'q12-a', label: 'Appear quickly', value: 'executor' },
      { id: 'q12-b', label: 'Become clearer', value: 'strategist' },
      { id: 'q12-c', label: 'Become more refined', value: 'optimizer' },
      { id: 'q12-d', label: 'Gain broader impact', value: 'connector' },
    ],
  },

  // PILLAR IV – Activation Conditions (Q13–Q16)
  {
    id: 'q13',
    pillar: 'activation',
    pillarLabel: 'Activation Conditions (Context & Environment)',
    pillarNumber: 4,
    type: 'single',
    question: 'You perform best when:',
    required: true,
    options: [
      { id: 'q13-a', label: 'Acting independently', value: 'executor' },
      { id: 'q13-b', label: 'Solving complex problems', value: 'strategist' },
      { id: 'q13-c', label: 'Improving existing work', value: 'optimizer' },
      { id: 'q13-d', label: 'Coordinating others', value: 'connector' },
    ],
  },
  {
    id: 'q14',
    pillar: 'activation',
    pillarLabel: 'Activation Conditions (Context & Environment)',
    pillarNumber: 4,
    type: 'single',
    question: 'What kind of pressure sharpens you?',
    required: true,
    options: [
      { id: 'q14-a', label: 'Time pressure', value: 'executor' },
      { id: 'q14-b', label: 'Cognitive challenge', value: 'strategist' },
      { id: 'q14-c', label: 'Precision standards', value: 'optimizer' },
      { id: 'q14-d', label: 'Social responsibility', value: 'connector' },
    ],
  },
  {
    id: 'q15',
    pillar: 'activation',
    pillarLabel: 'Activation Conditions (Context & Environment)',
    pillarNumber: 4,
    type: 'single',
    question: 'What kind of difficulty pulls you in?',
    required: true,
    options: [
      { id: 'q15-a', label: 'Fast execution', value: 'executor' },
      { id: 'q15-b', label: 'Deep complexity', value: 'strategist' },
      { id: 'q15-c', label: 'Fine-tuning', value: 'optimizer' },
      { id: 'q15-d', label: 'Interpersonal dynamics', value: 'connector' },
    ],
  },
  {
    id: 'q16',
    pillar: 'activation',
    pillarLabel: 'Activation Conditions (Context & Environment)',
    pillarNumber: 4,
    type: 'single',
    question: 'You feel most energized after:',
    required: true,
    options: [
      { id: 'q16-a', label: 'Decisive action', value: 'executor' },
      { id: 'q16-b', label: 'Solving a hard problem', value: 'strategist' },
      { id: 'q16-c', label: 'Making something better', value: 'optimizer' },
      { id: 'q16-d', label: 'Aligning people', value: 'connector' },
    ],
  },
];

export const totalQuestions = questions.length;

export const pillars: Record<Pillar, { label: string; description: string; weight: number }> = {
  cognitive: {
    label: 'Cognitive & Temperamental Predispositions',
    description: 'Identifying default cognitive response and information-processing style',
    weight: 0.35, // 35%
  },
  reinforcement: {
    label: 'Early Reinforcement & Conditioning',
    description: 'Detecting suppressed or misdirected abilities caused by early reinforcement',
    weight: 0.25, // 25%
  },
  asymmetry: {
    label: 'Effort Asymmetry (Leverage Detection)',
    description: 'Identifying where effort naturally compounds',
    weight: 0.25, // 25%
  },
  activation: {
    label: 'Activation Conditions (Context & Environment)',
    description: 'Understanding context and environment where ability expresses',
    weight: 0.15, // 15%
  },
};
