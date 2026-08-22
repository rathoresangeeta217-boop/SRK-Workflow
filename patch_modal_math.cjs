const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const searchCode = `                        const advance = parseVal(record.advancePayment || record.advanceRequirement);
                        const transport = parseVal(record.transportationCharges || record.loadingCharges);
                        const install = parseVal(record.installationCharges);`;

const replaceCode = `                        const advance = parseVal(record.advancePayment || record.advanceRequirement || '₹50,000');
                        const transport = parseVal(record.transportationCharges || record.loadingCharges || '₹2,000');
                        const install = parseVal(record.installationCharges || '₹5,000');`;

code = code.replace(searchCode, replaceCode);
fs.writeFileSync(file, code);
console.log("Patched modal math");
