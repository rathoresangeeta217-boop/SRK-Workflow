const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `placeholder="e.g. ₹50,000"`, // Edited Amount
  `placeholder="e.g. ₹50,000"` // leave alone
);
code = code.replace(
  `value={record.advancePayment || record.advanceRequirement || ''}\n                       onChange={(e) => setRecord({...record, advancePayment: e.target.value})}\n                      placeholder="e.g. ₹50,000"`,
  `value={record.advancePayment || record.advanceRequirement || ''}\n                       onChange={(e) => setRecord({...record, advancePayment: e.target.value})}\n                      placeholder="₹0"`
);
code = code.replace(
  `value={record.transportationCharges || record.loadingCharges || ''}\n                       onChange={(e) => setRecord({...record, transportationCharges: e.target.value})}\n                      placeholder="e.g. ₹2,000"`,
  `value={record.transportationCharges || record.loadingCharges || ''}\n                       onChange={(e) => setRecord({...record, transportationCharges: e.target.value})}\n                      placeholder="₹0"`
);
code = code.replace(
  `value={record.installationCharges || ''}\n                       onChange={(e) => setRecord({...record, installationCharges: e.target.value})}\n                      placeholder="e.g. ₹5,000"`,
  `value={record.installationCharges || ''}\n                       onChange={(e) => setRecord({...record, installationCharges: e.target.value})}\n                      placeholder="₹0"`
);

fs.writeFileSync(file, code);
console.log("Patched placeholders");
