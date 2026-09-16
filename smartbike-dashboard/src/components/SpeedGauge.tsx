import { useBikeStore } from '../store/bikeStore'

export function SpeedGauge() {
  const speed = useBikeStore((state) => state.speed)

  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-2 w-48">
      <span className="text-gray-400 text-sm uppercase tracking-wide">Vitesse</span>
      <span className="text-5xl font-bold text-white">{speed}</span>
      <span className="text-gray-500 text-sm">km/h</span>
    </div>
  )
}