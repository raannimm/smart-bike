import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { BikeModel } from './BikeModel'

export function BikeScene() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!groupRef.current) return
      const step = 0.1

      switch (e.key) {
        case 'ArrowLeft':
          groupRef.current.rotation.y -= step
          break
        case 'ArrowRight':
          groupRef.current.rotation.y += step
          break
        case 'ArrowUp':
          if (e.shiftKey) {
            groupRef.current.rotation.z += step
          } else {
            groupRef.current.rotation.x -= step
          }
          break
        case 'ArrowDown':
          if (e.shiftKey) {
            groupRef.current.rotation.z -= step
          } else {
            groupRef.current.rotation.x += step
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Canvas camera={{ position: [3, 1.8, 3], fov: 45 }} shadows>
      <color attach="background" args={['#0a0e17']} />
      <fog attach="fog" args={['#0a0e17', 6, 16]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-3, 4, -2]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color="#3b82f6"
      />
      <pointLight position={[2, 2, 2]} intensity={0.4} color="#ffffff" />

      <Grid
        position={[0, 0, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#334155"
        fadeDistance={12}
        fadeStrength={1}
        infiniteGrid
      />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={6}
        blur={2}
        far={2}
      />

      <group ref={groupRef}>
        <BikeModel />
      </group>

      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
    </Canvas>
  )
}