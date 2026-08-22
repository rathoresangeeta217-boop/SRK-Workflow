const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix key={something || i}
      content = content.replace(/key=\{([a-zA-Z0-9_.]+(?:\.docId|\.id)(?:\s*\|\|\s*[a-zA-Z0-9_.]+\.id)?)\s*\|\|\s*([a-zA-Z0-9_]+)\}/g, (match, p1, p2) => {
        return `key={\`\${${p1} || 'k'}-\${${p2}}\`}`;
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('src');
console.log('Done');
