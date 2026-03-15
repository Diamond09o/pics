const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function pngBuffer(w, h, r, g, b, a) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowBytes = 1 + w * 4;
  const data = Buffer.alloc(rowBytes * h);
  for (let y = 0; y < h; y++) {
    const off = y * rowBytes;
    data[off] = 0;
    for (let x = 0; x < w; x++) {
      const i = off + 1 + x * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }
  }

  const comp = zlib.deflateSync(data);

  const chunks = [];
  function makeChunk(type, payload) {
    const t = Buffer.from(type, 'ascii');
    const len = Buffer.alloc(4);
    len.writeUInt32BE(payload.length, 0);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, payload])), 0);
    return Buffer.concat([len, t, payload, crc]);
  }

  chunks.push(makeChunk('IHDR', ihdr));
  chunks.push(makeChunk('IDAT', comp));
  chunks.push(makeChunk('IEND', Buffer.alloc(0)));

  return Buffer.concat([sig, ...chunks]);
}

fs.mkdirSync('public/pics', { recursive: true });
fs.writeFileSync('public/pics/icon-192.png', pngBuffer(192, 192, 0, 123, 255, 255));
fs.writeFileSync('public/pics/icon-512.png', pngBuffer(512, 512, 0, 123, 255, 255));
console.log('generated icons');
