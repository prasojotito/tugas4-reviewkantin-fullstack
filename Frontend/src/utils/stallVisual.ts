const EMOJI: Record<string, string> = {
  kwetiau: '🍜',
  mie: '🍜',
  mi: '🍜',
  nasi: '🍚',
  bakso: '🥣',
  minuman: '🥤',
  western: '🍗',
  sate: '🍢',
  soto: '🍲',
};

export const categoryEmoji = (category?: string | null): string =>
  (category && EMOJI[category.toLowerCase()]) || '🍽️';

const GRADIENTS = [
  'linear-gradient(135deg, #fdba74, #fb923c)',
  'linear-gradient(135deg, #fca5a5, #f87171)',
  'linear-gradient(135deg, #fde68a, #fbbf24)',
  'linear-gradient(135deg, #a7f3d0, #34d399)',
  'linear-gradient(135deg, #bfdbfe, #60a5fa)',
  'linear-gradient(135deg, #ddd6fe, #a78bfa)',
];

export const stallGradient = (id: number): string => GRADIENTS[id % GRADIENTS.length];