const fs = require('fs');

let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

const oldDownload = `          paymentsData.push({
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
        });`;

const newDownload = `          paymentsData.push({
            "Order ID": order.id,
            "Customer": customerName,
            "Total Amount": totalAmount,
            "Phase Title": phase.title || \`Phase \${index + 1}\`,
            "Phase Amount": phase.amount || '',
            "Status": phase.status || '',
            "Date": phase.date ? new Date(phase.date).toLocaleString('en-IN') : '',
            "Source Type": phase.sourceType || '',
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
          "Source Type": "-",
          "UTR Number": "-"
        });`;

content = content.replace(oldDownload, newDownload);

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
