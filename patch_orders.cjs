const fs = require('fs');
let code = fs.readFileSync('src/lib/orders.ts', 'utf8');

const searchCode = `  poFileName?: string;
  poFileData?: string;
  drawingFileName?: string;
  drawingFileData?: string;
}`;

const replaceCode = `  poFileName?: string;
  poFileData?: string;
  drawingFileName?: string;
  drawingFileData?: string;
  advancePayment?: string;
  transportationCharges?: string;
  installationCharges?: string;
}`;

code = code.replace(searchCode, replaceCode);
fs.writeFileSync('src/lib/orders.ts', code);
console.log("Patched orders");
