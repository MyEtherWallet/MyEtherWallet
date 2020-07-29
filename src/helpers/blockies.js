const randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

function seedrand(seed) {
  for (let i = 0; i < randseed.length; i++) {
    randseed[i] = 0;
  }
  for (let j = 0; j < seed.length; j++) {
    randseed[j % 4] =
      (randseed[j % 4] << 5) - randseed[j % 4] + seed.charCodeAt(j);
  }
}

function rand() {
  // based on Java's String.hashCode(), expanded to 4 32bit values
  const t = randseed[0] ^ (randseed[0] << 11);

  randseed[0] = randseed[1];
  randseed[1] = randseed[2];
  randseed[2] = randseed[3];
  randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);

  return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
}

function createColor() {
  // saturation is the whole color spectrum
  const h = Math.floor(rand() * 360);
  // saturation goes from 40 to 100, it avoids greyish colors
  const s = rand() * 60 + 40 + '%';
  // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
  const l = (rand() + rand() + rand() + rand()) * 25 + '%';

  const color = 'hsl(' + h + ',' + s + ',' + l + ')';
  return color;
}

function createImageData(size) {
  const width = size; // Only support square icons for now
  const height = size;

  const dataWidth = Math.ceil(width / 2);
  const mirrorWidth = width - dataWidth;

  const data = [];
  for (let y = 0; y < height; y++) {
    let row = [];
    for (let x = 0; x < dataWidth; x++) {
      // this makes foreground and background color to have a 43% (1/2.3) probability
      // spot color has 13% chance
      row[x] = Math.floor(rand() * 2.3);
    }
    const r = row.slice(0, mirrorWidth);
    r.reverse();
    row = row.concat(r);

    for (let i = 0; i < row.length; i++) {
      data.push(row[i]);
    }
  }

  return data;
}

function createCanvas(imageData, color, scale, bgcolor, spotcolor) {
  const width = Math.sqrt(imageData.length);
  const c = document.createElement('canvas');
  c.width = c.height = width * scale;
  const cc = c.getContext('2d');
  cc.fillStyle = bgcolor;
  cc.fillRect(0, 0, c.width, c.height);
  cc.fillStyle = color;

  for (let i = 0; i < imageData.length; i++) {
    const row = Math.floor(i / width);
    const col = i % width;
    cc.fillStyle = imageData[i] === 1 ? color : spotcolor;
    if (imageData[i]) {
      cc.fillRect(col * scale, row * scale, scale, scale);
    }
  }
  return c;
}

function createIcon(opts) {
  opts = opts || {};
  const size = opts.size || 8;
  const scale = opts.scale || 4;
  const seed =
    opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);
  seedrand(seed);
  const color = opts.color || createColor();
  const bgcolor = opts.bgcolor || createColor();
  const spotcolor = opts.spotcolor || createColor();
  const imageData = createImageData(size);
  const canvas = createCanvas(imageData, color, scale, bgcolor, spotcolor);

  return canvas;
}
export default createIcon;
