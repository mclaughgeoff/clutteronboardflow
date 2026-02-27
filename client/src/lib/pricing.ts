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

export function getMovingQuote(
  sizeIdx: number,
  tier: Tier,
  durationDays: number | null,
  route: 'clutter' | 'flex'
): {
  monthlyRate: number
  estimatedTotal: number | null
  pickupCost: number
  deliveryCost: number
  tierAdjustment: number
  planLabel: string
} {
  const p = pricing[Math.max(0, Math.min(7, sizeIdx))]
  const mult = tierMultipliers[tier]

  if (route === 'flex') {
    const baseFlexQuote = [299, 399, 499, 649, 799, 949, 1099, 1299][sizeIdx] || 799
    const tierAdj = tier === 'prepacked' ? -50 : tier === 'youload' ? -100 : 0
    return {
      monthlyRate: 0,
      estimatedTotal: baseFlexQuote + tierAdj,
      pickupCost: 0,
      deliveryCost: 0,
      tierAdjustment: tierAdj,
      planLabel: 'Flex Move'
    }
  }

  const months = durationDays ? Math.ceil(durationDays / 30) : null
  const plan: Plan = !months || months >= 8 ? 'longhaul'
    : months >= 4 ? 'committed'
    : 'flexible'
  const monthlyRate = Math.round(
    (plan === 'longhaul' ? p.eight : plan === 'committed' ? p.four : p.m2m) * mult
  )
  const pickupCost = plan === 'flexible' ? 149 : 0
  const deliveryCost = plan === 'flexible' ? 149 : 0
  const estimatedTotal = months
    ? monthlyRate * months + pickupCost + deliveryCost
    : null

  return {
    monthlyRate,
    estimatedTotal,
    pickupCost,
    deliveryCost,
    tierAdjustment: 0,
    planLabel: plan === 'longhaul' ? 'Long Haul'
      : plan === 'committed' ? 'Committed'
      : 'Flexible'
  }
}

export const bedroomToSize: Record<string, number> = {
  'Studio / Small apartment': 3,
  '1 Bedroom': 4,
  '2 Bedroom': 5,
  '3 Bedroom': 6,
  '4+ Bedroom': 7,
}
