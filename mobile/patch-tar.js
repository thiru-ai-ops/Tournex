const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('exports.default = exports;')) {
      console.log(`Patching tar default export in: ${filePath}`);
      fs.appendFileSync(filePath, '\nexports.default = exports;\n');
    }
  } catch (err) {
    console.error(`Failed to patch ${filePath}:`, err.message);
  }
}

function traverseAndPatch(dir) {
  if (!fs.existsSync(dir)) return;
  
  // Check if this directory is the 'tar' module
  if (dir.endsWith(path.join('node_modules', 'tar'))) {
    const commonjsPath = path.join(dir, 'dist', 'commonjs');
    if (fs.existsSync(commonjsPath)) {
      patchFile(path.join(commonjsPath, 'index.js'));
      patchFile(path.join(commonjsPath, 'index.min.js'));
    }
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    // Avoid traversing inside .bin, tar itself (to prevent loop), or non-directories
    if (file === '.bin' || file === '.cache') continue;
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverseAndPatch(fullPath);
      }
    } catch (e) {
      // Ignore broken symlinks or permission issues
    }
  }
}

// Start patching from the local node_modules directory
const startDir = path.join(__dirname, 'node_modules');
console.log(`Scanning for tar installations in ${startDir}...`);
traverseAndPatch(startDir);
console.log('tar patching process completed.');
