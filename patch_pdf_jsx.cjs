const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

content = content.replace(
  '{pdfBlobUrl ? (',
  'pdfBlobUrl ? ('
);

content = content.replace(
  / \)\}\n\n                \) : \(/,
  ' )\n\n                ) : ('
);

fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched curly braces!");
