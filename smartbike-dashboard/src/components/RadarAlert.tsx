import { useEffect, useRef } from 'react'
import { useBikeStore } from '../store/bikeStore'

const DANGER_THRESHOLD = 100 // cm

export function RadarAlert() {
  const distance = useBikeStore((state) => state.distance)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const lastBeepRef = useRef<number>(0)

  const isDanger = distance < DANGER_THRESHOLD

  useEffect(() => {
    if (!isDanger) return

    const interval = Math.max(150, distance * 4)
    const now = Date.now()

    if (now - lastBeepRef.current > interval) {
      lastBeepRef.current = now
      playBeep()
    }
  }, [distance, isDanger])

  const playBeep = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    const ctx = audioCtxRef.current
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'square'
    oscillator.frequency.value = 880
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.1)
  }

  if (!isDanger) return null

  return (
    <div className="absolute top-4 right-4 bg-red-600/90 text-white px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse shadow-lg z-10">
      <span className="text-2xl">⚠️</span>
      <div>
        <p className="font-bold text-sm">OBSTACLE DÉTECTÉ</p>
        <p className="text-xs">Distance : {distance} cm</p>
      </div>
    </div>
  )
}