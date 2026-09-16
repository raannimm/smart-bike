import mqtt from 'mqtt'
import { useBikeStore } from '../store/bikeStore'

let client: mqtt.MqttClient | null = null

export function connectMQTT() {
  if (client) return client

  client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt')

  client.on('connect', () => {
    console.log('✅ Connecté au broker MQTT (WebSocket)')
    useBikeStore.getState().setConnected(true)
    client?.subscribe('smartbike/data')
  })

  client.on('message', (topic, message) => {
    if (topic === 'smartbike/data') {
      try {
        const data = JSON.parse(message.toString())
        // On ignore lat/lng venant du simulateur/ESP32 — la vraie position GPS du navigateur prend le dessus
        const { lat, lng, ...rest } = data
        useBikeStore.getState().setData(rest)
      } catch (e) {
        console.error('Erreur parsing JSON :', e)
      }
    }
  })

  client.on('error', (err) => {
    console.error('❌ Erreur MQTT :', err)
  })

  client.on('close', () => {
    useBikeStore.getState().setConnected(false)
  })

  return client
}

export function publishLed(command: 'ON' | 'OFF') {
  client?.publish('smartbike/led', command)
}

export function publishBlinker(side: 'left' | 'right', command: 'ON' | 'OFF') {
  const topic = side === 'left' ? 'smartbike/blinker/left' : 'smartbike/blinker/right'
  client?.publish(topic, command)
}

export function startRealGPS() {
  if (!navigator.geolocation) {
    console.error('Geolocation non supportée par ce navigateur')
    return
  }

  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      useBikeStore.getState().setData({ lat: latitude, lng: longitude })
      useBikeStore.getState().addTripPoint({
        lat: latitude,
        lng: longitude,
        timestamp: Date.now(),
      })
    },
    (error) => {
      console.error('Erreur GPS :', error)
    },
    { enableHighAccuracy: true }
  )
}