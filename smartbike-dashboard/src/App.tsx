import { useEffect, useState } from 'react'
import { useBikeStore } from './store/bikeStore'
import { connectMQTT, publishLed, publishBlinker, startRealGPS } from './services/mqttClient'
import { saveTrip } from './services/tripStorage'
import { SpeedGauge } from './components/SpeedGauge'
import { BatteryIndicator } from './components/BatteryIndicator'
import { BikeScene } from './components/BikeScene'
import { BikeMap } from './components/BikeMap'
import { TripHistory } from './components/TripHistory'
import { RadarAlert } from './components/RadarAlert'

function App() {
  const connected = useBikeStore((state) => state.connected)
  const led = useBikeStore((state) => state.led)
  const setLed = useBikeStore((state) => state.setLed)
  const blinkerLeft = useBikeStore((state) => state.blinkerLeft)
  const blinkerRight = useBikeStore((state) => state.blinkerRight)
  const setBlinkerLeft = useBikeStore((state) => state.setBlinkerLeft)
  const setBlinkerRight = useBikeStore((state) => state.setBlinkerRight)

  const isRecording = useBikeStore((state) => state.isRecording)
  const currentTripPoints = useBikeStore((state) => state.currentTripPoints)
  const tripStartTime = useBikeStore((state) => state.tripStartTime)
  const startRecording = useBikeStore((state) => state.startRecording)
  const stopRecording = useBikeStore((state) => state.stopRecording)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    connectMQTT()
    startRealGPS()
  }, [])

  const toggleLed = () => {
    const newState = !led
    publishLed(newState ? 'ON' : 'OFF')
    setLed(newState)
  }

  const toggleBlinkerLeft = () => {
    const newState = !blinkerLeft
    publishBlinker('left', newState ? 'ON' : 'OFF')
    if (newState) publishBlinker('right', 'OFF')
    setBlinkerLeft(newState)
  }

  const toggleBlinkerRight = () => {
    const newState = !blinkerRight
    publishBlinker('right', newState ? 'ON' : 'OFF')
    if (newState) publishBlinker('left', 'OFF')
    setBlinkerRight(newState)
  }

  const handleStartTrip = () => {
    startRecording()
  }

  const handleStopTrip = () => {
    stopRecording()
    if (currentTripPoints.length > 1 && tripStartTime) {
      saveTrip({
        id: crypto.randomUUID(),
        startTime: tripStartTime,
        endTime: Date.now(),
        points: currentTripPoints,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">SMART BIKE 🚲</h1>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            connected ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {connected ? '🟢 Connecté' : '🔴 Déconnecté'}
          </div>

          <button
            onClick={isRecording ? handleStopTrip : handleStartTrip}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              isRecording ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
            }`}
          >
            {isRecording ? '⏹️ Arrêter trajet' : '⏺️ Démarrer trajet'}
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-700 hover:bg-gray-600 transition"
          >
            📍 Historique
          </button>
        </div>
      </header>

      <main className="flex-1 flex gap-6 p-8">
        <aside className="flex flex-col gap-6">
          <SpeedGauge />
          <BatteryIndicator />
        </aside>

        <section className="flex-1 bg-gray-800 rounded-2xl overflow-hidden relative">
          <BikeScene />
          <RadarAlert />
          <div className="absolute bottom-4 left-4 text-gray-500 text-xs">
            ⬅️➡️⬆️⬇️ pour tourner · Maj + ⬆️⬇️ pour l'axe Z
          </div>
        </section>

        <aside className="w-72 bg-gray-800 rounded-2xl overflow-hidden">
          <BikeMap />
        </aside>
      </main>

      <footer className="flex justify-center items-center gap-4 p-6 border-t border-gray-800">
        <button
          onClick={toggleBlinkerLeft}
          disabled={!connected}
          className={`px-5 py-3 rounded-lg font-bold text-lg transition ${
            blinkerLeft ? 'bg-orange-500 animate-pulse' : 'bg-gray-700'
          } disabled:opacity-50`}
        >
          ⬅️ Gauche
        </button>

        <button
          onClick={toggleLed}
          disabled={!connected}
          className={`px-6 py-3 rounded-lg font-bold text-lg transition ${
            led ? 'bg-yellow-500' : 'bg-gray-700'
          } disabled:opacity-50`}
        >
          💡 {led ? 'LED ALLUMÉE' : 'LED ÉTEINTE'}
        </button>

        <button
          onClick={toggleBlinkerRight}
          disabled={!connected}
          className={`px-5 py-3 rounded-lg font-bold text-lg transition ${
            blinkerRight ? 'bg-orange-500 animate-pulse' : 'bg-gray-700'
          } disabled:opacity-50`}
        >
          Droite ➡️
        </button>
      </footer>

      {showHistory && <TripHistory onClose={() => setShowHistory(false)} />}
    </div>
  )
}

export default App