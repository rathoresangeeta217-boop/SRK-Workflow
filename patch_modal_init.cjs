const fs = require('fs');
let code = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

const searchCode = `        // Initialize new record from order
        setRecord({
          orderId: order.id,
          originalAmount: \`₹\${subtotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`,
          originalGst: \`₹\${gstAmountValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (\${gstRate}%)\`, 
          grandTotal: \`₹\${grandTotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`,
          phases: []
        });`;

const replaceCode = `        // Initialize new record from order
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

code = code.replace(searchCode, replaceCode);
fs.writeFileSync('src/components/PaymentManagementModal.tsx', code);
console.log("Patched modal init");
