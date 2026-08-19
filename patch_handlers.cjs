const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

const oldHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDelivered) {
      onClose();
      return;
    }
    setIsProcessing(true);
    try {
      await savePurchase({
        id: purchase.id,
        docId: purchase.docId,
        status: 'Delivered',
        details: {
          ...purchase.details,
          deliveryQC: formData
        }
      });
      generateSatisfactionLetter();
      onClose();
    } catch (error) {
      console.error('Error receiving delivery:', error);
      alert('Failed to save delivery details.');
    } finally {
      setIsProcessing(false);
    }
  };`;

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

if (code.includes('const handleSubmit = async (e: React.FormEvent) => {')) {
  code = code.replace(oldHandleSubmit, newHandlers);
}

const oldCompletedFooter = `              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => generateSatisfactionLetter(purchase?.status as any)}
                  className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Letter
                </button>
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white font-semibold hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close
              </button>
              </div>`;

const newCompletedFooter = `              <div className="flex gap-3">
                {purchase?.status === 'Delivered' && (
                  <button
                    type="button"
                    onClick={() => handleAction('Rejected')}
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Process Return
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => generateSatisfactionLetter(purchase?.status as any)}
                  className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Letter
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 text-white font-semibold hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>`;

code = code.replace(oldCompletedFooter, newCompletedFooter);

fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
console.log("Patched handlers and footer");
