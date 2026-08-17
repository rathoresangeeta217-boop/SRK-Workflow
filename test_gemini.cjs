const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const mimeType = 'image/png';
  const catalog = [
    { id: "1", name: "Black office chair", category: "product" },
    { id: "2", name: "Wooden desk", category: "product" }
  ];
  
  const prompt = `You are an AI visual search assistant. 
I have uploaded a reference image of a product, and here is a JSON catalog of available items:
${JSON.stringify(catalog)}

Task: Identify the exact product or highly similar products from the catalog that match the visual characteristics (type, material, shape, color, styling) of the uploaded image.
Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matching items.
If there are no matches, return {"matchingIds": []}. Do not return any other text.`;

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
