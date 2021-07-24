import { useRef, useState, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Box = (props, ref) => {
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)

  useFrame(() => {
    // ref.current.rotation.x = ref.current.rotation.y += 0.01
  })

  function handleClick(e) {
    setActive(true)
  }

  return (
    <mesh 
      {...props}
      ref={ref}
      onClick={e => { setActive(!active) }}
      scale={active ? 1.2 : 1}
      onPointerOver={e => { setHover(true) }}
      onPointerOut={e => { setHover(false) }}
      >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hover ? 'hotPink' : 'orange'} />
    </mesh>
  )
}

export default forwardRef(Box)