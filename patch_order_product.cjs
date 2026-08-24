const fs = require('fs');
let content = fs.readFileSync('src/lib/orders.ts', 'utf8');

content = content.replace(
  'export interface OrderProduct {\n  id: string;\n  name: string;\n  quantity: number;\n  isDispatched: boolean;\n}',
  'export interface OrderProduct {\n  id: string;\n  name: string;\n  quantity: number;\n  isDispatched: boolean;\n  size?: string;\n  image?: string;\n}'
);

fs.writeFileSync('src/lib/orders.ts', content);
