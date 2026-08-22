const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update remaining balance calculation
const oldCalc = `const remaining = (grandTotal + transport + install) - advance;`;
const newCalc = `let receivedPhasesTotal = 0;
                        (record.phases || []).forEach(p => {
                          if (p.status === 'Received') {
                            const match = p.amount.toString().match(/[\\d,]+(\\.\\d+)?/);
                            if (match) receivedPhasesTotal += parseFloat(match[0].replace(/,/g, ""));
                          }
                        });
                        const remaining = (grandTotal + transport + install) - advance - receivedPhasesTotal;`;

code = code.replace(oldCalc, newCalc);

// 2. Make phase fields disabled if status is Received (except Status dropdown)
code = code.replace(
  /onChange=\{\(e\) => updatePhase\(phase\.id, \{ title: e\.target\.value \}\)\}\n\s*placeholder="e\.g\. 50% Advance or After 25 days"/g,
  `onChange={(e) => updatePhase(phase.id, { title: e.target.value })}\n                            disabled={phase.status === 'Received'}\n                            placeholder="e.g. 50% Advance or After 25 days"`
);

code = code.replace(
  /className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"\s*\/>\s*<\/div>\s*<div>\s*<label className="block text-xs font-semibold text-slate-700 mb-1">Amount \/ Percentage<\/label>/,
  `className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`} \n                          />\n                        </div>\n                        <div>\n                          <label className="block text-xs font-semibold text-slate-700 mb-1">Amount / Percentage</label>`
);

code = code.replace(
  /onChange=\{\(e\) => updatePhase\(phase\.id, \{ amount: e\.target\.value \}\)\}\n\s*placeholder="e\.g\. ₹25,000 or 20%"/g,
  `onChange={(e) => updatePhase(phase.id, { amount: e.target.value })}\n                            disabled={phase.status === 'Received'}\n                            placeholder="e.g. ₹25,000 or 20%"`
);

code = code.replace(
  /className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"\s*\/>\s*<\/div>\s*<div>\s*<label className="block text-xs font-semibold text-slate-700 mb-1">Status<\/label>/,
  `className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`} \n                          />\n                        </div>\n                        <div>\n                          <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>`
);


fs.writeFileSync(file, code);
console.log('Patched calc and phase disables');
