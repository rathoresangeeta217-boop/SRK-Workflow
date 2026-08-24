const fs = require('fs');
let content = fs.readFileSync('src/lib/payments.ts', 'utf8');

content = content.replace(
  "  sourceType?: 'Bank' | 'Cash' | 'Cheque';",
  "  sourceType?: 'Bank' | 'Cash' | 'Cheque';\n  bankName?: 'SBI' | 'Union' | 'PR';"
);

fs.writeFileSync('src/lib/payments.ts', content);
