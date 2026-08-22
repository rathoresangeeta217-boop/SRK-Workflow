const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const searchCode = `        Expected JSON structure:
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
        Leave string values as empty strings and number values as 0 if they are not found. For totalAmount include the currency symbol if found.`;

const replaceCode = `        Expected JSON structure:
        {
          "customerName": "...",
          "companyName": "...",
          "mobileNumber": "...",
          "email": "...",
          "address": "...",
          "gst": "...",
          "totalItems": 0,
          "totalAmount": "0.00",
          "advancePayment": "...",
          "transportationCharges": "...",
          "installationCharges": "..."
        }
        Look for any mention of advance payment requirements, transportation/freight/loading charges, or installation charges, and extract their string values (including currency symbols or percentages). Leave string values as empty strings and number values as 0 if they are not found. For totalAmount include the currency symbol if found.`;

code = code.replace(searchCode, replaceCode);
fs.writeFileSync('server.ts', code);
console.log("Patched server prompt");
