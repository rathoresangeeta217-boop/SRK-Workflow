const fs = require('fs');

let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

const replacement = `
  const generateSatisfactionLetter = () => {
    if (!purchase) return;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // 1. Page Border
    doc.setDrawColor(79, 70, 229); // Indigo 600
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    
    // 2. Header Box
    doc.setFillColor(30, 41, 59); // Slate 800
    doc.rect(5, 5, pageWidth - 10, 25, 'F');
    
    // Header Text
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SRK MODULAR', 15, 17);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('GOODS RECEIPT & QC SATISFACTION NOTE', 15, 24);
    
    // Right side header info
    doc.setFontSize(10);
    doc.text(\`Date: \${new Date().toLocaleDateString()}\`, pageWidth - 15, 17, { align: 'right' });
    doc.text(\`Ref: GRN-\${purchase.id.substring(0,6).toUpperCase()}\`, pageWidth - 15, 24, { align: 'right' });
    
    // Watermark
    doc.setFontSize(60);
    doc.setTextColor(241, 245, 249); // Slate 100
    doc.setFont('helvetica', 'bold');
    doc.text(formData.conditionStatus === 'Damaged' ? 'DAMAGED' : 'RECEIVED', pageWidth/2, pageHeight/2, { 
      align: 'center', 
      angle: 45 
    });
    
    doc.setTextColor(15, 23, 42); // Reset text color
    
    // 3. Delivery Information Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. DELIVERY INFORMATION', 14, 45);
    
    autoTable(doc, {
      startY: 50,
      body: [
        ['Purchase Order #', purchase.id],
        ['Vendor Name', purchase.vendorName],
        ['Product Description', purchase.productName],
        ['Received By', formData.receivedBy || 'N/A'],
        ['Delivery Date & Time', formData.deliveryDateTime ? new Date(formData.deliveryDateTime).toLocaleString() : 'N/A'],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, lineColor: [226, 232, 240] },
      columnStyles: { 
        0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 60, textColor: [30, 41, 59] },
        1: { textColor: [15, 23, 42] }
      },
      margin: { left: 14, right: 14 }
    });
    
    const finalYInfo = (doc as any).lastAutoTable.finalY + 15;
    
    // 4. Inspection & QC Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('2. INSPECTION & QUALITY CONTROL', 14, finalYInfo);
    
    autoTable(doc, {
      startY: finalYInfo + 5,
      body: [
        ['Expected Quantity', purchase.details?.quantity || 'N/A'],
        ['Received Quantity', formData.quantityReceived || 'N/A'],
        ['Quality Assessment', formData.qualityStatus],
        ['Physical Condition', formData.conditionStatus],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, lineColor: [226, 232, 240] },
      columnStyles: { 
        0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 60, textColor: [30, 41, 59] },
        1: { textColor: [15, 23, 42] }
      },
      margin: { left: 14, right: 14 }
    });
    
    const finalYInsp = (doc as any).lastAutoTable.finalY + 15;
    
    // 5. Remarks & Notes
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. QC REPORT & REMARKS', 14, finalYInsp);
    
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(250, 250, 250);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitQC = doc.splitTextToSize(formData.qcReport || 'No summary provided.', pageWidth - 32);
    
    const remarksText = formData.remarks ? \`Additional Remarks: \${formData.remarks}\` : '';
    const splitRemarks = doc.splitTextToSize(remarksText, pageWidth - 32);
    
    const boxHeight = (splitQC.length * 5) + (remarksText ? splitRemarks.length * 5 + 5 : 0) + 10;
    
    doc.rect(14, finalYInsp + 5, pageWidth - 28, boxHeight, 'FD');
    doc.text(splitQC, 18, finalYInsp + 12);
    if (remarksText) {
      doc.setFont('helvetica', 'italic');
      doc.text(splitRemarks, 18, finalYInsp + 12 + (splitQC.length * 5) + 3);
    }
    
    let currentY = finalYInsp + boxHeight + 20;
    
    // 6. Photographic Evidence
    if (formData.conditionStatus === 'Damaged' && formData.damageImageBase64) {
      if (currentY + 100 > pageHeight) {
        doc.addPage();
        // Add border to new page
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(1);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
        currentY = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72); // Rose 600
      doc.text('4. PHOTOGRAPHIC EVIDENCE OF DAMAGE', 14, currentY);
      
      try {
        const type = formData.damageImageBase64.includes('jpeg') || formData.damageImageBase64.includes('jpg') ? 'JPEG' : 'PNG';
        
        // Draw frame for image
        doc.setDrawColor(225, 29, 72);
        doc.setLineWidth(0.5);
        doc.rect(14, currentY + 5, 120, 90);
        
        doc.addImage(formData.damageImageBase64, type, 14, currentY + 5, 120, 90, undefined, 'FAST');
        currentY += 110;
      } catch (e) {
        console.error('Failed to add image to PDF', e);
        doc.setFont('helvetica', 'italic');
        doc.text('(Image corrupted or could not be rendered)', 14, currentY + 15);
        currentY += 25;
      }
    }
    
    // 7. Signatures
    if (currentY + 40 > pageHeight - 20) {
      doc.addPage();
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(1);
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
      currentY = 20;
    }
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Left Sig
    doc.text('Authorized By (SRK Modular)', 14, currentY);
    doc.setDrawColor(15, 23, 42);
    doc.line(14, currentY + 15, 70, currentY + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(\`\${formData.receivedBy || 'Quality Inspector'}\`, 14, currentY + 20);
    doc.text('QC Department', 14, currentY + 25);
    
    // Right Sig
    doc.setFont('helvetica', 'bold');
    doc.text('Vendor Representative', pageWidth - 70, currentY);
    doc.line(pageWidth - 70, currentY + 15, pageWidth - 14, currentY + 15);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature / Stamp', pageWidth - 70, currentY + 20);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('SRK Modular - Internal Quality Assurance Document', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    doc.save(\`GRN_SRK_\${purchase.id.substring(0,8)}.pdf\`);
  };
`;

const pattern = /  const generateSatisfactionLetter = \(\) => \{[\s\S]*?doc\.save\(\`Satisfaction_Letter_\$\{purchase\.id\.substring\(0,8\)\}\.pdf\`\);\n  \};/;

if(pattern.test(code)) {
  code = code.replace(pattern, replacement.trim());
  fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
  console.log("Patched successfully.");
} else {
  console.log("Could not find pattern to replace.");
}

