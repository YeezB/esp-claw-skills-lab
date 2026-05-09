export const ALLOWED_CATEGORIES = [
  'game',
  'utility',
  'hardware',
  'media',
  'network',
  'sensor',
  'ai',
] as const

export type Category = (typeof ALLOWED_CATEGORIES)[number]

export const ALLOWED_PERIPHERALS = [
  'camera',
  'led',
  'motor',
  'speaker',
  'microphone',
  'display',
  'button',
  'gpio',
] as const

export type Peripheral = (typeof ALLOWED_PERIPHERALS)[number]

export const FEATURED_SKILLS: string[] = ['weather_search']
