const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const text = response.output_text ? response.output_text.trim() : "";\\n      try {\\n        const parsed = JSON.parse(text);',
  'const text = response.output_text ? response.output_text.trim() : "";\\n      console.log("Visual Match Raw Output:", text);\\n      try {\\n        const parsed = parseJsonOutput(text);'
);

fs.writeFileSync('server.ts', code);
console.log("Patched logging");
