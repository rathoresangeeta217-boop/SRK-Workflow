const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

const newEffect = `
  useEffect(() => {
    if (!isDelivered && !isProcessing && (formData.receivedBy || formData.quantityReceived || formData.deliveryDateTime)) {
      const dateStr = formData.deliveryDateTime ? new Date(formData.deliveryDateTime).toLocaleString() : '[Date]';
      const summary = \`Material received by \${formData.receivedBy || '[Name]'} on \${dateStr}. Quantity Received: \${formData.quantityReceived || '[Qty]'}. Quality: \${formData.qualityStatus}. Condition: \${formData.conditionStatus}.\`;
      
      setFormData(prev => {
        if (prev.qcReport !== summary) {
          return { ...prev, qcReport: summary };
        }
        return prev;
      });
    }
  }, [formData.receivedBy, formData.deliveryDateTime, formData.quantityReceived, formData.qualityStatus, formData.conditionStatus, isDelivered]);

  if (!isOpen || !purchase) return null;
`;

code = code.replace("  if (!isOpen || !purchase) return null;", newEffect);

fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
console.log('patched');
