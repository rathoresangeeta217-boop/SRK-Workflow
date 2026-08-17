const fs = require('fs');
let code = fs.readFileSync('src/lib/products.ts', 'utf8');
code = code.replace(/perUnitPrice\?: string;/g, 'perUnitPrice?: string;\n  category?: string;');
code = code.replace(/createdAt: any;/g, 'category?: string;\n  createdAt: any;');
fs.writeFileSync('src/lib/products.ts', code);
