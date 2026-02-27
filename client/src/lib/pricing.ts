import type { Plan, Tier } from './state'

export const pricing = [
  { key: '5x5',   label: '5x5',   friendly: 'Small Closet',      m2m: 132,  four: 80,   eight: 71  },
  { key: '5x10',  label: '5x10',  friendly: 'Walk-in Closet',    m2m: 146,  four: 133,  eight: 122 },
  { key: '10x10', label: '10x10', friendly: 'Garage',             m2m: 348,  four: 212,  eight: 194 },
  { key: '10x15', label: '10x15', friendly: 'Studio Apartment',   m2m: 509,  four: 310,  eight: 284 },
  { key: '10x20', label: '10x20', friendly: 'One Bedroom',        m2m: 687,  four: 419,  eight: 382 },
  { key: '10x25', label: '10x25', friendly: 'Two Bedroom',        m2m: 890,  four: 543,  eight: 497 },
  { key: '10x30', label: '10x30', friendly: 'Three Bedroom',      m2m: 1016, four: 620,  eight: 567 },
  { key: '10x40', label: '10x40', friendly: 'Four Bedroom',       m2m: 1203, four: 734,  eight: 672 },
]

export const tierMultipliers: Record<Tier, number> = {
  whiteglove: 1.0,
  prepacked: 0.9,
  youload: 0.8,
}

export function getPrice(sizeIdx: number, plan: Plan, tier: Tier): number {
  const p = pricing[Math.max(0, Math.min(7, sizeIdx))]
  const mult = tierMultipliers[tier]
  if (plan === 'committed') return Math.round(p.four * mult)
  if (plan === 'longhaul') return Math.round(p.eight * mult)
  return Math.round(p.m2m * mult)
}

export function getSavings(sizeIdx: number, plan: Plan, tier: Tier): number {
  const flexPrice = getPrice(sizeIdx, 'flexible', tier)
  const currentPrice = getPrice(sizeIdx, plan, tier)
  return flexPrice - currentPrice
}
