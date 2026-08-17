const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

const replacement = `
    // 2. Header Section
    doc.setFontSize(26);
    doc.setTextColor(147, 75, 23); // Brown
    doc.setFont('helvetica', 'bold');
    doc.text('Srk Modular furniture co.', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('7 Km, Behind Halt Restaurant, Agra Road, Jaipur, Rajasthan - 302031, India', pageWidth / 2, 32, { align: 'center' });
    doc.text('Mobile: 6376165128 | Email: Sales@srkmodular.com | Website: https://srkmodular.com/', pageWidth / 2, 38, { align: 'center' });
    doc.text('GST: 08AAIPM7265R1ZR', pageWidth / 2, 44, { align: 'center' });
    
    doc.setDrawColor(147, 75, 23);
    doc.setLineWidth(0.8);
    doc.line(15, 50, pageWidth - 15, 50);
    
    // Document Title & Meta Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.rect(15, 55, pageWidth - 30, 16, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('GOODS RECEIPT NOTE', 22, 65);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(\`GRN No: GRN-\${purchase.id.substring(0,8).toUpperCase()}\`, pageWidth - 120, 65);
    doc.text(\`Date: \${new Date().toLocaleDateString()}\`, pageWidth - 50, 65);
    
    // Watermark
    doc.setFontSize(70);
    doc.setTextColor(241, 245, 249);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.conditionStatus === 'Damaged' ? 'DAMAGED' : 'APPROVED', pageWidth/2, pageHeight/2 + 20, { 
      align: 'center', 
      angle: 45 
    });
    
    doc.setTextColor(15, 23, 42);
    
    // 3. Delivery Information Section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1. CONSIGNMENT DETAILS', 15, 85);
    
    autoTable(doc, {
      startY: 90,
`;

const startStr = "// 2. Header Section";
const endStr = "autoTable(doc, {\n      startY: 60,";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr) + endStr.length;

if (startIndex !== -1 && code.indexOf(endStr) !== -1) {
  code = code.substring(0, startIndex) + replacement.trim() + code.substring(endIndex);
  fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
  console.log("Patched successfully.");
} else {
  console.log("Could not find start or end index.");
}
