export type SoundSource = 
  | { type: 'audio'; url: string }
  | { type: 'youtube'; videoId: string };

export const sounds = [
  {
    id: 'forest',
    title: 'Forest Ambiance',
    description: 'Peaceful woodland sounds',
    icon: '🌳',
    source: {
      type: 'youtube',
      videoId: 'xNN7iTA57jM'
    }
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    description: 'Gentle rolling waves',
    icon: '🌊',
    source: {
      type: 'youtube',
      videoId: 'WHPEKLQID4U'
    }
  },
  {
    id: 'rain',
    title: 'Rainfall',
    description: 'Soothing rain sounds',
    icon: '🌧',
    source: {
      type: 'youtube',
      videoId: 'mPZkdNFkNps'
    }
  },
  {
    id: 'birds',
    title: 'Bird Songs',
    description: 'Morning bird chorus',
    icon: '🐦',
    source: {
      type: 'youtube',
      videoId: 'Qm846KdZN_c'
    }
  },
] as const;