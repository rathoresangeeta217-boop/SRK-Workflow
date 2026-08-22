const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Advance Payment
code = code.replace(
  /value=\{record\.advancePayment \|\| record\.advanceRequirement \|\| ''\}\s+onChange=\{\(e\) => setRecord\(\{\.\.\.record, advancePayment: e\.target\.value\}\)\}\s+placeholder="[^"]+"\s+className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `value={record.advancePayment || record.advanceRequirement || ''} \n                       onChange={(e) => setRecord({...record, advancePayment: e.target.value})}\n                      placeholder="₹0"\n                      disabled={!isEditingAmount}\n                      className={\`w-full px-3 py-2 border rounded-lg outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-slate-800 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 2. Transportation Charges
code = code.replace(
  /value=\{record\.transportationCharges \|\| record\.loadingCharges \|\| ''\}\s+onChange=\{\(e\) => setRecord\(\{\.\.\.record, transportationCharges: e\.target\.value\}\)\}\s+placeholder="[^"]+"\s+className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `value={record.transportationCharges || record.loadingCharges || ''} \n                       onChange={(e) => setRecord({...record, transportationCharges: e.target.value})}\n                      placeholder="₹0"\n                      disabled={!isEditingAmount}\n                      className={\`w-full px-3 py-2 border rounded-lg outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-slate-800 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 3. Installation Charges
code = code.replace(
  /value=\{record\.installationCharges \|\| ''\}\s+onChange=\{\(e\) => setRecord\(\{\.\.\.record, installationCharges: e\.target\.value\}\)\}\s+placeholder="[^"]+"\s+className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `value={record.installationCharges || ''} \n                       onChange={(e) => setRecord({...record, installationCharges: e.target.value})}\n                      placeholder="₹0"\n                      disabled={!isEditingAmount}\n                      className={\`w-full px-3 py-2 border rounded-lg outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-slate-800 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 4. Grand Total
code = code.replace(
  /value=\{record\.grandTotal \|\| ''\}\s+onChange=\{\(e\) => setRecord\(\{\.\.\.record, grandTotal: e\.target\.value\}\)\}\s+className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `value={record.grandTotal || ''} \n                     onChange={(e) => setRecord({...record, grandTotal: e.target.value})}\n                    disabled={!isEditingAmount}\n                    className={\`w-full px-3 py-2 border rounded-lg font-bold outline-none \${isEditingAmount ? 'bg-white border-indigo-300 text-indigo-900 focus:ring-2 focus:ring-indigo-500' : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'}\`}`
);

// 5. Original Amount
code = code.replace(
  /value=\{record\.originalAmount \|\| ''\}\s+onChange=\{\(e\) => setRecord\(\{\.\.\.record, originalAmount: e\.target\.value\}\)\}\s+className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `value={record.originalAmount || ''} \n                     onChange={(e) => setRecord({...record, originalAmount: e.target.value})}\n                    disabled\n                    className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed outline-none"`
);

// 6. Original GST
code = code.replace(
  /value=\{record\.originalGst \|\| ''\}\s+onChange=\{\(e\) => setRecord\(\{\.\.\.record, originalGst: e\.target\.value\}\)\}\s+className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `value={record.originalGst || ''} \n                     onChange={(e) => setRecord({...record, originalGst: e.target.value})}\n                    disabled\n                    className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed outline-none"`
);


fs.writeFileSync(file, code);
console.log("Patched final inputs");
