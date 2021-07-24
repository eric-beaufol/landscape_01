const Grass = () => {
  return (
    <mesh>
      <planeGeometry args={[.1, .3]}/>
      <meshBasicMaterial color={0x000000}/>
    </mesh>
  )
}