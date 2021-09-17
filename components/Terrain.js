import { FrontSide, RepeatWrapping, CanvasTexture } from 'three'
import { useEffect, useState, useRef } from 'react'
import { useHelper, useTexture } from '@react-three/drei'
// import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'
import Stone from './Stone'
import styles from '../styles/Terrain.module.css'

const Terrain = (props) => {
  let texture
  const ref = useRef()
  const [heightMap, setHeightMap] = useState(useTexture('/img/heightmap.png'))
  const [normalMap, setNormalMap] = useState(useTexture('/img/normalmap.png'))
  const [stonePos, setStonePos] = useState()
  let canvas, ctx

  // const heightMap = useTexture('/img/heightmap.png')
  // heightMap.wrapS = RepeatWrapping
  // heightMap.wrapT = RepeatWrapping
  // heightMap.anisotropy = 16

  // const normalMap = useTexture('/img/normalmap.png')
  // normalMap.wrapS = RepeatWrapping
  // normalMap.wrapT = RepeatWrapping
  // normalMap.anisotropy = 16

  useEffect(() => {
    //createHeightMapCanvas()
    if (props.noiseCanvas) {
      setTimeout(applyCanvasTexture, 1000)
    }

    return () => {
      //canvas.removeEventListener('click', updateStonePosition)
    }
  }, [props.noiseCanvas])

  function applyCanvasTexture() {
    texture = new CanvasTexture(props.noiseCanvas.current)

    ref.current.material.displacementMap = texture
    ref.current.material.needsUpdate = true

    requestAnimationFrame(applyCanvasTexture)
  }

  function updateStonePosition(e) {
    const normalizeX = e.clientX / e.target.offsetWidth
    const normalizeY = e.clientY / e.target.offsetHeight

    const height = getHeightFromHeightMap(e.clientX, e.clientY)
    updateHeightMapCanvas(e.clientX, e.clientY)

    let row = Math.floor(41 * normalizeY)
    let col = Math.round(41 * normalizeX)
    const verticeIndex = 41 * row + col

    console.log(height)

    const vertices = ref.current.geometry.attributes.position.array
    const point = [vertices[verticeIndex * 3], vertices[verticeIndex * 3 + 1], height]

    setStonePos(point)
  }

  function createHeightMapCanvas() {
    canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    ctx = canvas.getContext('2d')
    ctx.drawImage(heightMap.image, 0, 0, canvas.width, canvas.height)

    document.body.appendChild(canvas)
    canvas.classList.add(styles.canvas)
    canvas.addEventListener('click', updateStonePosition)
  }

  function updateHeightMapCanvas(x, y) {
    ctx.drawImage(heightMap.image, 0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false)
    ctx.fillStyle = 'red'
    ctx.fill()
  }

  function getHeightFromHeightMap(x, y) {
    const pixelData = ctx.getImageData(x, y, 1, 1).data
    console.log(pixelData)

    return pixelData[0] / 255 * 100
  }

  return (
    <>
      <group {...props}>
        {
          stonePos && (
            <Stone position={stonePos} />
          )
        }
        <mesh ref={ref}>
          <planeGeometry args={[1024, 1024, 40, 40]} lookAt={[0, 1, 0]} />
          <meshStandardMaterial
            displacementMap={heightMap}
            displacementScale={100}
            normalMap={normalMap}
            normalScale={.1}
            side={FrontSide}
            color={0x4477a9}
            metalness={.1}
            roughness={.8}
          />
        </mesh>
      </group>
    </>
  )
}

export default Terrain