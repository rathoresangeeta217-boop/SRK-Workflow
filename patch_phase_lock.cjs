const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Imports
code = code.replace(
  /import \{ X, Plus, Save, Upload, CheckCircle2, AlertCircle \} from 'lucide-react';/,
  "import { X, Plus, Save, Upload, CheckCircle2, AlertCircle, Lock, Unlock } from 'lucide-react';"
);

// 2. State
code = code.replace(
  /const \[isEditingAmount, setIsEditingAmount\] = useState\(false\);\n  const \[originalRatesForDiff, setOriginalRatesForDiff\] = useState<any>\(null\);/,
  `const [isEditingAmount, setIsEditingAmount] = useState(false);\n  const [originalRatesForDiff, setOriginalRatesForDiff] = useState<any>(null);\n  const [unlockedPhases, setUnlockedPhases] = useState<Record<string, boolean>>({});\n  const [phaseToUnlock, setPhaseToUnlock] = useState<string | null>(null);\n  const [unlockPassword, setUnlockPassword] = useState('');`
);

// 3. Clear State on Close
code = code.replace(
  /setIsEditingAmount\(false\);\n    \}/,
  `setIsEditingAmount(false);\n      setUnlockedPhases({});\n      setPhaseToUnlock(null);\n      setUnlockPassword('');\n    }`
);

// 4. Phase Header
const oldHeader = `<h4 className="font-semibold text-slate-700">Phase {index + 1}</h4>`;
const newHeader = `<div className="flex items-center gap-3">
                          <h4 className="font-semibold text-slate-700">Phase {index + 1}</h4>
                          {phase.status === 'Received' && !unlockedPhases[phase.id] && (
                            <button onClick={() => setPhaseToUnlock(phase.id === phaseToUnlock ? null : phase.id)} className="text-xs flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100">
                              <Lock className="w-3 h-3" /> Locked
                            </button>
                          )}
                          {unlockedPhases[phase.id] && (
                            <span className="text-xs flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                              <Unlock className="w-3 h-3" /> Unlocked
                            </span>
                          )}
                        </div>`;
code = code.replace(oldHeader, newHeader);

// 5. Password Modal (inline)
const pwdModal = `{phaseToUnlock === phase.id && (
                          <div className="bg-white p-3 mt-3 mb-4 border border-indigo-100 rounded-lg shadow-sm flex items-end gap-3">
                            <div className="flex-1">
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Admin Password to Edit</label>
                              <input 
                                type="password" 
                                value={unlockPassword}
                                onChange={e => setUnlockPassword(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                placeholder="Password"
                              />
                            </div>
                            <button 
                              onClick={() => {
                                if (unlockPassword === 'Anshu9785') {
                                  setUnlockedPhases(prev => ({...prev, [phase.id]: true}));
                                  setPhaseToUnlock(null);
                                  setUnlockPassword('');
                                } else {
                                  alert('Incorrect password!');
                                }
                              }}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700"
                            >
                              Unlock
                            </button>
                          </div>
                        )}`;
code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">/,
  `${pwdModal}\n                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">`
);

// 6. Disable Conditions (replace hardcoded status disabled)
code = code.replace(/disabled=\{phase\.status === 'Received'\}/g, `disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}`);

// For Title, Amount, Status: replace className logic
code = code.replace(
  /className=\{`w-full px-3 py-2 border rounded-lg outline-none \$\{phase\.status === 'Received' \? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'\}`\}/g,
  `className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`}`
);

// 7. Status field explicit addition of disabled / class
code = code.replace(
  /onChange=\{\(e\) => updatePhase\(phase\.id, \{ status: e\.target\.value as any \}\)\}\n\s*className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `onChange={(e) => updatePhase(phase.id, { status: e.target.value as any })}\n                            disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}\n                            className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`}`
);

// 8. Date field explicit
code = code.replace(
  /onChange=\{\(e\) => updatePhase\(phase\.id, \{ date: e\.target\.value \}\)\}\n\s*className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `onChange={(e) => updatePhase(phase.id, { date: e.target.value })}\n                            disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}\n                            className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`}`
);

// 9. UTR field explicit
code = code.replace(
  /onChange=\{\(e\) => updatePhase\(phase\.id, \{ utrNumber: e\.target\.value \}\)\}\n\s*placeholder="Enter UTR or Transaction ID"\n\s*className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/,
  `onChange={(e) => updatePhase(phase.id, { utrNumber: e.target.value })}\n                                    disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}\n                                    placeholder="Enter UTR or Transaction ID"\n                                    className={\`w-full px-3 py-2 border rounded-lg outline-none \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'}\`}`
);

// 10. Screenshot fields
code = code.replace(
  /onClick=\{\(\) => updatePhase\(phase\.id, \{ screenshotUrl: undefined \}\)\} className="text-xs text-slate-500 hover:text-slate-800 underline"/,
  `onClick={() => updatePhase(phase.id, { screenshotUrl: undefined })} disabled={phase.status === 'Received' && !unlockedPhases[phase.id]} className="text-xs text-slate-500 hover:text-slate-800 underline disabled:opacity-50 disabled:no-underline"`
);

code = code.replace(
  /onChange=\{\(e\) => handleScreenshotUpload\(phase\.id, e\)\}\n\s*className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"\n\s*\/>\n\s*<div className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-lg bg-white flex items-center justify-center text-xs text-slate-500 hover:bg-slate-50">/,
  `onChange={(e) => handleScreenshotUpload(phase.id, e)}\n                                        disabled={phase.status === 'Received' && !unlockedPhases[phase.id]}\n                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"\n                                       />\n                                      <div className={\`w-full px-3 py-2 border border-dashed rounded-lg flex items-center justify-center text-xs \${phase.status === 'Received' && !unlockedPhases[phase.id] ? 'bg-slate-100 border-slate-300 text-slate-400' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}\`}>`
);

fs.writeFileSync(file, code);
console.log('Patched phase lock');
