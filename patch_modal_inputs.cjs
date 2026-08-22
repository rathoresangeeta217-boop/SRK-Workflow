const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `value={record.advancePayment || record.advanceRequirement || ''}`,
  `value={record.advancePayment || record.advanceRequirement || '₹50,000'}`
);

code = code.replace(
  `value={record.transportationCharges || record.loadingCharges || ''}`,
  `value={record.transportationCharges || record.loadingCharges || '₹2,000'}`
);

code = code.replace(
  `value={record.installationCharges || ''}`,
  `value={record.installationCharges || '₹5,000'}`
);

fs.writeFileSync(file, code);
console.log("Patched modal inputs");
