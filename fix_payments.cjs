const fs = require('fs');
let content = fs.readFileSync('src/tabs/PaymentsTab.tsx', 'utf8');

// I'll just rewrite the first part of the file cleanly up to the return (
content = content.replace(/export function PaymentsTab\(\) \{.*?(?=<div className="space-y-6 pb-8">)/s, `export function PaymentsTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
    });
    return () => unsubscribe();
  }, []);

  const totalReceivables = orders.reduce((sum, order) => {
    const amountStr = order.amount?.toString().replace(/[^0-9.-]+/g, "") || "0";
    return sum + parseFloat(amountStr);
  }, 0);

  const handleDownloadDetailedReport = async () => {
    try {
      setIsDownloading(true);
      const allPayments = await getAllPayments();
      
      let csvContent = "Order ID,Customer,Total Amount,Phase Title,Phase Amount,Status,Date,UTR Number\\n";
      
      orders.forEach(order => {
        const paymentRecord = allPayments.find(p => p.orderId === order.id);
        const customerName = order.customer.replace(/,/g, '');
        const totalAmount = order.amount.replace(/,/g, '');
        
        if (paymentRecord && paymentRecord.phases && paymentRecord.phases.length > 0) {
          paymentRecord.phases.forEach((phase, index) => {
            const title = phase.title ? phase.title.replace(/,/g, '') : \`Phase \${index + 1}\`;
            const phaseAmount = phase.amount ? phase.amount.replace(/,/g, '') : '';
            const status = phase.status || '';
            const date = phase.date ? new Date(phase.date).toLocaleString('en-IN') : '';
            const utr = phase.utrNumber ? phase.utrNumber.replace(/,/g, '') : '';
            csvContent += \`\${order.id},\${customerName},\${totalAmount},\${title},\${phaseAmount},\${status},\${date.replace(/,/g, '')},\${utr}\\n\`;
          });
        } else {
          csvContent += \`\${order.id},\${customerName},\${totalAmount},No phases defined,-,-,-,-\\n\`;
        }
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', \`Detailed_Payment_Report_\${new Date().toISOString().split('T')[0]}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    `);

fs.writeFileSync('src/tabs/PaymentsTab.tsx', content);
