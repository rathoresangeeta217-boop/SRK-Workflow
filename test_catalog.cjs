const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

const oldCatalog = `      const catalog = activeTab === 'products' 
        ? products.map(p => ({ id: p.id, name: p.name, specification: p.specification, category: 'product' }))
        : quotes.map(q => ({ id: q.id, category: q.category, items: q.items?.map(i => i.productName + ' ' + (i.specification || '')) }));`;

const newCatalog = `      const catalog = activeTab === 'products' 
        ? products.map(p => ({ 
            id: p.id, 
            name: p.name, 
            specification: p.specification, 
            category: 'product',
            image: p.details?.productImageData // Pass the base64 image if it exists
          }))
        : quotes.map(q => ({ 
            id: q.id, 
            category: q.category, 
            items: q.items?.map(i => i.productName + ' ' + (i.specification || '')),
            image: q.items && q.items.length > 0 ? q.items[0].imageUrl : undefined // Pass the first item's image
          }));`;

code = code.replace(oldCatalog, newCatalog);
fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated catalog to include images");
