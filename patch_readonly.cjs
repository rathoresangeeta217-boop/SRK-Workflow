const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Original Subtotal
code = code.replace(
  `value={record.originalAmount || ''} \n                     onChange={(e) => setRecord({...record, originalAmount: e.target.value})}\n                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"`,
  `value={record.originalAmount || ''} \n                     onChange={(e) => setRecord({...record, originalAmount: e.target.value})}\n                    disabled\n                    className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed outline-none"`
);

// 2. GST / Taxes
code = code.replace(
  `value={record.originalGst || ''} \n                     onChange={(e) => setRecord({...record, originalGst: e.target.value})}\n                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"`,
  `value={record.originalGst || ''} \n                     onChange={(e) => setRecord({...record, originalGst: e.target.value})}\n                    disabled\n                    className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed outline-none"`
);

// 3. Grand Total
code = code.replace(
  `value={record.grandTotal || ''} \n                     onChange={(e) => setRecord({...record, grandTotal: e.target.value})}\n                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"`,
  `value={record.grandTotal || ''} \n                     onChange={(e) => setRecord({...record, grandTotal: e.target.value})}\n                    disabled={!isEditingAmount}\n                    className={\`w-full px-3 py-2 border rounded-lg font-bold outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-indigo-900 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 4. Advance Payment
code = code.replace(
  `value={record.advancePayment || record.advanceRequirement || ''} \n                       onChange={(e) => setRecord({...record, advancePayment: e.target.value})}\n                      placeholder="₹0"\n                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"`,
  `value={record.advancePayment || record.advanceRequirement || ''} \n                       onChange={(e) => setRecord({...record, advancePayment: e.target.value})}\n                      placeholder="₹0"\n                      disabled={!isEditingAmount}\n                      className={\`w-full px-3 py-2 border rounded-lg outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-slate-800 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 5. Transportation Charges
code = code.replace(
  `value={record.transportationCharges || record.loadingCharges || ''} \n                       onChange={(e) => setRecord({...record, transportationCharges: e.target.value})}\n                      placeholder="₹0"\n                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"`,
  `value={record.transportationCharges || record.loadingCharges || ''} \n                       onChange={(e) => setRecord({...record, transportationCharges: e.target.value})}\n                      placeholder="₹0"\n                      disabled={!isEditingAmount}\n                      className={\`w-full px-3 py-2 border rounded-lg outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-slate-800 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 6. Installation Charges
code = code.replace(
  `value={record.installationCharges || ''} \n                       onChange={(e) => setRecord({...record, installationCharges: e.target.value})}\n                      placeholder="₹0"\n                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"`,
  `value={record.installationCharges || ''} \n                       onChange={(e) => setRecord({...record, installationCharges: e.target.value})}\n                      placeholder="₹0"\n                      disabled={!isEditingAmount}\n                      className={\`w-full px-3 py-2 border rounded-lg outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-slate-800 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 7. Remove 'New Amount' from the isEditingAmount block since we now edit Grand Total directly
const reasonBlock = `                    <div className="md:col-span-3 p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-amber-800">Editing Rates</h4>
                          <p className="text-xs text-amber-700 mt-0.5">You have unlocked the rate fields. A valid reason is required if you are making changes.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Valid Reason for Change *</label>
                          <input 
                            type="text" 
                            value={record.editReason || ''} 
                            onChange={(e) => setRecord({...record, editReason: e.target.value})}
                            placeholder="e.g. Customer negotiated discount, added installation"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                          />
                        </div>
                      </div>
                    </div>`;
                    
code = code.replace(
  /{isEditingAmount && \([\s\S]*?<\/div>\s*<\/>\s*\)}/,
  `{isEditingAmount && (\n  <>\n${reasonBlock}\n  </>\n)}`
);

fs.writeFileSync(file, code);
console.log("Patched readonly styles");
