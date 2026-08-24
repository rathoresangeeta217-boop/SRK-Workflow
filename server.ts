import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


function parseJsonOutput(text) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '');
      cleaned = cleaned.replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '');
      cleaned = cleaned.replace(/\s*```$/, '');
    }
    return JSON.parse(cleaned);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw e;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase the payload limit for file uploads (base64)
  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.post("/api/parse-order", async (req, res) => {
    try {
      const { fileData } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Missing file data" });
      }

      // fileData is a data URL like "data:application/pdf;base64,..."
      const match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Invalid data URL format" });
      }

      const mimeType = match[1];
      const base64Data = match[2];

      const prompt = `
        Analyze this file and extract the following order details in JSON format.
        Return ONLY valid JSON.
        Expected JSON structure:
        {
          "customerName": "...",
          "companyName": "...",
          "mobileNumber": "...",
          "email": "...",
          "address": "...",
          "gst": "...",
          "totalItems": 0,
          "products": [
            { "name": "...", "quantity": 0, "size": "... (extract exact description/specifications here)" }
          ],
          "totalAmount": "0.00",
          "advancePayment": "...",
          "transportationCharges": "...",
          "installationCharges": "..."
        }
        Look for any mention of advance payment requirements, transportation/freight/loading charges, or installation charges, and extract their string values (including currency symbols or percentages). Leave string values as empty strings and number values as 0 if they are not found. For totalAmount include the currency symbol if found.
      `;

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
        
      });

      const text = response.output_text;
      if (!text) {
        throw new Error("No output from Gemini");
      }
      
      console.log("Visual Match Raw Output:", text);
        const parsed = parseJsonOutput(text);
      res.json(parsed);
    } catch (error: any) {
      console.error("Error parsing order:", error);
      
      let errorMessage = error.message;
      try {
        const errObj = JSON.parse(error.message);
        if (errObj.error && errObj.error.message) {
          errorMessage = errObj.error.message;
        }
      } catch (e) {
        // ignore parsing error
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/api/identify-product", async (req, res) => {
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

      const prompt = `Identify the main product or furniture item in this image. 
      Return ONLY a short, concise name (2-4 words maximum) that can be used as a search query. 
      For example: "Office Chair", "Wooden Desk", "Conference Table", "Drawer Handle".`;

      const response = await ai.interactions.create({
        model: 'gemini-3.7-flash',
        input: [
          { type: 'text', text: prompt },
          {
            
              type: mimeType.startsWith('image/') ? 'image' : 'document',
              mime_type: mimeType,
              data: base64Data
              
          }
        ]
      });

      const text = response.output_text ? response.output_text.trim() : "";
      res.json({ searchQuery: text });
    } catch (error) {
      console.error("Error identifying product:", error);
      res.status(500).json({ error: error.message });
    }
  });

  
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

      const parts = [];
      parts.push({ type: 'text', text: "You are an AI visual search assistant. I am providing a REFERENCE IMAGE of a product below. Your goal is to find ALL items in the catalog that visually match or are similar to this reference image.\n\nREFERENCE IMAGE:" });
      parts.push({
        type: mimeType.startsWith('image/') ? 'image' : 'document',
        mime_type: mimeType,
        data: base64Data
      });
      
      parts.push({ type: 'text', text: "\n\nHere is the catalog of available items. Some items have text descriptions, and some have their own reference images attached:\n" });
      
      const catalogCleaned = [];
      for (const item of catalog) {
        let itemDesc = `Item ID: ${item.id}\n`;
        if (item.name) itemDesc += `Name: ${item.name}\n`;
        if (item.specification) itemDesc += `Specification: ${item.specification}\n`;
        if (item.items) itemDesc += `Items: ${JSON.stringify(item.items)}\n`;
        
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
        parts.push({ type: 'text', text: "\n---\n" });
      }

      parts.push({ type: 'text', text: `\nTask:
1. Look at the REFERENCE IMAGE.
2. Look at all the items in the catalog (both their text and their images, if provided).
3. Identify ALL items in the catalog that are visually the SAME or HIGHLY SIMILAR to the reference image. If the reference image is the exact same photo as a catalog item's photo, it is a guaranteed match. Even if they are just similar types of items (e.g. both are office chairs), include them.
4. Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matched items. If no items match, return {"matchingIds": []}. Do not return any other text.` });

      const response = await ai.interactions.create({
        model: 'gemini-3.7-flash',
        input: parts
      });

      const text = response.output_text ? response.output_text.trim() : "";
      try {
        const parsed = parseJsonOutput(text);
        res.json({ matchingIds: parsed.matchingIds || [] });
      } catch (e) {
        res.json({ matchingIds: [] });
      }
    } catch (error) {
      console.error("Error matching product:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
