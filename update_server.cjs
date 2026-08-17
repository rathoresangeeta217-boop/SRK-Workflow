const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newRoute = `  app.post("/api/identify-product", async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Invalid data URL format" });
      }

      const mimeType = match[1];
      const base64Data = match[2];

      const prompt = \`Identify the main product or furniture item in this image. 
      Return ONLY a short, concise name (2-4 words maximum) that can be used as a search query. 
      For example: "Office Chair", "Wooden Desk", "Conference Table", "Drawer Handle".\`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
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

      const text = response.text ? response.text.trim() : "";
      res.json({ searchQuery: text });
    } catch (error) {
      console.error("Error identifying product:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });
`;

code = code.replace(
  '  // Vite middleware for development',
  newRoute + '\n  // Vite middleware for development'
);

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts with /api/identify-product");
