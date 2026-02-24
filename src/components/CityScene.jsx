import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const CITY_PERSPECTIVE = {
  camera: [-0.46, 0.28, 3.02],
  lookAt: [-0.08, 0, -0.16],
  modelRotationY: 0.44,
  modelPosition: [0.06, -0.42, -1.24],
}

const LOGO_FONT = '/fonts/Orbitron-Bold.ttf'

function NeonText({ children, position, fontSize, letterSpacing, color, outlineColor, outlineWidth, glowColor, glowScale = 1.14 }) {
  return (
    <group position={position}>
      <Text
        position={[0, 0, -0.005]}
        anchorX="center"
        anchorY="middle"
        font={LOGO_FONT}
        fontSize={fontSize * glowScale}
        letterSpacing={letterSpacing}
        color={glowColor}
        fillOpacity={0.42}
        outlineWidth={outlineWidth * 1.7}
        outlineColor={glowColor}
        outlineOpacity={1}
        renderOrder={39}
        material-depthTest={false}
        material-depthWrite={false}
        material-fog={false}
        material-toneMapped={false}
      >
        {children}
      </Text>
      <Text
        anchorX="center"
        anchorY="middle"
        font={LOGO_FONT}
        fontSize={fontSize}
        letterSpacing={letterSpacing}
        color={color}
        outlineWidth={outlineWidth * 1.15}
        outlineColor={outlineColor}
        renderOrder={40}
        material-depthTest={false}
        material-depthWrite={false}
        material-fog={false}
        material-toneMapped={false}
      >
        {children}
      </Text>
    </group>
  )
}

function CityModel({ reduceMotion, onReady }) {
  const groupRef = useRef(null)
  const { scene } = useGLTF('/tiny_tokyo.glb')
  const model = useMemo(() => scene.clone(), [scene])

  useEffect(() => {
    onReady?.()
  }, [onReady])

  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, CITY_PERSPECTIVE.camera[0], 0.02)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, CITY_PERSPECTIVE.camera[1], 0.01)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, CITY_PERSPECTIVE.camera[2], 0.02)
    state.camera.lookAt(...CITY_PERSPECTIVE.lookAt)

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        CITY_PERSPECTIVE.modelRotationY,
        0.04,
      )
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, CITY_PERSPECTIVE.modelPosition[0], 0.05)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, CITY_PERSPECTIVE.modelPosition[2], 0.05)
      groupRef.current.position.y =
        THREE.MathUtils.lerp(groupRef.current.position.y, CITY_PERSPECTIVE.modelPosition[1], 0.05) +
        Math.sin(state.clock.elapsedTime * 0.25) * (reduceMotion ? 0.006 : 0.018)
    }
  })

  return (
    <primitive
      ref={groupRef}
      object={model}
      scale={0.39}
      position={[0, -0.22, -1.25]}
      rotation={[0, -0.25, 0]}
    />
  )
}

function CenterText3D({ reduceMotion, isMobile }) {
  const groupRef = useRef(null)

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.elapsedTime;
    const duration = reduceMotion ? 0.9 : 2.7;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - (1 - progress) ** 3;
    const viewportScale = THREE.MathUtils.clamp(state.viewport.width / 6.4, 0.57, 1.1);
    const responsiveScale = (isMobile ? viewportScale * 0.65 : viewportScale * 0.85);

    // X-Position: langsam nach links und rechts animieren
    groupRef.current.position.x = -0.25;
    // Y-Position: leicht nach oben/unten
    const baseY = THREE.MathUtils.lerp(0.25, 0.17, eased);
    const floatY = Math.sin(elapsed * 0.5) * 0.03;
    groupRef.current.position.y = baseY + floatY;
    groupRef.current.position.z = THREE.MathUtils.lerp(2.05, 1.34, eased);

    // 3D-Effekt: Text langsam hin und her neigen (Rotation um X und Y)
    groupRef.current.rotation.x = Math.sin(elapsed * 1.28) * 0.05; // sanfte Neigung nach vorne/hinten
    groupRef.current.rotation.y = Math.sin(elapsed * 1.23) * 0.09; // sanfte Neigung nach links/rechts

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, responsiveScale, 0.08);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, responsiveScale, 0.08);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, responsiveScale, 0.08);
  });

  return (
    <group ref={groupRef} position={[5, 0.25, 1.05]}>
      <NeonText
        position={[0, 0.2, 0.09]}
        fontSize={0.21}
        letterSpacing={0.03}
        color="#8bffff"
        outlineColor="#0b2b4d"
        outlineWidth={0.01}
        glowColor="#3fe7ff"
        glowScale={1.28}
      >
        Twenty
      </NeonText>
      <NeonText
        position={[0, 0, 0.09]}
        fontSize={0.21}
        letterSpacing={0.03}
        color="#8bffff"
        outlineColor="#0b2b4d"
        outlineWidth={0.01}
        glowColor="#3fe7ff"
        glowScale={1.28}
      >
        ever
      </NeonText>
      <NeonText
        position={[0, 0, -0.2]}
        fontSize={0.75}
        letterSpacing={-0.02}
        color="#ff9bff"
        outlineColor="#320d4c"
        outlineWidth={0.016}
        glowColor="#ff44dc"
        glowScale={1.33}
      >
        24
      </NeonText>
        <NeonText
          position={[0, -0.26, 0.02]}
          fontSize={0.105}
          letterSpacing={0.05}
          color="#1bff39"
          outlineColor="#0f3d2f"
          outlineWidth={0.006}
          glowColor="rgb(169, 255, 130)"
          glowScale={1.24}
        >
          Getränke & Snacks
        </NeonText>
    </group>
  )
}

useGLTF.preload('/tiny_tokyo.glb')

export default function CityScene({ reduceMotion, isMobile, onReady }) {
  const dprRange = isMobile ? [0.8, 1.1] : [1, 1.4]

  return (
    <div className="city-canvas-wrap" aria-hidden="true">
      <Canvas
        camera={{ position: CITY_PERSPECTIVE.camera, fov: 42 }}
        dpr={dprRange}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={["#05060f"]} />
        <fog attach="fog" args={["#070915", 2.2, 7.9]} />
        <ambientLight intensity={0.32} />
        <directionalLight color="#7ed8ff" intensity={0.78} position={[2.2, 2.5, 1.6]} />
        {/* Spotlights für Glow des Textes */}
        <spotLight
          color="#3fe7ff"
          intensity={22}
          position={[0, 1.2, 2.7]}
          angle={0.38}
          penumbra={0.7}
          distance={4.5}
          castShadow={false}
          target-position={[0, 0.03, 2.05]}
        />
        <spotLight
          color="#ff44dc"
          intensity={17}
          position={[0.7, 0.7, 2.3]}
          angle={0.32}
          penumbra={0.6}
          distance={3.8}
          castShadow={false}
          target-position={[0, 0.03, 2.05]}
        />
        <Suspense fallback={null}>
          <CityModel reduceMotion={reduceMotion} onReady={onReady} />
          <CenterText3D reduceMotion={reduceMotion} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}