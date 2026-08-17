const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
  app.post("/api/visual-match", async (req, res) => {
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
I have uploaded a reference image of a product, and here is a JSON catalog of available items:
\${JSON.stringify(catalog)}

Task: Identify the exact product or highly similar products from the catalog that match the visual characteristics (type, material, shape, color, styling) of the uploaded image.
Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matching items.
If there are no matches, return {"matchingIds": []}. Do not return any other text.\`;

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
        response_format: { type: 'json' }
      });

      const text = response.output_text ? response.output_text.trim() : "";
      try {
        const parsed = JSON.parse(text);
        res.json({ matchingIds: parsed.matchingIds || [] });
      } catch (e) {
        res.json({ matchingIds: [] });
      }
    } catch (error) {
      console.error("Error matching product:", error);
      res.status(500).json({ error: error.message });
    }
  });
`;

code = code.replace(
  '// Vite middleware for development',
  newEndpoint + '\n  // Vite middleware for development'
);

fs.writeFileSync('server.ts', code);
console.log("Added /api/visual-match endpoint to server.ts");
