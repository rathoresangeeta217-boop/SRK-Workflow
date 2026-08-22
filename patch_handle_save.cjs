const fs = require('fs');
let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

content = content.replace(
  "      await savePaymentRecord(recordToSave as PaymentRecord);\n      onClose();",
  "      await savePaymentRecord(recordToSave as PaymentRecord);\n      setIsEditingAmount(false);\n      onClose();"
);

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
