const fs = require('fs');
const path = require('path');

const target = process.argv[2]; // 'chrome' or 'firefox'

if (!['chrome', 'firefox'].includes(target)) {
  console.error("Usage: node build.js chrome|firefox");
  process.exit(1);
}

const manifestSource = path.join(__dirname, `../manifests/${target}.manifest.json`);
const manifestDest = path.join(__dirname, `../dist/${target}/manifest.json`);

fs.copyFileSync(manifestSource, manifestDest);
console.log(`Copied ${target} manifest to dist/${target}/manifest.json`);
