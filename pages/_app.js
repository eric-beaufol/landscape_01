import '../styles/globals.css'
import { Canvas } from '@react-three/fiber'
import { useState, useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  const [pixelRatio, setPixelRatio] = useState(1)

  useEffect(() => {
    setPixelRatio(devicePixelRatio)
  }, [])

  return (
    <Canvas 
      dpr={pixelRatio} 
      camera={{ position: [0, 15, -40], near: 0.1, far: 5000 }}
      shadows={{ type: 'BasicShadowMap' }}>
      <Component {...pageProps} />
    </Canvas>
  )
}

export default MyApp
