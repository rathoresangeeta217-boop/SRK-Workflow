const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const parsed = parseJsonOutput(text);',
  'console.log("Visual Match Raw Output:", text);\n        const parsed = parseJsonOutput(text);'
);

fs.writeFileSync('server.ts', code);
console.log("Patched logging 2");
