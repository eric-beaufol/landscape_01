import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { OrbitControls, useHelper, Text, Sky } from '@react-three/drei'
import Box from '../components/Box'
import Terrain from '../components/Terrain'
import { useEffect, useRef, useState, Suspense } from 'react'
import { DirectionalLightHelper, PointLightHelper } from 'three'
import Noise from '../components/Noise'
// import DatGui, { DatNumber, DatString } from '@tim-soft/react-dat-gui'

export default function Home() {
  const noiseRef = useRef()
  const ref = useRef()
  const directionalLightRef = useRef()
  const pointLightRef = useRef()
  const boxRef = useRef()
  const [data, setData] = useState({
    x: -10,
    y: -5,
    z: 0,
    str: 'toto'
  })
  const [pixelRatio, setPixelRatio] = useState(1)

  useEffect(() => {
    setPixelRatio(devicePixelRatio)
    console.log(noiseRef)
  }, [])
  
  //useHelper(directionalLightRef, DirectionalLightHelper, 1)
  //useHelper(pointLightRef, PointLightHelper, 1)

  useEffect(() => {
    // directionalLightRef.current.target = boxRef.current
  })

  //useFrame(({ clock }) => {
    // boxRef.current.position.x = (Math.sin(clock.elapsedTime) * Math.PI) * 1
    // boxRef.current.position.z = (Math.sin(clock.elapsedTime) * Math.PI) * 1

    // directionalLightRef.current.target = boxRef.current

    // pointLightRef.current.position.y = (Math.sin(clock.elapsedTime) * Math.PI) * 4 + 4
  //})

  return (
    <>
      <Canvas 
        dpr={pixelRatio} 
        camera={{ position: [0, 15, 40], near: 0.1, far: 5000 }}
        shadows={{ type: 'BasicShadowMap' }}
      >
        {/* <DatGui data={{data}} onUpdate={handleUpdate}>
          <DatString path='x' label='a' min={-10} max={10} step={.1} />
        </DatGui> */}
        <ambientLight intensity={1.4} />
        <pointLight 
          position={[0, -100, 2]} 
          intensity={0} 
          castShadow 
          ref={pointLightRef} />
        <directionalLight 
          position={[0, 3, -100]} 
          intensity={2}
          castShadow 
          ref={directionalLightRef}
        />
        <Text color="black" anchorX="center" anchorY="middle">
          hello world!
        </Text>

        <Box position={[-1.2, 1, 0]} castShadow receiveShadow ref={boxRef} />

        <Suspense fallback={null}>
          <Terrain 
            position={[0, -50, 0]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            castShadow
            receiveShadow
            noiseCanvas={noiseRef}
          />
        </Suspense>
        <Sky sunPosition={[0, 3, -100]} inclination={0} azimuth={0.25} distance={45000} />
        <OrbitControls />
      </Canvas>
      <Noise ref={noiseRef}/>
    </>
  )
}
