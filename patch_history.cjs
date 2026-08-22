const fs = require('fs');

let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

// Add imports
if (!content.includes('Clock')) {
  content = content.replace(
    "CheckCircle2, AlertCircle, Lock, Unlock, Download",
    "CheckCircle2, AlertCircle, Lock, Unlock, Download, Clock, ChevronRight"
  );
}

// Add state
if (!content.includes('showHistory')) {
  content = content.replace(
    "const [viewImage, setViewImage] = useState<string | null>(null);",
    "const [viewImage, setViewImage] = useState<string | null>(null);\n  const [showHistory, setShowHistory] = useState(false);"
  );
}

// Add history section
const historySection = `
            {/* Rate Edit History */}
            {record.rateEditHistory && record.rateEditHistory.length > 0 && (
              <section className="space-y-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-slate-700 font-semibold text-lg hover:text-indigo-600 transition-colors w-full text-left"
                >
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Price Change History
                  <ChevronRight className={\`w-5 h-5 transition-transform \${showHistory ? 'rotate-90' : ''}\`} />
                </button>
                
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pl-7 border-l-2 border-slate-100 ml-2 py-2">
                        {[...record.rateEditHistory].reverse().map((entry, index) => (
                          <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                              <span>{new Date(entry.timestamp).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="font-medium text-slate-800 mb-1">Reason: {entry.reason}</div>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-xs">
                              {entry.changes.map((change, i) => (
                                <li key={i}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}
`;

if (!content.includes('Rate Edit History')) {
  content = content.replace(
    "{/* Payment Phases Section */}",
    historySection + "\n            {/* Payment Phases Section */}"
  );
}

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
