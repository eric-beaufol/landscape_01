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

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  float intensity(vec3 color) {
    float average = (color[0] + color[1] + color[2]) / 3.0;
    return average / 255.0;
  }

  float clamp(int pX, int pMax) {
    if (pX > pMax)
    {
      return pMax;
    }
    else if (pX < 0)
    {
      return 0;
    }
    else
    {
      return pX;
    }
  }

  float map_component(float pX) {
    return (pX + 1.0) * (255.0 / 2.0);
  }

  texture normal_from_height(const texture& pTexture, double pStrength = 2.0) {

    int textureSize = static_cast<int>(pTexture.size());
    
    for (size_t row = 0; row < textureSize; ++row)
    {
        for (size_t column = 0; column < textureSize; ++column)
        {
            // surrounding pixels
            const pixel topLeft = pTexture(clamp(row - 1, textureSize), clamp(column - 1, textureSize));
            const pixel top = pTexture(clamp(row - 1, textureSize), clamp(column, textureSize));
            const pixel topRight = pTexture(clamp(row - 1, textureSize), clamp(column + 1, textureSize));
            const pixel right = pTexture(clamp(row, textureSize), clamp(column + 1, textureSize));
            const pixel bottomRight = pTexture(clamp(row + 1, textureSize), clamp(column + 1, textureSize));
            const pixel bottom = pTexture(clamp(row + 1, textureSize), clamp(column, textureSize));
            const pixel bottomLeft = pTexture(clamp(row + 1, textureSize), clamp(column - 1, textureSize));
            const pixel left = pTexture(clamp(row, textureSize), clamp(column - 1, textureSize));

            // their intensities
            const double tl = intensity(topLeft);
            const double t = intensity(top);
            const double tr = intensity(topRight);
            const double r = intensity(right);
            const double br = intensity(bottomRight);
            const double b = intensity(bottom);
            const double bl = intensity(bottomLeft);
            const double l = intensity(left);

            // sobel filter
            const double dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
            const double dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);
            const double dZ = 1.0 / pStrength;

            math::vector3d v(dX, dY, dZ);
            v.normalize();

            // convert to rgb
            result(row, column) = pixel(map_component(v.x), map_component(v.y), map_component(v.z));
        }
    }

    return result;
}

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;
    vec3 color = vec3(0.0);
    
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