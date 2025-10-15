// generate-uuids.js
// 使い方: node generate-uuids.js [count]
// デフォルト count = 5000
const fs = require('fs');
const { randomUUID } = require('crypto');

const count = process.argv[2] ? Number(process.argv[2]) : 5000;
if (!Number.isInteger(count) || count <= 0) {
  console.error('Usage: node generate-uuids.js [count]');
  process.exit(1);
}

const outPath = 'uuids.txt';
const ws = fs.createWriteStream(outPath, { encoding: 'utf8' });

for (let i = 0; i < count; i++) {
  ws.write(randomUUID() + (i === count - 1 ? '' : '\n'));
}
ws.end();

ws.on('finish', () => console.log(`${outPath} written (${count} UUIDs)`));
ws.on('error', (err) => { console.error(err); process.exit(1); });
