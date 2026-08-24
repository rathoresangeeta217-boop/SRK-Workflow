const fs = require('fs');
let content = fs.readFileSync('src/lib/orders.ts', 'utf8');

if (!content.includes('products?:')) {
  content = content.replace(
    'export interface OrderDetails {',
    'export interface OrderProduct {\n  id: string;\n  name: string;\n  quantity: number;\n  isDispatched: boolean;\n}\n\nexport interface OrderDetails {\n  products?: OrderProduct[];'
  );
  fs.writeFileSync('src/lib/orders.ts', content);
}
