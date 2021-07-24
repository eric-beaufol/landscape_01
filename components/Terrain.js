import { ClampToEdgeWrapping, FrontSide, RepeatWrapping, sRGBEncoding } from 'three'
import { useEffect, useState, useRef } from 'react'
import { TextureLoader } from 'three'
import { useHelper } from '@react-three/drei'
// import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'
import Stone from './Stone'

const Terrain = (props) => {
  const ref = useRef()
  const [stonePos, setStonePos] = useState()

  const loader = new TextureLoader()
  const heightMap = loader.load('/img/heightmap.png')
  const normalMap = loader.load('/img/normalmap.png')
  const envMap = loader.load('/img/envmap.jpeg')

  envMap.wrapS = RepeatWrapping
  envMap.wrapT = RepeatWrapping
  envMap.repeat.set(1, 1)

  useEffect(() => {
    console.log(ref.current)

    ref.current.geometry.computeVertexNormals()

    const vertices = ref.current.geometry.attributes.position.array
    const total = vertices.length / 3
    const random = Math.floor(Math.random() * total)
    const point = [-vertices[random * 3 + 1], vertices[random * 3 + 2], -vertices[random * 3]]

    setStonePos(point)

    console.log(vertices, total, point, random)
  }, [])

  // useEffect(() => {
  //   ref.current.material.repeat.set(10)
  //   console.log(ref.current)
  // })

  // useHelper(ref, VertexNormalsHelper, 1, 'green')

  return (
    <>
      {
        stonePos && (
          <Stone position={stonePos} />
        )
      }
      <mesh {...props} ref={ref}>
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
    </>
  )
}

export default Terrain