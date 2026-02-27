import type { Plan, Tier, SubjobFreq } from './state'

export const pricing = [
  { key: '5x5',   label: '5×5',   friendly: 'Small Closet',      m2m: 88,   four: 80,   eight: 71  },
  { key: '5x10',  label: '5×10',  friendly: 'Walk-in Closet',    m2m: 146,  four: 133,  eight: 122 },
  { key: '10x10', label: '10×10', friendly: 'Garage',             m2m: 233,  four: 212,  eight: 194 },
  { key: '10x15', label: '10×15', friendly: 'Studio Apartment',   m2m: 341,  four: 310,  eight: 284 },
  { key: '10x20', label: '10×20', friendly: 'One Bedroom',        m2m: 461,  four: 419,  eight: 382 },
  { key: '10x25', label: '10×25', friendly: 'Two Bedroom',        m2m: 597,  four: 543,  eight: 497 },
  { key: '10x30', label: '10×30', friendly: 'Three Bedroom',      m2m: 682,  four: 620,  eight: 567 },
  { key: '10x40', label: '10×40', friendly: 'Four Bedroom',       m2m: 807,  four: 734,  eight: 672 },
]

export const laborFees: Record<Tier, { pickup: number; delivery: number }> = {
  whiteglove: { pickup: 149, delivery: 149 },
  prepacked:  { pickup: 99,  delivery: 99  },
  youload:    { pickup: 79,  delivery: 79  },
}

export const tierSavingsLabel: Record<Tier, string | null> = {
  whiteglove: null,
  prepacked:  'Save ~10%',
  youload:    'Save ~20%',
}

export const progressiveDiscounts: Record<Plan, { startMonth: number; mult: number }[]> = {
  committed: [
    { startMonth: 1, mult: 1.00 },
    { startMonth: 5, mult: 0.90 },
    { startMonth: 9, mult: 0.81 },
  ],
  longhaul: [
    { startMonth: 1, mult: 1.00 },
    { startMonth: 9, mult: 0.90 },
  ],
  flexible: [
    { startMonth: 1, mult: 1.00 },
  ],
}

export function getBaseRate(sizeIdx: number, plan: Plan): number {
  const p = pricing[Math.max(0, Math.min(7, sizeIdx))]
  if (plan === 'committed') return p.four
  if (plan === 'longhaul') return p.eight
  return p.m2m
}

export function getRateAtMonth(base: number, plan: Plan, month: number): number {
  const schedule = progressiveDiscounts[plan]
  let mult = 1.0
  for (const tier of schedule) {
    if (month >= tier.startMonth) mult = tier.mult
  }
  return Math.round(base * mult)
}

export function getLaborCost(tier: Tier, plan: Plan): { pickup: number; delivery: number } {
  if (plan === 'committed' || plan === 'longhaul') {
    return { pickup: 0, delivery: 0 }
  }
  return laborFees[tier]
}

export const subjobMultipliers: Record<SubjobFreq, Record<'committed' | 'longhaul', number>> = {
  never:      { committed: 0.85, longhaul: 0.85 },
  onceTwice:  { committed: 1.00, longhaul: 1.00 },
  fewTimes:   { committed: 1.10, longhaul: 1.00 },
  frequently: { committed: 1.15, longhaul: 1.05 },
}

export function getSubjobMultiplier(freq: SubjobFreq | null, plan: Plan): number {
  if (plan === 'flexible' || !freq) return 1.00
  return subjobMultipliers[freq]?.[plan as 'committed' | 'longhaul'] ?? 1.00
}

export function getPlanBreakdown(sizeIdx: number, plan: Plan, tier: Tier, subjobFreq?: SubjobFreq | null) {
  const base = getBaseRate(sizeIdx, plan)
  const subjobMult = getSubjobMultiplier(subjobFreq ?? null, plan)
  const adjustedBase = Math.round(base * subjobMult)
  const labor = getLaborCost(tier, plan)
  const commitMonths = plan === 'longhaul' ? 8 : plan === 'committed' ? 4 : 1

  const month5Rate = plan === 'committed'
    ? Math.round(adjustedBase * 0.90) : null
  const month9Rate = Math.round(adjustedBase *
    (plan === 'longhaul' ? 0.90 : 0.81))

  const periodTotal = adjustedBase * commitMonths + labor.pickup + labor.delivery

  return {
    base,
    adjustedBase,
    subjobMult,
    labor,
    commitMonths,
    periodTotal,
    month5Rate,
    month9Rate,
  }
}

export const tierMultipliers: Record<Tier, number> = {
  whiteglove: 1.0,
  prepacked: 0.9,
  youload: 0.8,
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
    planLabel: plan === 'longhaul' ? '8 Month'
      : plan === 'committed' ? '4 Month'
      : 'Monthly'
  }
}

export function getAvgMonthlyCost(
  sizeIdx: number,
  plan: Plan,
  tier: Tier,
  subjobFreq?: SubjobFreq | null
): {
  avgMonthly: number
  firstMonth?: number
  monthlyThereafter?: number
  commitMonths: number
  laborPickup: number
  laborDelivery: number
} {
  const bd = getPlanBreakdown(sizeIdx, plan, tier, subjobFreq)

  if (plan === 'flexible') {
    const firstMonth = bd.adjustedBase + bd.labor.pickup + bd.labor.delivery
    return {
      avgMonthly: firstMonth,
      firstMonth,
      monthlyThereafter: bd.adjustedBase,
      commitMonths: 1,
      laborPickup: bd.labor.pickup,
      laborDelivery: bd.labor.delivery,
    }
  }

  return {
    avgMonthly: bd.commitMonths > 0 ? Math.round(bd.periodTotal / bd.commitMonths) : bd.adjustedBase,
    commitMonths: bd.commitMonths,
    laborPickup: 0,
    laborDelivery: 0,
  }
}

export const bedroomToSize: Record<string, number> = {
  'Studio / Small apartment': 3,
  '1 Bedroom': 4,
  '2 Bedroom': 5,
  '3 Bedroom': 6,
  '4+ Bedroom': 7,
}
