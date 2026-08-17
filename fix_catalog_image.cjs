const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

code = code.replace(
  "image: q.items && q.items.length > 0 ? q.items[0].imageUrl : undefined",
  "image: q.items ? q.items.find((i: any) => i.imageUrl)?.imageUrl : undefined"
);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Fixed quote catalog image selection");
