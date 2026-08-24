const fs = require('fs');
let content = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');

content = content.replace(
  '{ id: Math.random().toString(36).substr(2, 9), name: p.name, quantity: p.quantity, isDispatched: false }',
  '{ id: Math.random().toString(36).substr(2, 9), name: p.name, quantity: p.quantity, size: p.size, isDispatched: false }'
);

fs.writeFileSync('src/components/NewOrderModal.tsx', content);
