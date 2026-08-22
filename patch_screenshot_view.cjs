const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldCode = `<div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden bg-slate-100">
                                        <img src={phase.screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                                      </div>
                                      <button onClick={() => updatePhase(phase.id, { screenshotUrl: undefined })} disabled={phase.status === 'Received' && !unlockedPhases[phase.id]} className="text-xs text-slate-500 hover:text-slate-800 underline disabled:opacity-50 disabled:no-underline">Remove</button>
                                    </div>`;

const newCode = `<div className="flex items-center gap-3">
                                      <a href={phase.screenshotUrl} target="_blank" rel="noopener noreferrer" className="block w-12 h-12 rounded border border-slate-300 overflow-hidden bg-slate-100 hover:opacity-80 transition-opacity" title="Click to view full image">
                                        <img src={phase.screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                                      </a>
                                      <div className="flex flex-col items-start gap-1.5">
                                        <a href={phase.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline">View Full Image</a>
                                        <button type="button" onClick={() => updatePhase(phase.id, { screenshotUrl: undefined })} disabled={phase.status === 'Received' && !unlockedPhases[phase.id]} className="text-xs text-rose-500 hover:text-rose-700 underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed">Remove</button>
                                      </div>
                                    </div>`;

code = code.replace(oldCode, newCode);
fs.writeFileSync(file, code);
console.log('Patched screenshot view');
