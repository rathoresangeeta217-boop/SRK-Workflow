const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldParser = `function parseJsonOutput(text) {
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

const newParser = `function parseJsonOutput(text) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('\`\`\`json')) {
      cleaned = cleaned.replace(/^\`\`\`json\\s*/, '');
      cleaned = cleaned.replace(/\\s*\`\`\`$/, '');
    } else if (cleaned.startsWith('\`\`\`')) {
      cleaned = cleaned.replace(/^\`\`\`\\s*/, '');
      cleaned = cleaned.replace(/\\s*\`\`\`$/, '');
    }
    return JSON.parse(cleaned);
  } catch (e) {
    const match = text.match(/\\{[\\s\\S]*\\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw e;
  }
}`;

code = code.replace(oldParser, newParser);
fs.writeFileSync('server.ts', code);
console.log("Improved parser");
