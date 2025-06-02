const fs = require('fs');
const path = require('path');

const target = process.argv[2]; // 'chrome' or 'firefox'

if (!['chrome', 'firefox'].includes(target)) {
  console.error("Usage: node build.js chrome|firefox");
  process.exit(1);
}

const dest = path.join(__dirname, `../dist/`);

const manifest = path.join(__dirname, `../manifests/${target}.manifest.json`);
const pop_ui = path.join(__dirname, `../src/popup.html`);
const styles = path.join(__dirname, `../src/styles.css`);

fs.copyFileSync(manifest, dest + 'manifest.json');
fs.copyFileSync(pop_ui, dest + 'popup.html')
fs.copyFileSync(styles, dest + 'styles.css')

console.log(`Copied ${target} files to folder dist`);
