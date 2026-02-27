import type { Plan, Situation, Tier } from './state'

export const situationDefaults: Record<Situation, { sizeIdx: number; plan: Plan; tier: Tier }> = {
  moving:     { sizeIdx: 4, plan: 'committed', tier: 'whiteglove' },
  relocating: { sizeIdx: 5, plan: 'longhaul',  tier: 'whiteglove' },
  declutter:  { sizeIdx: 1, plan: 'longhaul',  tier: 'prepacked'  },
  lifechange: { sizeIdx: 2, plan: 'committed', tier: 'whiteglove' },
  renovation: { sizeIdx: 3, plan: 'flexible',  tier: 'whiteglove' },
  other:      { sizeIdx: 0, plan: 'committed', tier: 'whiteglove' },
}

export const bedroomToSize: Record<string, number> = {
  'Studio':     0,
  '1 Bedroom':  4,
  '2 Bedroom':  5,
  '3 Bedroom':  6,
  '4+ Bedroom': 7,
}

export function adjustSizeForItems(baseline: number, items: string[]): number {
  let adj = 0
  if (items.includes('sofa'))      adj += 1
  if (items.includes('bed'))       adj += 1
  if (items.includes('mattress'))  adj += 1
  if (items.includes('appliance')) adj += 1
  if (items.includes('table'))     adj += 1
  if (items.includes('boxes') && items.length < 3) adj -= 1
  return Math.max(0, Math.min(7, baseline + adj))
}
