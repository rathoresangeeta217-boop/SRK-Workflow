const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldPrompt = `      const prompt = \`You are an AI visual search assistant. 
I have uploaded a reference image of a product.
Here is a JSON catalog of available items (described by text):
\${JSON.stringify(catalog)}

Task: 
1. Identify the main object(s) in the image.
2. Find ALL items in the JSON catalog that match the object in the image, even loosely (e.g. if the image is a chair, match any chairs in the catalog).
3. Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matched items. 
If nothing matches, return {"matchingIds": []}. Do not return any other text.\`;`;

const newPrompt = `      const prompt = \`You are an AI visual search assistant. 
I have uploaded a reference image of a product.
Here is a JSON catalog of available items (described by text):
\${JSON.stringify(catalog)}

Task: 
1. Identify the main object(s) in the image.
2. Return ALL items in the JSON catalog that match the object in the image in ANY broad sense (e.g., if the image is a chair, match EVERY chair, sofa, or seating item in the catalog). When in doubt, err on the side of matching MORE items rather than fewer.
3. Return ONLY a JSON object with a single array property "matchingIds" containing the string IDs of the matched items. 
If the catalog is entirely unrelated, return {"matchingIds": []}. Do not return any other text.\`;`;

code = code.replace(oldPrompt, newPrompt);
fs.writeFileSync('server.ts', code);
console.log("Updated prompt to be lenient");
