export type Availability = 'past' | 'unavailable' | 'limited' | 'available'

export function getAvailability(date: Date): Availability {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diff = Math.floor((target.getTime() - today.getTime()) / 86400000)
  if (diff < 3) return 'past'
  const day = date.getDay()
  if (day === 2 || day === 6) return 'unavailable'
  if (day === 5) return 'limited'
  return 'available'
}

export function getNextAvailable(from: Date, count = 3): Date[] {
  const results: Date[] = []
  const cursor = new Date(from)
  cursor.setDate(cursor.getDate() + 1)
  while (results.length < count) {
    const avail = getAvailability(cursor)
    if (avail === 'available' || avail === 'limited') {
      results.push(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return results
}
