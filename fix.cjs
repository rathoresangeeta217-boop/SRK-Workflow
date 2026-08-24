const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');
content = content.replace(
  /const itemCount = order\.items \|\| 1;[\s\S]*?setProducts\(mockProducts\);/,
  "setProducts([]);"
);
fs.writeFileSync('src/components/DispatchView.tsx', content);
