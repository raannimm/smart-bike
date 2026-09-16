import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useBikeStore } from '../store/bikeStore'

function Strut({ start, end, radius = 0.03, color = '#dc2626' }: {
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
  color?: string
}) {
  const { position, quaternion, length } = useMemo(() => {
    const startV = new THREE.Vector3(...start)
    const endV = new THREE.Vector3(...end)
    const dir = endV.clone().sub(startV)
    const length = dir.length()
    const position = startV.clone().add(endV).multiplyScalar(0.5)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    )
    return { position, quaternion, length }
  }, [start, end])

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Wheel({
  wheelRef,
  position,
}: {
  wheelRef: React.RefObject<THREE.Group>
  position: [number, number, number]
}) {
  const spokes = 12
  const spokeAngles = Array.from({ length: spokes }, (_, i) => (i / spokes) * Math.PI * 2)

  return (
    <group ref={wheelRef} position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <torusGeometry args={[0.55, 0.055, 16, 40]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.55, 0.02, 8, 40]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      {spokeAngles.map((angle, i) => (
        <mesh
          key={i}
          rotation={[0, 0, angle]}
          position={[Math.cos(angle) * 0.27, Math.sin(angle) * 0.27, 0]}
        >
          <cylinderGeometry args={[0.006, 0.006, 0.54, 6]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.7} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.5} />
      </mesh>
    </group>
  )
}

export function BikeModel() {
  const speed = useBikeStore((state) => state.speed)
  const led = useBikeStore((state) => state.led)
  const blinkerLeft = useBikeStore((state) => state.blinkerLeft)
  const blinkerRight = useBikeStore((state) => state.blinkerRight)
  const frontWheelRef = useRef<THREE.Group>(null)
  const backWheelRef = useRef<THREE.Group>(null)
  const crankRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    const rotationSpeed = speed * 0.5
    if (frontWheelRef.current) frontWheelRef.current.rotation.z -= rotationSpeed * delta
    if (backWheelRef.current) backWheelRef.current.rotation.z -= rotationSpeed * delta
   
  })

  const rearHub: [number, number, number] = [-0.85, 0.55, 0]
  const frontHub: [number, number, number] = [0.85, 0.55, 0]
  const bottomBracket: [number, number, number] = [-0.15, 0.55, 0]
  const seatTubeTop: [number, number, number] = [-0.35, 1.15, 0]
  const headTubeBottom: [number, number, number] = [0.65, 0.85, 0]
  const headTubeTop: [number, number, number] = [0.72, 1.18, 0]
  const seatTop: [number, number, number] = [-0.4, 1.28, 0]
  const stemEnd: [number, number, number] = [0.85, 1.3, 0]
  const handlebarLeft: [number, number, number] = [0.85, 1.3, 0.22]
  const handlebarRight: [number, number, number] = [0.85, 1.3, -0.22]

  return (
    <group>
      <Wheel wheelRef={backWheelRef} position={rearHub} />
      <Wheel wheelRef={frontWheelRef} position={frontHub} />

      <Strut start={rearHub} end={bottomBracket} radius={0.028} />
      <Strut start={bottomBracket} end={seatTubeTop} radius={0.032} />
      <Strut start={rearHub} end={seatTubeTop} radius={0.024} />
      <Strut start={bottomBracket} end={headTubeBottom} radius={0.036} />
      <Strut start={seatTubeTop} end={headTubeTop} radius={0.03} />
      <Strut start={headTubeBottom} end={headTubeTop} radius={0.03} color="#991b1b" />
      <Strut start={headTubeBottom} end={frontHub} radius={0.026} color="#1f2937" />

      <Strut start={seatTubeTop} end={seatTop} radius={0.018} color="#1f2937" />
      <mesh position={[seatTop[0] - 0.05, seatTop[1] + 0.02, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.32, 0.05, 0.14]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <Strut start={headTubeTop} end={stemEnd} radius={0.018} color="#1f2937" />
      <Strut start={handlebarLeft} end={handlebarRight} radius={0.02} color="#1f2937" />
      <mesh position={handlebarLeft} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.08, 12]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={handlebarRight} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.08, 12]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      <group ref={crankRef} position={bottomBracket}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.1, 16]} />
          <meshStandardMaterial color="#374151" metalness={0.6} />
        </mesh>
        <mesh position={[0.18, 0, 0]}>
          <boxGeometry args={[0.02, 0.36, 0.02]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.18, 0.18, 0]}>
          <boxGeometry args={[0.09, 0.03, 0.06]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.18, -0.18, 0]}>
          <boxGeometry args={[0.09, 0.03, 0.06]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Phare avant */}
      <mesh position={[headTubeTop[0] + 0.06, headTubeTop[1] + 0.02, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color={led ? '#fde047' : '#4b5563'}
          emissive={led ? '#fde047' : '#000000'}
          emissiveIntensity={led ? 2.5 : 0}
        />
      </mesh>
      {led && (
        <pointLight
          position={[headTubeTop[0] + 0.15, headTubeTop[1] + 0.02, 0]}
          color="#fde047"
          intensity={2.5}
          distance={2.5}
        />
      )}

      {/* Clignotant gauche */}
      <mesh position={[handlebarLeft[0], handlebarLeft[1] + 0.05, handlebarLeft[2]]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color={blinkerLeft ? '#f97316' : '#4b5563'}
          emissive={blinkerLeft ? '#f97316' : '#000000'}
          emissiveIntensity={blinkerLeft ? 2 : 0}
        />
      </mesh>

      {/* Clignotant droit */}
      <mesh position={[handlebarRight[0], handlebarRight[1] + 0.05, handlebarRight[2]]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color={blinkerRight ? '#f97316' : '#4b5563'}
          emissive={blinkerRight ? '#f97316' : '#000000'}
          emissiveIntensity={blinkerRight ? 2 : 0}
        />
      </mesh>
    </group>
  )
}