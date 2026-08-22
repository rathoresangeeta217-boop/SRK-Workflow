const fs = require('fs');
let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

const downloadHandler = `
  const handleDownloadReport = () => {
    if (!order) return;
    try {
      let csvContent = "Order ID,Customer,Total Amount,Phase Title,Phase Amount,Status,Date,UTR Number\\n";
      const customerName = order.customer.replace(/,/g, '');
      const totalAmount = order.amount.replace(/,/g, '');
      
      if (record.phases && record.phases.length > 0) {
        record.phases.forEach((phase, index) => {
          const title = phase.title ? phase.title.replace(/,/g, '') : \`Phase \${index + 1}\`;
          const phaseAmount = phase.amount ? phase.amount.replace(/,/g, '') : '';
          const status = phase.status || '';
          const date = phase.date ? new Date(phase.date).toLocaleString('en-IN').replace(/,/g, '') : '';
          const utr = phase.utrNumber ? phase.utrNumber.replace(/,/g, '') : '';
          csvContent += \`\${order.id},\${customerName},\${totalAmount},\${title},\${phaseAmount},\${status},\${date},\${utr}\\n\`;
        });
      } else {
        csvContent += \`\${order.id},\${customerName},\${totalAmount},No phases defined,-,-,-,-\\n\`;
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', \`Payment_Report_\${order.id}_\${new Date().toISOString().split('T')[0]}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report");
    }
  };
`;

if (!content.includes('const handleDownloadReport')) {
  content = content.replace("  const handleScreenshotUpload = (", downloadHandler + "\n  const handleScreenshotUpload = (");
}

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
