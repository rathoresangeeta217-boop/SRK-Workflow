const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /"products": \[\n\s*\{ "name": "\.\.\.", "quantity": 0, "size": "\.\.\." \}\n\s*\],/,
  `"products": [
            { "name": "...", "quantity": 0, "size": "... (extract exact description/specifications here)" }
          ],`
);

fs.writeFileSync('server.ts', content);
console.log("Patched prompt in server.ts");
