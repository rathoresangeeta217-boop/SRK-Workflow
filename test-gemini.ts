import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: 'hello',
  });
  console.log("1.5 worked:", response.text);
  } catch(e) { console.error(e) }
}
run().catch(console.error);
