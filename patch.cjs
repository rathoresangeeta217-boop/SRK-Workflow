const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');
code = code.replace(
  'key={`${quote.docId || quote.id || \'k\'}-${itemIdx}`}',
  'key={`quote-${i}-item-${itemIdx}`}'
);
fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
