import { useBikeStore } from '../store/bikeStore'

export function BatteryIndicator() {
  const battery = useBikeStore((state) => state.battery)

  const getColor = () => {
    if (battery < 15) return 'text-red-500'
    if (battery < 40) return 'text-orange-400'
    return 'text-green-400'
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-2 w-48">
      <span className="text-gray-400 text-sm uppercase tracking-wide">Batterie</span>
      <span className={`text-5xl font-bold ${getColor()}`}>{battery}%</span>
      {battery < 15 && (
        <span className="text-red-500 text-xs font-semibold animate-pulse">⚠️ Batterie faible</span>
      )}
    </div>
  )
}