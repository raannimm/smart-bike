import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useBikeStore } from '../store/bikeStore'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng])
  }, [lat, lng, map])
  return null
}

export function BikeMap() {
  const lat = useBikeStore((state) => state.lat)
  const lng = useBikeStore((state) => state.lng)
  const speed = useBikeStore((state) => state.speed)

  const [trail, setTrail] = useState<[number, number][]>([])
  const lastPoint = useRef<[number, number] | null>(null)

  const hasPosition = lat !== 0 || lng !== 0

  useEffect(() => {
    if (!hasPosition) return

    const newPoint: [number, number] = [lat, lng]

    // Évite d'ajouter des points identiques consécutifs
    if (
      !lastPoint.current ||
      lastPoint.current[0] !== newPoint[0] ||
      lastPoint.current[1] !== newPoint[1]
    ) {
      lastPoint.current = newPoint
      setTrail((prev) => [...prev, newPoint])
    }
  }, [lat, lng, hasPosition])

  const resetTrail = () => {
    setTrail([])
    lastPoint.current = null
  }

  if (!hasPosition) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        En attente de position GPS...
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <button
        onClick={resetTrail}
        className="absolute top-2 right-2 z-[1000] bg-gray-900/80 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800"
      >
        🔄 Réinitialiser trajet
      </button>

      <MapContainer
        center={[lat, lng]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            🚲 Vélo <br />
            Vitesse : {speed} km/h
          </Popup>
        </Marker>

        {trail.length > 1 && (
          <Polyline positions={trail} pathOptions={{ color: '#f97316', weight: 4 }} />
        )}

        <RecenterMap lat={lat} lng={lng} />
      </MapContainer>
    </div>
  )
}