const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const parts = [
      { type: 'text', text: "Hello" },
      { type: 'image', mime_type: 'image/png', data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' }
    ];
    console.log("Calling...");
    const res = await ai.interactions.create({
      model: 'gemini-3.1-flash-lite',
      input: parts
    });
    console.log("Success", res.output_text);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
