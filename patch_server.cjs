const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/model: 'gemini-3\.1-flash-lite'/g, "model: 'gemini-3.7-flash'");

fs.writeFileSync('server.ts', content);
