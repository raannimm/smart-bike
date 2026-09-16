import { useState, useEffect } from 'react'
import { getTrips, deleteTrip, type Trip } from '../services/tripStorage'
import { totalTripDistance } from '../utils/geo'

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min} min ${sec}s`
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TripHistory({ onClose }: { onClose: () => void }) {
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    setTrips(getTrips())
  }, [])

  const handleDelete = (id: string) => {
    deleteTrip(id)
    setTrips(getTrips())
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">📍 Historique des trajets</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ✕
          </button>
        </div>

        {trips.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun trajet enregistré pour l'instant.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map((trip) => {
              const distanceM = totalTripDistance(trip.points)
              const duration = trip.endTime - trip.startTime

              return (
                <div
                  key={trip.id}
                  className="bg-gray-900 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">{formatDate(trip.startTime)}</p>
                    <p className="text-gray-400 text-sm">
                      {(distanceM / 1000).toFixed(2)} km · {formatDuration(duration)} ·{' '}
                      {trip.points.length} points
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-900/30"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}