import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
          "totalAmount": "0.00"
        }
        Leave string values as empty strings and number values as 0 if they are not found. For totalAmount include the currency symbol if found.
      `;

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
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No output from Gemini");
      }
      
      const parsed = JSON.parse(text);
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
