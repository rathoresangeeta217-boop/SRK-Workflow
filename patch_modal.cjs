const fs = require('fs');
let content = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');
content = content.replace(
  /await onAddOrder\(\{\n\s*\.\.\.formData,\n\s*quotationFileName: fileName,/g,
  \`await onAddOrder({\n          ...formData,\n          products: parsedProducts,\n          quotationFileName: fileName,\`
);
fs.writeFileSync('src/components/NewOrderModal.tsx', content);
