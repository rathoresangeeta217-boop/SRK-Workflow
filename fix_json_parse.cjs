const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// A helper to clean text before parsing
const cleanBlock = `
function parseJsonOutput(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('\`\`\`json')) {
    cleaned = cleaned.replace(/^\`\`\`json\\s*/, '');
    cleaned = cleaned.replace(/\\s*\`\`\`$/, '');
  } else if (cleaned.startsWith('\`\`\`')) {
    cleaned = cleaned.replace(/^\`\`\`\\s*/, '');
    cleaned = cleaned.replace(/\\s*\`\`\`$/, '');
  }
  return JSON.parse(cleaned);
}`;

if (!code.includes('function parseJsonOutput')) {
  code = code.replace('async function startServer() {', cleanBlock + '\n\nasync function startServer() {');
}

code = code.replace(/const parsed = JSON\.parse\(text\);/g, "const parsed = parseJsonOutput(text);");

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts json parsing");
