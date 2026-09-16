import { create } from 'zustand'
import type { TripPoint } from '../services/tripStorage'

interface BikeState {
  speed: number
  battery: number
  lat: number
  lng: number
  distance: number
  led: boolean
  blinkerLeft: boolean
  blinkerRight: boolean
  connected: boolean
  isRecording: boolean
  currentTripPoints: TripPoint[]
  tripStartTime: number | null
  setData: (data: Partial<BikeState>) => void
  setConnected: (connected: boolean) => void
  setLed: (led: boolean) => void
  setBlinkerLeft: (value: boolean) => void
  setBlinkerRight: (value: boolean) => void
  startRecording: () => void
  stopRecording: () => void
  addTripPoint: (point: TripPoint) => void
}

export const useBikeStore = create<BikeState>((set, get) => ({
  speed: 0,
  battery: 0,
  lat: 0,
  lng: 0,
  distance: 999,
  led: false,
  blinkerLeft: false,
  blinkerRight: false,
  connected: false,
  isRecording: false,
  currentTripPoints: [],
  tripStartTime: null,
  setData: (data) => set((state) => ({ ...state, ...data })),
  setConnected: (connected) => set({ connected }),
  setLed: (led) => set({ led }),
  setBlinkerLeft: (value) =>
    set((state) => ({
      blinkerLeft: value,
      blinkerRight: value ? false : state.blinkerRight,
    })),
  setBlinkerRight: (value) =>
    set((state) => ({
      blinkerRight: value,
      blinkerLeft: value ? false : state.blinkerLeft,
    })),
  startRecording: () =>
    set({ isRecording: true, currentTripPoints: [], tripStartTime: Date.now() }),
  stopRecording: () => set({ isRecording: false }),
  addTripPoint: (point) => {
    const { isRecording, currentTripPoints } = get()
    if (!isRecording) return
    set({ currentTripPoints: [...currentTripPoints, point] })
  },
}))