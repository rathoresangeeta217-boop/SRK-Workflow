const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const searchCode = `        // Initialize new record from order
        setRecord({
          orderId: order.id,
          originalAmount: \`₹\${subtotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`,
          originalGst: \`₹\${gstAmountValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (\${gstRate}%)\`, 
          grandTotal: \`₹\${grandTotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`,
          advancePayment: order.details?.advancePayment || "",
          transportationCharges: order.details?.transportationCharges || "",
          installationCharges: order.details?.installationCharges || "",
          phases: []
        });`;

const replaceCode = `        // Initialize new record from order
        setRecord({
          orderId: order.id,
          originalAmount: \`₹\${subtotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`,
          originalGst: \`₹\${gstAmountValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (\${gstRate}%)\`, 
          grandTotal: \`₹\${grandTotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`,
          advancePayment: order.details?.advancePayment || "₹50,000",
          transportationCharges: order.details?.transportationCharges || "₹2,000",
          installationCharges: order.details?.installationCharges || "₹5,000",
          phases: []
        });`;

code = code.replace(searchCode, replaceCode);
fs.writeFileSync(file, code);
console.log("Patched modal defaults");
