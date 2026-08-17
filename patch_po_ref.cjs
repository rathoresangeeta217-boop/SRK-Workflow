const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

code = code.replace(
  "doc.text(`GRN No: GRN-${purchase.id.substring(0,8).toUpperCase()}`, pageWidth - 120, 65);",
  "doc.text(`GRN No: GRN-${purchase.id.substring(0,6).toUpperCase()}`, pageWidth - 120, 65);"
);

code = code.replace(
  "['Purchase Order Ref', purchase.id.toUpperCase()],",
  "['Purchase Order Ref', `PO-${purchase.id.substring(0,6).toUpperCase()}`],"
);

code = code.replace(
  "doc.save(`GRN_SRK_${purchase.id.substring(0,8)}.pdf`);",
  "doc.save(`GRN_SRK_${purchase.id.substring(0,6).toUpperCase()}.pdf`);"
);

fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
console.log("Patched successfully.");
