const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

const startStr = "const generateSatisfactionLetter = () => {";
const endStr = "doc.save(`GRN_SRK_${purchase.id.substring(0,8)}.pdf`);\n  };";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr) + endStr.length;

if (startIndex !== -1 && code.indexOf(endStr) !== -1) {
  const replacement = `
  const generateSatisfactionLetter = () => {
    if (!purchase) return;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // 1. Page Border (thinner, more elegant)
    doc.setDrawColor(51, 65, 85); // Slate 700
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // 2. Header Section
    // Logo / Company Name
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138); // Blue 900
    doc.setFont('helvetica', 'bold');
    doc.text('SRK MODULAR', 15, 25);
    
    // Company Subtitle/Address
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Modular Solutions & Manufacturing', 15, 30);
    doc.text('123 Industrial Estate, Phase II, Tech Park', 15, 34);
    doc.text('contact@srkmodular.com | +91-9876543210', 15, 38);
    
    // Document Title & Meta Box (Right Side)
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.rect(pageWidth - 85, 15, 75, 25, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.setFont('helvetica', 'bold');
    doc.text('GOODS RECEIPT NOTE', pageWidth - 47, 21, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('GRN No:', pageWidth - 80, 28);
    doc.text('Date:', pageWidth - 80, 33);
    
    doc.setFont('helvetica', 'bold');
    doc.text(\`GRN-\${purchase.id.substring(0,8).toUpperCase()}\`, pageWidth - 50, 28);
    doc.text(\`\${new Date().toLocaleDateString()}\`, pageWidth - 50, 33);
    
    // Divider Line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(15, 45, pageWidth - 15, 45);
    
    // Watermark
    doc.setFontSize(70);
    doc.setTextColor(241, 245, 249); // Slate 100
    doc.setFont('helvetica', 'bold');
    doc.text(formData.conditionStatus === 'Damaged' ? 'DAMAGED' : 'APPROVED', pageWidth/2, pageHeight/2 + 20, { 
      align: 'center', 
      angle: 45 
    });
    
    doc.setTextColor(15, 23, 42); // Reset text color
    
    // 3. Delivery Information Section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1. CONSIGNMENT DETAILS', 15, 55);
    
    autoTable(doc, {
      startY: 60,
      body: [
        ['Purchase Order Ref', purchase.id.toUpperCase()],
        ['Vendor Details', purchase.vendorName],
        ['Item Description', purchase.productName],
        ['Receiving Officer', formData.receivedBy || 'N/A'],
        ['Timestamp of Receipt', formData.deliveryDateTime ? new Date(formData.deliveryDateTime).toLocaleString() : 'N/A'],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4, lineColor: [203, 213, 225] },
      columnStyles: { 
        0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 55, textColor: [71, 85, 105] },
        1: { textColor: [15, 23, 42] }
      },
      margin: { left: 15, right: 15 }
    });
    
    let currentY = (doc as any).lastAutoTable.finalY + 12;
    
    // 4. Inspection & QC Summary
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('2. QUALITY ASSURANCE INSPECTION', 15, currentY);
    
    autoTable(doc, {
      startY: currentY + 5,
      body: [
        ['Ordered Quantity', purchase.details?.quantity || 'N/A'],
        ['Delivered Quantity', formData.quantityReceived || 'N/A'],
        ['Quality Grade', formData.qualityStatus.toUpperCase()],
        ['Physical Condition', formData.conditionStatus.toUpperCase()],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4, lineColor: [203, 213, 225] },
      columnStyles: { 
        0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 55, textColor: [71, 85, 105] },
        1: { textColor: [15, 23, 42], fontStyle: 'bold' }
      },
      margin: { left: 15, right: 15 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 12;
    
    // 5. Remarks & Notes
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('3. INSPECTION REMARKS', 15, currentY);
    
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const splitQC = doc.splitTextToSize(formData.qcReport || 'Material verified according to standard operating procedures. No deviations reported.', pageWidth - 40);
    
    const remarksText = formData.remarks ? \`Additional Notes: \${formData.remarks}\` : '';
    const splitRemarks = doc.splitTextToSize(remarksText, pageWidth - 40);
    
    const boxHeight = (splitQC.length * 5) + (remarksText ? splitRemarks.length * 5 + 5 : 0) + 12;
    
    doc.rect(15, currentY + 5, pageWidth - 30, boxHeight, 'FD');
    doc.setTextColor(71, 85, 105);
    doc.text(splitQC, 20, currentY + 13);
    if (remarksText) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(15, 23, 42);
      doc.text(splitRemarks, 20, currentY + 13 + (splitQC.length * 5) + 3);
    }
    
    currentY = currentY + boxHeight + 20;
    
    // 6. Photographic Evidence
    if (formData.conditionStatus === 'Damaged' && formData.damageImageBase64) {
      if (currentY + 120 > pageHeight - 40) {
        doc.addPage();
        doc.setDrawColor(51, 65, 85);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        currentY = 25;
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38); // Red 600
      doc.text('4. NON-CONFORMANCE EVIDENCE (ATTACHED)', 15, currentY);
      
      try {
        const type = formData.damageImageBase64.includes('jpeg') || formData.damageImageBase64.includes('jpg') ? 'JPEG' : 'PNG';
        
        doc.setDrawColor(220, 38, 38);
        doc.setLineWidth(0.5);
        doc.rect(15, currentY + 5, 120, 90);
        
        doc.addImage(formData.damageImageBase64, type, 15, currentY + 5, 120, 90, undefined, 'FAST');
        currentY += 105;
      } catch (e) {
        console.error('Failed to add image to PDF', e);
        doc.setFont('helvetica', 'italic');
        doc.text('(Image evidence corrupted or unavailable)', 15, currentY + 15);
        currentY += 25;
      }
    }
    
    // 7. Official Declaration
    if (currentY + 60 > pageHeight - 20) {
      doc.addPage();
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.5);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      currentY = 25;
    }
    
    doc.setFillColor(241, 245, 249);
    doc.rect(15, currentY, pageWidth - 30, 20, 'F');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'italic');
    const declaration = "DECLARATION: This document certifies that the aforementioned goods have been inspected by authorized personnel. The condition and quantities stated reflect the actual state of goods at the time of delivery. Any discrepancies must be reported to the procurement department within 24 hours of this document's issuance.";
    doc.text(doc.splitTextToSize(declaration, pageWidth - 40), 20, currentY + 6);
    
    currentY += 40;
    
    // 8. Signatures
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Left Sig
    doc.text('Authorized QA Inspector', 20, currentY);
    doc.setDrawColor(148, 163, 184);
    doc.line(20, currentY + 15, 80, currentY + 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(\`\${formData.receivedBy || 'Quality Assurance Dept.'}\`, 20, currentY + 20);
    doc.text('SRK Modular Operations', 20, currentY + 25);
    
    // Right Sig
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text('Vendor Acknowledgment', pageWidth - 80, currentY);
    doc.line(pageWidth - 80, currentY + 15, pageWidth - 20, currentY + 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Signature / Company Seal', pageWidth - 80, currentY + 20);
    doc.text('Date: ___/___/20__', pageWidth - 80, currentY + 25);
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(\`Page \${i} of \${pageCount}\`, pageWidth - 20, pageHeight - 15, { align: 'right' });
      doc.text('CONFIDENTIAL - For Internal Use Only', 15, pageHeight - 15);
    }
    
    doc.save(\`GRN_SRK_\${purchase.id.substring(0,8)}.pdf\`);
  };`;

  code = code.substring(0, startIndex) + replacement.trim() + "\n" + code.substring(endIndex);
  fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
  console.log("Patched successfully.");
} else {
  console.log("Could not find start or end index.", startIndex, code.indexOf(endStr));
}
