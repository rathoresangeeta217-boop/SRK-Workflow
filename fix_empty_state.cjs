const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

code = code.replace(
  'No quotes found. Click "Request Quote" to create one.',
  '{quoteSearchQuery ? `No quotes found matching "${quoteSearchQuery}"` : \'No quotes found. Click "Request Quote" to create one.\'}'
);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated empty state");
