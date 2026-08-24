const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldProducts = `"products": [
            { "name": "...", "quantity": 0 }
          ],`;
const newProducts = `"products": [
            { "name": "...", "quantity": 0, "size": "..." }
          ],`;

content = content.replace(oldProducts, newProducts);
fs.writeFileSync('server.ts', content);
