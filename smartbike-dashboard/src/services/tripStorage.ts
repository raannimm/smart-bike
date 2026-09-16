export interface TripPoint {
  lat: number
  lng: number
  timestamp: number
}

export interface Trip {
  id: string
  startTime: number
  endTime: number
  points: TripPoint[]
}

const STORAGE_KEY = 'smartbike_trips'

export function getTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTrip(trip: Trip) {
  const trips = getTrips()
  trips.unshift(trip) // le plus récent en premier
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

export function deleteTrip(id: string) {
  const trips = getTrips().filter((t) => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}