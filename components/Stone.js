const Stone = (props) => {
  return (
    <mesh {...props}>
      <dodecahedronBufferGeometry args={[10, 0]}/>
      <meshStandardMaterial color={0x6a7178}/>
    </mesh>
  )
}

export default Stone