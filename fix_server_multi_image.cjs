const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldVisualMatch = `  app.post("/api/visual-match", async (req, res) => {
    try {
      const { imageData, catalog } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Invalid data URL format" });
      }

      const mimeType = match[1];
      const base64Data = match[2];

      const prompt = \`You are an AI visual search assistant. 
I have uploaded a reference image of a product.
Here is a JSON catalog of available items (described by text):
\${JSON.stringify(catalog)}

Task: 
1. Identify the main object(s) in the image.
2. Return ALL items in the JSON catalog that match the object in the image in ANY broad sense (e.g., if the image is a chair, match EVERY chair, sofa, or seating item in the catalog). When in doubt, err on the side of matching MORE items rather than fewer.
3. Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matched items. 
If the catalog is entirely unrelated, return {"matchingIds": []}. Do not return any other text.\`;

      const response = await ai.interactions.create({
        model: 'gemini-3.7-flash',
        input: [
          { type: 'text', text: prompt },
          {
            type: mimeType.startsWith('image/') ? 'image' : 'document',
            mime_type: mimeType,
            data: base64Data
          }
        ],
        
      });`;

const newVisualMatch = `  app.post("/api/visual-match", async (req, res) => {
    try {
      const { imageData, catalog } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Invalid data URL format" });
      }

      const mimeType = match[1];
      const base64Data = match[2];

      const parts = [];
      parts.push({ type: 'text', text: "You are an AI visual search assistant. I am providing a REFERENCE IMAGE of a product below. Your goal is to find ALL items in the catalog that visually match or are similar to this reference image.\\n\\nREFERENCE IMAGE:" });
      parts.push({
        type: mimeType.startsWith('image/') ? 'image' : 'document',
        mime_type: mimeType,
        data: base64Data
      });
      
      parts.push({ type: 'text', text: "\\n\\nHere is the catalog of available items. Some items have text descriptions, and some have their own reference images attached:\\n" });
      
      const catalogCleaned = [];
      for (const item of catalog) {
        let itemDesc = \`Item ID: \${item.id}\\n\`;
        if (item.name) itemDesc += \`Name: \${item.name}\\n\`;
        if (item.specification) itemDesc += \`Specification: \${item.specification}\\n\`;
        if (item.items) itemDesc += \`Items: \${JSON.stringify(item.items)}\\n\`;
        
        parts.push({ type: 'text', text: itemDesc });
        
        if (item.image) {
          const imgMatch = item.image.match(/^data:([^;]+);base64,(.+)$/);
          if (imgMatch) {
            parts.push({ type: 'text', text: "Image for this item:" });
            parts.push({
              type: 'image',
              mime_type: imgMatch[1],
              data: imgMatch[2]
            });
          }
        }
        parts.push({ type: 'text', text: "\\n---\\n" });
      }

      parts.push({ type: 'text', text: \`\\nTask:
1. Look at the REFERENCE IMAGE.
2. Look at all the items in the catalog (both their text and their images, if provided).
3. Identify ALL items in the catalog that are visually the SAME or HIGHLY SIMILAR to the reference image. If the reference image is the exact same photo as a catalog item's photo, it is a guaranteed match. Even if they are just similar types of items (e.g. both are office chairs), include them.
4. Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matched items. If no items match, return {"matchingIds": []}. Do not return any other text.\` });

      const response = await ai.interactions.create({
        model: 'gemini-3.7-flash',
        input: parts
      });`;

code = code.replace(oldVisualMatch, newVisualMatch);
fs.writeFileSync('server.ts', code);
console.log("Updated server.ts for multi-modal catalog matching");
