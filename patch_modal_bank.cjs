const fs = require('fs');
let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

// 1. Update export
const oldExport = `            "Source Type": phase.sourceType || '',
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

const newExport = `            "Source Type": phase.sourceType || '',
            "Bank Name": phase.bankName || '',
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
          "Bank Name": "-",
          "UTR Number": "-"
        });`;
        
content = content.replace(oldExport, newExport);

// 2. Update UI Grid
const oldUI = `                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source Type</label>
                                  <select 
                                    value={phase.sourceType || ''}
                                    onChange={(e) => updatePhase(phase.id, { sourceType: e.target.value as any })}
                                    disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}
                                    className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`}
                                  >
                                    <option value="">Select Source</option>
                                    <option value="Bank">Bank</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">UTR Number / Ref ID</label>`;

const newUI = `                              <div className={\`grid grid-cols-1 md:grid-cols-\${phase.sourceType === 'Bank' ? '4' : '3'} gap-4\`}>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source Type</label>
                                  <select 
                                    value={phase.sourceType || ''}
                                    onChange={(e) => updatePhase(phase.id, { sourceType: e.target.value as any })}
                                    disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}
                                    className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`}
                                  >
                                    <option value="">Select Source</option>
                                    <option value="Bank">Bank</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                  </select>
                                </div>
                                {phase.sourceType === 'Bank' && (
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                                    <select 
                                      value={phase.bankName || ''}
                                      onChange={(e) => updatePhase(phase.id, { bankName: e.target.value as any })}
                                      disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}
                                      className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`}
                                    >
                                      <option value="">Select Bank</option>
                                      <option value="SBI">SBI</option>
                                      <option value="Union">Union</option>
                                      <option value="PR">PR</option>
                                    </select>
                                  </div>
                                )}
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">UTR Number / Ref ID</label>`;

content = content.replace(oldUI, newUI);

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
