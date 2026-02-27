export const itemLibrary = [
  { name: 'Sofa',            cuft: 40, category: 'Furniture' },
  { name: 'Loveseat',        cuft: 25, category: 'Furniture' },
  { name: 'Armchair',        cuft: 15, category: 'Furniture' },
  { name: 'Bed (Queen)',     cuft: 60, category: 'Furniture' },
  { name: 'Bed (King)',      cuft: 75, category: 'Furniture' },
  { name: 'Bed (Twin)',      cuft: 35, category: 'Furniture' },
  { name: 'Mattress',        cuft: 40, category: 'Furniture' },
  { name: 'Dresser',         cuft: 25, category: 'Furniture' },
  { name: 'Nightstand',      cuft: 8,  category: 'Furniture' },
  { name: 'Desk',            cuft: 20, category: 'Furniture' },
  { name: 'Dining Table',    cuft: 30, category: 'Furniture' },
  { name: 'Dining Chair',    cuft: 8,  category: 'Furniture' },
  { name: 'Coffee Table',    cuft: 15, category: 'Furniture' },
  { name: 'Bookshelf',       cuft: 20, category: 'Furniture' },
  { name: 'TV Stand',        cuft: 15, category: 'Furniture' },
  { name: 'Wardrobe',        cuft: 35, category: 'Furniture' },
  { name: 'Refrigerator',    cuft: 45, category: 'Appliances' },
  { name: 'Washer',          cuft: 30, category: 'Appliances' },
  { name: 'Dryer',           cuft: 30, category: 'Appliances' },
  { name: 'Dishwasher',      cuft: 20, category: 'Appliances' },
  { name: 'Microwave',       cuft: 5,  category: 'Appliances' },
  { name: 'Air Conditioner', cuft: 15, category: 'Appliances' },
  { name: 'Box (Small)',     cuft: 3,  category: 'Boxes & Misc' },
  { name: 'Box (Medium)',    cuft: 5,  category: 'Boxes & Misc' },
  { name: 'Box (Large)',     cuft: 8,  category: 'Boxes & Misc' },
  { name: 'Bike',            cuft: 15, category: 'Boxes & Misc' },
  { name: 'Sports Gear',     cuft: 10, category: 'Boxes & Misc' },
  { name: 'TV (Large)',      cuft: 15, category: 'Boxes & Misc' },
  { name: 'Rug',             cuft: 10, category: 'Boxes & Misc' },
  { name: 'Mirror',          cuft: 8,  category: 'Boxes & Misc' },
  { name: 'Lamp',            cuft: 5,  category: 'Boxes & Misc' },
]

export const cuftThresholds = [
  { maxCuft: 50,   sizeIdx: 0 },
  { maxCuft: 100,  sizeIdx: 1 },
  { maxCuft: 200,  sizeIdx: 2 },
  { maxCuft: 350,  sizeIdx: 3 },
  { maxCuft: 500,  sizeIdx: 4 },
  { maxCuft: 650,  sizeIdx: 5 },
  { maxCuft: 800,  sizeIdx: 6 },
  { maxCuft: 9999, sizeIdx: 7 },
]

export function getSizeFromItems(items: { name: string; count: number }[]): number {
  const totalCuft = getCuftTotal(items)
  for (const threshold of cuftThresholds) {
    if (totalCuft <= threshold.maxCuft) return threshold.sizeIdx
  }
  return 7
}

export function getCuftTotal(items: { name: string; count: number }[]): number {
  return items.reduce((sum, item) => {
    const ref = itemLibrary.find(i => i.name === item.name)
    return sum + (ref ? ref.cuft * item.count : 0)
  }, 0)
}

export function getCapacity(sizeIdx: number): number {
  return cuftThresholds[Math.max(0, Math.min(7, sizeIdx))].maxCuft
}
