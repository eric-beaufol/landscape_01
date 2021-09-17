import { forwardRef, useEffect, useRef } from "react"
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import styles from '../styles/Noise.module.css'
import { Clock, Vector2 } from 'three'

const vertex = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`
const fragment = `
  # ifdef GL_ES
  precision mediump float;
  # endif

  #define TWO_PI 6.28318530718
  #define PI 3.14159265359

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  vec2 random2(vec2 st) {
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;
    vec2 pos = vec2(st*10.);
    vec3 color = vec3(noise(pos + u_time)*.5 + .5);
    
    gl_FragColor = vec4(color, 1.); 
  }
`

const Noise = (props, ref) => {
  let clock
  const shaderRef = useRef()

  useEffect(() => {
    clock = new Clock()

    animate()
  }, [])

  function animate() {
    if (shaderRef.current && shaderRef.current.uniforms) {
      shaderRef.current.uniforms.u_time.value = clock.getElapsedTime()
    }


    requestAnimationFrame(animate)
  }

  return (
    <div className={styles.canvas}>
      <Canvas ref={ref} crossOrigin={"anonymous"}>
        <mesh>
          <planeBufferGeometry args={[2, 2]}/>
          <shaderMaterial
            uniforms={{
              u_resolution: { type: "v2", value: new Vector2(256, 256) },
              u_time: { type: "f", value: 1.0 }
            }}
            vertexShader={vertex}
            fragmentShader={fragment}
            ref={shaderRef}
          />
        </mesh>
      </Canvas>
    </div>
  )
}

export default forwardRef(Noise)