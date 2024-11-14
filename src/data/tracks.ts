export const tracks = [
  {
    id: 'alpha-focus',
    title: 'Alpha Focus',
    category: 'study',
    baseFrequency: 200,
    beatFrequency: 10,
    description: 'Enhanced focus and learning (8-12 Hz)',
    tooltip: 'Alpha waves promote mental clarity, improved memory, and enhanced learning ability. Perfect for studying, reading, or any task requiring sustained attention.'
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    category: 'work',
    baseFrequency: 180,
    beatFrequency: 6,
    description: 'Sustained concentration (4-8 Hz)',
    tooltip: 'Theta waves enhance creativity, intuition, and deep concentration. Ideal for complex problem-solving, creative work, or entering a flow state.'
  },
  {
    id: 'zen-meditation',
    title: 'Zen State',
    category: 'meditation',
    baseFrequency: 160,
    beatFrequency: 4,
    description: 'Deep meditation (2-4 Hz)',
    tooltip: 'Delta waves promote deep relaxation, healing, and meditation. Perfect for spiritual practices, deep meditation, or achieving profound states of tranquility.'
  },
] as const;