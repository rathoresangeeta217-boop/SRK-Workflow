const fs = require('fs');

let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

if (!content.includes("import * as XLSX from 'xlsx';")) {
  content = content.replace("import { Order } from '../lib/orders';", "import { Order } from '../lib/orders';\nimport * as XLSX from 'xlsx';");
}

const newDownloadLogic = `  const handleDownloadReport = () => {
    if (!order) return;
    try {
      const paymentsData = [];
      const historyData = [];
      
      const customerName = order.customer;
      const totalAmount = order.amount;
      
      if (record.phases && record.phases.length > 0) {
        record.phases.forEach((phase, index) => {
          paymentsData.push({
            "Order ID": order.id,
            "Customer": customerName,
            "Total Amount": totalAmount,
            "Phase Title": phase.title || \`Phase \${index + 1}\`,
            "Phase Amount": phase.amount || '',
            "Status": phase.status || '',
            "Date": phase.date ? new Date(phase.date).toLocaleString('en-IN') : '',
            "UTR Number": phase.utrNumber || ''
          });
        });
      } else {
        paymentsData.push({
          "Order ID": order.id,
          "Customer": customerName,
          "Total Amount": totalAmount,
          "Phase Title": "No phases defined",
          "Phase Amount": "-",
          "Status": "-",
          "Date": "-",
          "UTR Number": "-"
        });
      }
      
      if (record.rateEditHistory && record.rateEditHistory.length > 0) {
        record.rateEditHistory.forEach(entry => {
          historyData.push({
            "Order ID": order.id,
            "Customer": customerName,
            "Date Modified": new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            "Reason": entry.reason,
            "Changes": entry.changes.join(' | ')
          });
        });
      }
      
      const wb = XLSX.utils.book_new();
      
      const wsPayments = XLSX.utils.json_to_sheet(paymentsData);
      XLSX.utils.book_append_sheet(wb, wsPayments, "Payment Phases");
      
      if (historyData.length > 0) {
        const wsHistory = XLSX.utils.json_to_sheet(historyData);
        XLSX.utils.book_append_sheet(wb, wsHistory, "Rate Modification History");
      } else {
        const wsHistory = XLSX.utils.json_to_sheet([{"Note": "No rate modifications found."}]);
        XLSX.utils.book_append_sheet(wb, wsHistory, "Rate Modification History");
      }
      
      XLSX.writeFile(wb, \`Payment_Report_\${order.id}_\${new Date().toISOString().split('T')[0]}.xlsx\`);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report");
    }
  };`;

const regex = /const handleDownloadReport = \(\) => \{[\s\S]*?alert\("Failed to download report"\);\s*\}\s*\};/;
content = content.replace(regex, newDownloadLogic);

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
