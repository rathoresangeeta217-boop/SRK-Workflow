const fs = require('fs');
let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

content = content.replace(
  'alert("Failed to save payment record.");',
  'alert(`Failed to save payment record. ${error instanceof Error ? error.message : "Check console for details."}`);'
);

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
