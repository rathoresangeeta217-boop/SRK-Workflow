const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

// Remove the {quote.status === 'pending' && ( condition around the buttons, or just change it to always show.
code = code.replace(
  "{quote.status === 'pending' && (",
  "{true && ("
);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated PurchaseTab.tsx buttons visibility");
