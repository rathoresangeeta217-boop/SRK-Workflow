const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Update /api/parse-order
const oldParse = `      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType
            }
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = response.text;
      if (!text) {
        throw new Error("No output from Gemini");
      }`;

const newParse = `      const interaction = await ai.interactions.create({
        model: 'gemini-3.7-flash',
        input: [
          {
            type: mimeType.startsWith('image/') ? 'image' : 'document',
            mime_type: mimeType,
            data: base64Data
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      });
      const text = interaction.output_text;
      if (!text) {
        throw new Error("No output from Gemini");
      }`;

code = code.replace(oldParse, newParse);

// Update /api/identify-product
const oldIdentify = `      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType
            }
          }
        ]
      });
      const text = response.text ? response.text.trim() : "";`;

const newIdentify = `      const interaction = await ai.interactions.create({
        model: 'gemini-3.7-flash',
        input: [
          {
            type: mimeType.startsWith('image/') ? 'image' : 'document',
            mime_type: mimeType,
            data: base64Data
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      });
      const text = interaction.output_text ? interaction.output_text.trim() : "";`;

code = code.replace(oldIdentify, newIdentify);

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts to use interactions API");
