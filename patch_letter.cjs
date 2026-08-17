const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

// Add jsPDF imports
if (!code.includes('import jsPDF')) {
  code = code.replace(
    "import { Purchase, savePurchase } from '../lib/purchases';",
    "import { Purchase, savePurchase } from '../lib/purchases';\nimport jsPDF from 'jspdf';\nimport autoTable from 'jspdf-autotable';"
  );
}
// Add download icon import
if (!code.includes('Download')) {
  code = code.replace(
    "import { X, CheckCircle, Save, FileText, Package, User, Calendar, ClipboardCheck, Upload } from 'lucide-react';",
    "import { X, CheckCircle, Save, FileText, Package, User, Calendar, ClipboardCheck, Upload, Download } from 'lucide-react';"
  );
}

const letterGenerator = `
  const generateSatisfactionLetter = () => {
    if (!purchase) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text('SRK MODULAR', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text('Material Receipt & Satisfaction Letter', 14, 28);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 32, 196, 32);
    
    // Details
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery Information', 14, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const details = [
      ['Purchase Order:', purchase.id],
      ['Product:', purchase.productName],
      ['Vendor:', purchase.vendorName],
      ['Received By:', formData.receivedBy || 'N/A'],
      ['Date & Time:', formData.deliveryDateTime ? new Date(formData.deliveryDateTime).toLocaleString() : 'N/A'],
    ];
    
    autoTable(doc, {
      startY: 50,
      body: details,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });
    
    const finalYInfo = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Inspection Summary', 14, finalYInfo);
    
    const inspection = [
      ['Expected Quantity:', purchase.details?.quantity || 'N/A'],
      ['Received Quantity:', formData.quantityReceived || 'N/A'],
      ['Quality Assessment:', formData.qualityStatus],
      ['Physical Condition:', formData.conditionStatus],
    ];
    
    autoTable(doc, {
      startY: finalYInfo + 5,
      body: inspection,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });
    
    const finalYInsp = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('QC Report & Remarks', 14, finalYInsp);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitQC = doc.splitTextToSize(formData.qcReport || 'No summary provided.', 180);
    doc.text(splitQC, 14, finalYInsp + 7);
    
    const splitRemarks = doc.splitTextToSize(formData.remarks ? \`Remarks: \${formData.remarks}\` : '', 180);
    if (formData.remarks) {
      doc.text(splitRemarks, 14, finalYInsp + 7 + (splitQC.length * 5) + 2);
    }
    
    let currentY = finalYInsp + 7 + (splitQC.length * 5) + (formData.remarks ? splitRemarks.length * 5 : 0) + 15;
    
    // Image logic
    if (formData.conditionStatus === 'Damaged' && formData.damageImageBase64) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72); // Rose 600
      doc.text('DAMAGE PROOF ATTACHED:', 14, currentY);
      
      try {
        // Try to add image
        // We assume it's jpeg or png based on data URI
        const type = formData.damageImageBase64.includes('jpeg') || formData.damageImageBase64.includes('jpg') ? 'JPEG' : 'PNG';
        doc.addImage(formData.damageImageBase64, type, 14, currentY + 5, 100, 75, undefined, 'FAST');
        currentY += 85;
      } catch (e) {
        console.error('Failed to add image to PDF', e);
        doc.text('(Image could not be rendered)', 14, currentY + 10);
        currentY += 15;
      }
    }
    
    // Signatures
    currentY += 20;
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signatory', 14, currentY);
    doc.text('_______________________', 14, currentY + 15);
    doc.text(\`\${formData.receivedBy || 'Receiver'} (SRK Modular)\`, 14, currentY + 22);
    
    doc.save(\`Satisfaction_Letter_\${purchase.id.substring(0,8)}.pdf\`);
  };
`;

code = code.replace(
  "const handleSubmit = async (e: React.FormEvent) => {",
  letterGenerator + "\n  const handleSubmit = async (e: React.FormEvent) => {"
);

// We want to auto-generate upon successful save, and also offer a download button for existing ones
code = code.replace(
  "      await savePurchase({",
  "      await savePurchase({"
); // No-op, just a check

code = code.replace(
  "      onClose();\n    } catch (error) {",
  "      generateSatisfactionLetter();\n      onClose();\n    } catch (error) {"
);

// Add download button if isDelivered
code = code.replace(
  "            {isDelivered ? (",
  `            {isDelivered ? (
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={generateSatisfactionLetter}
                  className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Letter
                </button>
`
);

code = code.replace(
  /              <button \n                type="button"\n                onClick=\{onClose\}\n                className="px-6 py-2.5 bg-slate-900 text-white font-semibold hover:bg-slate-800 rounded-xl transition-colors"\n              >\n                Close\n              <\/button>/,
  `              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white font-semibold hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close
              </button>
              </div>`
);


fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
console.log('patched');
