const fs = require('fs');

let content = fs.readFileSync('src/tabs/PaymentsTab.tsx', 'utf8');

content = content.replace("import { getAllPayments } from '../lib/payments';", "import { getAllPayments } from '../lib/payments';\nimport * as XLSX from 'xlsx';");

const newDownloadLogic = `  const handleDownloadDetailedReport = async () => {
    try {
      setIsDownloading(true);
      const allPayments = await getAllPayments();
      
      const paymentsData: any[] = [];
      const historyData: any[] = [];
      
      orders.forEach(order => {
        const paymentRecord = allPayments.find(p => p.orderId === order.id);
        const customerName = order.customer;
        const totalAmount = order.amount;
        
        if (paymentRecord && paymentRecord.phases && paymentRecord.phases.length > 0) {
          paymentRecord.phases.forEach((phase, index) => {
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
        
        if (paymentRecord && paymentRecord.rateEditHistory && paymentRecord.rateEditHistory.length > 0) {
          paymentRecord.rateEditHistory.forEach(entry => {
            historyData.push({
              "Order ID": order.id,
              "Customer": customerName,
              "Date Modified": new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              "Reason": entry.reason,
              "Changes": entry.changes.join(' | ')
            });
          });
        }
      });
      
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
      
      XLSX.writeFile(wb, \`Detailed_Payment_Report_\${new Date().toISOString().split('T')[0]}.xlsx\`);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };`;

content = content.replace(/const handleDownloadDetailedReport = async \(\) => \{[\s\S]*?\} finally \{\s*setIsDownloading\(false\);\s*\}\s*\};/m, newDownloadLogic);

fs.writeFileSync('src/tabs/PaymentsTab.tsx', content);
