import SimplexNoise from 'simplex-noise'

function randomNoise(canvas, x, y, width, height, alpha) {
    x = x || 0;
    y = y || 0;
    width = width || canvas.width;
    height = height || canvas.height;
    alpha = alpha || 255;
    var g = canvas.getContext("2d"),
        imageData = g.getImageData(x, y, width, height),
        random = Math.random,
        pixels = imageData.data,
        n = pixels.length,
        i = 0;
    while (i < n) {
        pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
        pixels[i++] = alpha;
    }
    g.putImageData(imageData, x, y);
    return canvas;
}

function perlinNoise2(ctx) {
  const canvas = ctx.canvas
  const simplex = new SimplexNoise()
  const imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imgdata.data
  const size = canvas.width
  let t = 0

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
        var r = simplex.noise3D(x / 16, y / 16, t/16) * 0.5 + 0.5;
        var g = simplex.noise3D(x / 8, y / 8, t/16) * 0.5 + 0.5;
        data[(x + y * size) * 4 + 0] = r * 255;
        data[(x + y * size) * 4 + 1] = (r + g) * 200;
        data[(x + y * size) * 4 + 2] = 0;
        data[(x + y * size) * 4 + 3] = 255;
    }
  }

  ctx.putImageData(imgdata, 0, 0);
}

function perlinNoise(canvas, noise) {
    noise = noise || randomNoise(canvas);
    var g = canvas.getContext("2d");
    g.save();
    
    /* Scale random iterations onto the canvas to generate Perlin noise. */
    for (var size = 6; size <= noise.width; size *= 2) {
        var x = (Math.random() * (noise.width - size)) | 0,
            y = (Math.random() * (noise.height - size)) | 0;
        g.globalAlpha = 4 / size;
        g.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
    }

    g.restore();
    return canvas;
}

// determine intensity of pixel, from 0 - 1
const intensity = value => {
  return value / 255
}

function clamp(pX, pMax) {
  if (pX > pMax) {
    return pMax
  } else if (pX < 0) {
    return 0
  } else {
    return pX
  }
}

// transform -1 - 1 to 0 - 255
const mapComponent = pX => {
    return (pX + 1.0) * (255.0 / 2.0)
}

function normalFromHeight(bitmapData, strength) {
    // assume square texture, not necessarily true in real code

    const data = bitmapData.data
    const textureSize = 200

    for (let row = 0; row < textureSize; row++) {
      for (let column = 0; column < textureSize; column++) {

        // surrounding pixels
        const topLeft = data[clamp(row * textureSize - 1, textureSize) + clamp(column - 1, textureSize)];
        const top = data[clamp(row * textureSize - 1, textureSize) + clamp(column, textureSize)];
        const topRight = data[clamp(row * textureSize - 1, textureSize) + clamp(column + 1, textureSize)];
        const right = data[clamp(row * textureSize, textureSize) + clamp(column + 1, textureSize)];
        const bottomRight = data[clamp(row * textureSize + 1, textureSize) + clamp(column + 1, textureSize)];
        const bottom = data[clamp(row * textureSize + 1, textureSize) + clamp(column, textureSize)];
        const bottomLeft = data[clamp(row * textureSize + 1, textureSize) + clamp(column - 1, textureSize)];
        const left = data[clamp(row * textureSize, textureSize) + clamp(column - 1, textureSize)];

          // their intensities
          const tl = intensity(topLeft);
          const t = intensity(top);
          const tr = intensity(topRight);
          const r = intensity(right);
          const br = intensity(bottomRight);
          const b = intensity(bottom);
          const bl = intensity(bottomLeft);
          const l = intensity(left);

    //         // sobel filter
          const dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl)
          const dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr)
          const dZ = 1.0 / strength

    // //         // math::vector3d v(dX, dY, dZ);
    // //         // v.normalize();

    //         // convert to rgb
        data[row * textureSize + column] = dX
        data[row * textureSize + column + 1] = dY
        data[row * textureSize + column + 2] = dZ
      }
    }

    return bitmapData;
}

export {
  randomNoise,
  perlinNoise,
  perlinNoise2,
  normalFromHeight
}