const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldPrompt = `          "gst": "...",
          "totalItems": 0,
          "totalAmount": "0.00",
          "advancePayment": "...",
          "transportationCharges": "...",
          "installationCharges": "..."
        }
        Look for any mention of advance payment requirements`;

const newPrompt = `          "gst": "...",
          "totalItems": 0,
          "products": [
            { "name": "...", "quantity": 0 }
          ],
          "totalAmount": "0.00",
          "advancePayment": "...",
          "transportationCharges": "...",
          "installationCharges": "..."
        }
        Look for any mention of advance payment requirements`;

content = content.replace(oldPrompt, newPrompt);
fs.writeFileSync('server.ts', content);
