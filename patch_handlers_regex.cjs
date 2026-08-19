const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

const newHandlers = `  const handleAction = async (status: 'Delivered' | 'Rejected') => {
    if (purchase?.status === status) {
      onClose();
      return;
    }
    setIsProcessing(true);
    try {
      await savePurchase({
        id: purchase.id,
        docId: purchase.docId,
        status: status,
        details: {
          ...purchase.details,
          deliveryQC: formData
        }
      });
      generateSatisfactionLetter(status);
      onClose();
    } catch (error) {
      console.error('Error processing delivery:', error);
      alert('Failed to save delivery details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAction('Delivered');
  };`;

// Replace everything from const handleSubmit = ... to its closing bracket before the return statement.
code = code.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?setIsProcessing\(false\);\n\s*\}\n\s*\};/, newHandlers);

fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
console.log("Patched handlers with regex");
