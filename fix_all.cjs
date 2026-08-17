const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Use a regex to replace the old generateContent blocks
code = code.replace(/const response = await ai\.models\.generateContent\(\{[\s\S]*?\}\);/g, (match) => {
  return match
    .replace('ai.models.generateContent', 'ai.interactions.create')
    .replace(/model: '.*'/, "model: 'gemini-3.7-flash'")
    .replace(/contents: \[/, "input: [")
    .replace(/inlineData: \{/g, "")
    .replace(/data: base64Data,/g, "type: mimeType.startsWith('image/') ? 'image' : 'document',\n              mime_type: mimeType,\n              data: base64Data")
    .replace(/mimeType\n\s*\}/g, "")
    .replace(/,\n\s*\}\n\s*\]/g, "\n        ]")
    .replace(/config: \{\n\s*responseMimeType: "application\/json"\n\s*\}/g, "response_format: { type: 'json' }")
});

// Since the old code had "const text = response.text", we need to change that to interaction.output_text
code = code.replace(/const text = response\.text;/g, "const text = response.output_text;");
code = code.replace(/const text = response\.text \? response\.text\.trim\(\) : "";/g, "const text = response.output_text ? response.output_text.trim() : \"\";");

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts correctly");
