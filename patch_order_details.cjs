const fs = require('fs');

let content = fs.readFileSync('src/components/OrderDetailsModal.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { getOrderFiles } from '../lib/fileStorage';",
  "import { getOrderFiles } from '../lib/fileStorage';\nimport { getPaymentForOrder, PaymentRecord } from '../lib/payments';\nimport { Clock, TrendingUp } from 'lucide-react';"
);

// Add state
content = content.replace(
  "const [isLoadingFiles, setIsLoadingFiles] = useState(false);",
  "const [isLoadingFiles, setIsLoadingFiles] = useState(false);\n  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null);"
);

// Fetch payment data
content = content.replace(
  /getOrderFiles\(order\.id\)\s*\.then\(data => setFiles\(data \|\| \{\}\)\)\s*\.catch\(console\.error\)\s*\.finally\(\(\) => setIsLoadingFiles\(false\)\);/,
  `Promise.all([
        getOrderFiles(order.id),
        getPaymentForOrder(order.id)
      ])
        .then(([fileData, paymentData]) => {
          setFiles(fileData || {});
          setPaymentRecord(paymentData);
        })
        .catch(console.error)
        .finally(() => setIsLoadingFiles(false));`
);

const financialHTML = `
              {/* Financial Overview */}
              {paymentRecord && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Financial Overview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Grand Total</p>
                      <p className="text-sm font-semibold text-slate-800">{paymentRecord.grandTotal || order.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Advance</p>
                      <p className="text-sm font-semibold text-slate-800">{paymentRecord.advancePayment || paymentRecord.advanceRequirement || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transport</p>
                      <p className="text-sm font-semibold text-slate-800">{paymentRecord.transportationCharges || paymentRecord.loadingCharges || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Installation</p>
                      <p className="text-sm font-semibold text-slate-800">{paymentRecord.installationCharges || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {paymentRecord.rateEditHistory && paymentRecord.rateEditHistory.length > 0 && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-sm font-bold text-slate-800">Rate Modification History</h4>
                      </div>
                      <div className="space-y-3">
                        {[...paymentRecord.rateEditHistory].reverse().map((entry, idx) => (
                          <div key={\`\${entry.timestamp}-\${idx}\`} className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-xs font-medium text-slate-500">
                                {new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-800 font-medium mb-2">
                              Reason: <span className="font-normal italic text-slate-600">{entry.reason}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {entry.changes.map((change, cIdx) => (
                                <span key={\`change-\${cIdx}\`} className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                                  {change}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
`;

content = content.replace(
  "{/* Attachments */}",
  financialHTML + "\n              {/* Attachments */}"
);

fs.writeFileSync('src/components/OrderDetailsModal.tsx', content);
