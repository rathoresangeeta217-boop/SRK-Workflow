import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getProductFile } from './fileStorage';

export const generatePOPDF = async (
  poNumber: string,
  vendorName: string,
  vendor: any,
  items: any[] // array of { product: any, quantity: number }
) => {
  const doc = new jsPDF();
  const setBlackText = () => doc.setTextColor(0, 0, 0);
  const setGrayText = () => doc.setTextColor(100, 100, 100);

  // Fetch all images for this PO
  const images: Record<string, string> = {};
  for (const item of items) {
    if (item.product.details?.productImageData) {
      images[item.product.id!] = item.product.details.productImageData;
    } else if (item.product.docId || item.product.id) {
      try {
        const idToFetch = item.product.docId || item.product.id;
        const imgData = await getProductFile(idToFetch);
        if (imgData) images[item.product.id!] = imgData;
      } catch (e) {
        console.error("Could not fetch image", e);
      }
    }
  }

  // Header Background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 40, 'F');

  // Company Info
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 69, 19);
  doc.text('Srk Modular furniture co.', 105, 18, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setGrayText();
  doc.text('7 Km, Behind Halt Restaurant, Agra Road, Jaipur, Rajasthan - 302031, India', 105, 24, { align: 'center' });
  doc.text('Mobile: 6376165128 | Email: Sales@srkmodular.com | Website: https://srkmodular.com/', 105, 29, { align: 'center' });
  doc.text('GST: 08AAIPM7265R1ZR', 105, 34, { align: 'center' });

  // Border Line
  doc.setDrawColor(139, 69, 19);
  doc.setLineWidth(1);
  doc.line(14, 42, 196, 42);

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setBlackText();
  doc.text('PURCHASE ORDER', 105, 52, { align: 'center' });

  // Left side (To)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text('To,', 14, 65);
  doc.setFont("helvetica", "bold");
  doc.text(vendorName, 14, 71);
  
  doc.setFont("helvetica", "normal");
  if (vendor) {
    if (vendor.email) doc.text(`Email: ${vendor.email}`, 14, 77);
    if (vendor.phone) doc.text(`Mobile: ${vendor.phone}`, 14, 83);
    if (vendor.address) {
      const addressLines = doc.splitTextToSize(`Address: ${vendor.address}`, 80);
      doc.text(addressLines, 14, 89);
    }
  }

  // Right side (PO Info)
  doc.setFont("helvetica", "bold");
  doc.text(`PO No: ${poNumber}`, 196, 65, { align: 'right' });
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, 196, 71, { align: 'right' });

  // Buyer Info (Right Side)
  doc.setFont("helvetica", "bold");
  doc.text('Bill / Ship To:', 196, 83, { align: 'right' });
  doc.setFont("helvetica", "normal");
  doc.text('Srk Modular furniture co.', 196, 89, { align: 'right' });
  const buyerAddress = doc.splitTextToSize('7 Km, Behind Halt Restaurant, Agra Road, Jaipur, Rajasthan - 302031, India', 80);
  doc.text(buyerAddress, 196, 95, { align: 'right' });
  const buyerEmailY = 95 + (buyerAddress.length * 5);
  doc.text('Mobile: 6376165128', 196, buyerEmailY, { align: 'right' });
  doc.text('GST: 08AAIPM7265R1ZR', 196, buyerEmailY + 5, { align: 'right' });

  let greetingY = 105;
  if (vendor && vendor.address) {
     const addressLines = doc.splitTextToSize(`Address: ${vendor.address}`, 80);
     const vendorBottomY = 89 + (addressLines.length * 5) + 5;
     const buyerBottomY = buyerEmailY + 15;
     greetingY = Math.max(vendorBottomY, buyerBottomY);
  } else {
     const buyerBottomY = buyerEmailY + 15;
     greetingY = Math.max(105, buyerBottomY);
  }
  
  doc.text('Dear Sir/Ma\'am,', 14, greetingY);
  doc.text('Please find our purchase order details below:', 14, greetingY + 6);

  const tableBody: any[][] = [];
  let totalAmount = 0;

  items.forEach((item, index) => {
    const perUnitPriceStr = item.product.details?.perUnitPrice || item.product.price || '0';
    const numericPriceMatch = perUnitPriceStr.match(/[\d,.]+/);
    const numericPrice = numericPriceMatch ? parseFloat(numericPriceMatch[0].replace(/,/g, '')) : 0;
    const amount = numericPrice * item.quantity;
    totalAmount += amount;

    tableBody.push([
      (index + 1).toString(),
      '', // Empty string for image cell, ID fetched via index in didDrawCell
      `${item.product.name}\n${item.product.specification ? `Size/Spec: ${item.product.specification}` : ''}`,
      item.product.details?.measuringMetric || '-',
      numericPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      item.quantity.toString(),
      `${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ]);
  });

  autoTable(doc, {
    startY: greetingY + 12,
    head: [['Sl.', 'Image', 'Product Details', 'Metric', 'Unit Price', 'Qty', 'Amount (INR)']],
    body: tableBody,
    headStyles: {
      fillColor: [139, 69, 19],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: { fontSize: 9, cellPadding: 4 },
    bodyStyles: { minCellHeight: 22 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 50 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 15, halign: 'center' },
      6: { cellWidth: 32, halign: 'right' }
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const prodId = items[data.row.index]?.product?.id;
        data.cell.text = []; // Clear the ID text
        
        const imgData = images[prodId];
        if (imgData && imgData.startsWith('data:image')) {
          const imgSize = 18;
          const x = data.cell.x + (data.cell.width - imgSize) / 2;
          const y = data.cell.y + (data.cell.height - imgSize) / 2;
          
          try {
            let format = 'JPEG';
            if (imgData.includes('image/png')) format = 'PNG';
            else if (imgData.includes('image/webp')) format = 'WEBP';
            
            doc.addImage(imgData, format, x, y, imgSize, imgSize);
          } catch (e) {
            console.error('Error adding image to PDF', e);
          }
        }
      }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const gstAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + gstAmount;

  doc.setFillColor(245, 245, 245);
  doc.rect(130, finalY, 66, 35, 'F');
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setBlackText();
  doc.text('Subtotal:', 135, finalY + 10);
  doc.text(`${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 191, finalY + 10, { align: 'right' });
  
  doc.text('GST (18%):', 135, finalY + 20);
  doc.text(`${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 191, finalY + 20, { align: 'right' });
  
  doc.setFont("helvetica", "bold");
  doc.text('Grand Total:', 135, finalY + 30);
  doc.text(`${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 191, finalY + 30, { align: 'right' });

  let tY = finalY + 55;
  doc.setDrawColor(139, 69, 19);
  doc.setLineWidth(0.5);
  doc.line(14, tY, 196, tY);
  
  tY += 8;
  doc.setFontSize(9);
  setGrayText();
  doc.text('Thank you for your business!', 105, tY, { align: 'center' });
  doc.text('For any queries, please contact us at 6376165128', 105, tY + 5, { align: 'center' });
  
  doc.save(`PO-${poNumber}.pdf`);
};
