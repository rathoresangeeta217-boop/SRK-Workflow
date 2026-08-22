const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add state for original rates tracking
code = code.replace(
  /const \[isEditingAmount, setIsEditingAmount\] = useState\(false\);/,
  `const [isEditingAmount, setIsEditingAmount] = useState(false);\n  const [originalRatesForDiff, setOriginalRatesForDiff] = useState<any>(null);`
);

// 2. Modify handleSave
const newHandleSave = `  const handleSave = async () => {
    if (isEditingAmount && !record.editReason) {
      alert("Please provide a valid reason for editing the amount.");
      return;
    }

    let recordToSave = { ...record };

    if (isEditingAmount && record.editReason && originalRatesForDiff) {
      const changes: string[] = [];
      const currentAdvance = record.advancePayment || record.advanceRequirement;
      const currentTransport = record.transportationCharges || record.loadingCharges;
      
      const formatStr = (val: any) => (val || '₹0').toString();

      if (formatStr(originalRatesForDiff.grandTotal) !== formatStr(record.grandTotal)) {
        changes.push(\`Grand Total: \${formatStr(originalRatesForDiff.grandTotal)} -> \${formatStr(record.grandTotal)}\`);
      }
      if (formatStr(originalRatesForDiff.advancePayment) !== formatStr(currentAdvance)) {
        changes.push(\`Advance Payment: \${formatStr(originalRatesForDiff.advancePayment)} -> \${formatStr(currentAdvance)}\`);
      }
      if (formatStr(originalRatesForDiff.transportationCharges) !== formatStr(currentTransport)) {
        changes.push(\`Transportation: \${formatStr(originalRatesForDiff.transportationCharges)} -> \${formatStr(currentTransport)}\`);
      }
      if (formatStr(originalRatesForDiff.installationCharges) !== formatStr(record.installationCharges)) {
        changes.push(\`Installation: \${formatStr(originalRatesForDiff.installationCharges)} -> \${formatStr(record.installationCharges)}\`);
      }

      if (changes.length > 0) {
        const newHistoryEntry = {
          timestamp: new Date().toISOString(),
          reason: record.editReason,
          changes
        };
        recordToSave.rateEditHistory = [...(record.rateEditHistory || []), newHistoryEntry];
      }
      
      recordToSave.editReason = ''; // Clear reason after tracking
    }
        
    setIsLoading(true);
    try {
      await savePaymentRecord(recordToSave as PaymentRecord);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save payment record.");
    } finally {
      setIsLoading(false);
    }
  };`;

code = code.replace(/const handleSave = async \(\) => \{[\s\S]*?finally \{\s*setIsLoading\(false\);\s*\}\s*\};/, newHandleSave);

// 3. Update Edit Rates button onClick
const oldButton = `onClick={() => setIsEditingAmount(!isEditingAmount)}`;
const newButton = `onClick={() => {
                  if (!isEditingAmount) {
                    setOriginalRatesForDiff({
                      grandTotal: record.grandTotal,
                      advancePayment: record.advancePayment || record.advanceRequirement,
                      transportationCharges: record.transportationCharges || record.loadingCharges,
                      installationCharges: record.installationCharges
                    });
                  } else {
                    setRecord({...record, editReason: ''});
                  }
                  setIsEditingAmount(!isEditingAmount);
                }}`;
code = code.replace(oldButton, newButton);

// 4. Render History Section
const historySection = `
            {record.rateEditHistory && record.rateEditHistory.length > 0 && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Rate Modification History</h4>
                <div className="space-y-3">
                  {record.rateEditHistory.map((entry: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500">
                          {new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 font-medium mb-2">
                        Reason: <span className="font-normal italic text-slate-600">{entry.reason}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {entry.changes.map((change: string, cIdx: number) => (
                          <span key={cIdx} className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                            {change}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
`;

code = code.replace(/(<\/div>\s*<\/div>\s*<\/section>\s*<hr className="border-slate-200" \/>)/, `${historySection}\n            $1`);

fs.writeFileSync(file, code);
console.log("Patched modal history");
