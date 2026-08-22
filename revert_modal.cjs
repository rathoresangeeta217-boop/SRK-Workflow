const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Revert the state initialization default fallbacks
code = code.replace(
  `advancePayment: order.details?.advancePayment || "₹50,000",
          transportationCharges: order.details?.transportationCharges || "₹2,000",
          installationCharges: order.details?.installationCharges || "₹5,000",`,
  `advancePayment: order.details?.advancePayment || "",
          transportationCharges: order.details?.transportationCharges || "",
          installationCharges: order.details?.installationCharges || "",`
);

// 2. Revert the input field values
code = code.replace(
  `value={record.advancePayment || record.advanceRequirement || '₹50,000'}`,
  `value={record.advancePayment || record.advanceRequirement || ''}`
);
code = code.replace(
  `value={record.transportationCharges || record.loadingCharges || '₹2,000'}`,
  `value={record.transportationCharges || record.loadingCharges || ''}`
);
code = code.replace(
  `value={record.installationCharges || '₹5,000'}`,
  `value={record.installationCharges || ''}`
);

// 3. Revert the math calculations
code = code.replace(
  `const advance = parseVal(record.advancePayment || record.advanceRequirement || '₹50,000');
                        const transport = parseVal(record.transportationCharges || record.loadingCharges || '₹2,000');
                        const install = parseVal(record.installationCharges || '₹5,000');`,
  `const advance = parseVal(record.advancePayment || record.advanceRequirement);
                        const transport = parseVal(record.transportationCharges || record.loadingCharges);
                        const install = parseVal(record.installationCharges);`
);

fs.writeFileSync(file, code);
console.log("Reverted hardcoded values");
