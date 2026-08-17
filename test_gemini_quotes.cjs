const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const mimeType = 'image/png';
  const catalog = [
    { id: "1", category: "product", items: ["Black office chair"] },
    { id: "2", category: "product", items: ["Wooden desk"] }
  ];
  
  const prompt = `You are an AI visual search assistant. 
I have uploaded a reference image of a product.
Here is a JSON catalog of available items (described by text):
${JSON.stringify(catalog)}

Task: 
1. Identify the main object(s) in the image.
2. Return ALL items in the JSON catalog that match the object in the image in ANY broad sense (e.g., if the image is a chair, match EVERY chair, sofa, or seating item in the catalog). When in doubt, err on the side of matching MORE items rather than fewer.
3. Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matched items. 
If the catalog is entirely unrelated, return {"matchingIds": []}. Do not return any other text.`;

  const response = await ai.interactions.create({
    model: 'gemini-3.7-flash',
    input: [
      { type: 'text', text: prompt },
      {
        type: 'image',
        mime_type: mimeType,
        data: base64Data
      }
    ]
  });
  console.log("Output:", response.output_text);
}
run();
