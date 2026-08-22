const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add State
code = code.replace(
  /const \[unlockPassword, setUnlockPassword\] = useState\(''\);/,
  `const [unlockPassword, setUnlockPassword] = useState('');\n  const [viewImage, setViewImage] = useState<string | null>(null);`
);

// 2. Add Lightbox UI at the end of the return statement, before final </AnimatePresence> or </motion.div>
// Let's inject it right before the last </div></motion.div></div></AnimatePresence> pattern or similar.
// Actually, injecting right before `</motion.div>\n        </div>\n      )}` is safer. Let's just append it inside the overlay.
const lightboxCode = `
      {viewImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/95 p-4" onClick={() => setViewImage(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 bg-slate-800 rounded-full" onClick={() => setViewImage(null)}>
            <X className="w-6 h-6" />
          </button>
          <img src={viewImage} alt="Full Proof" className="max-w-full max-h-[90vh] rounded-lg object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
`;

code = code.replace(
  /(<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>\s*)$/,
  `${lightboxCode}\n      $1`
);

// 3. Replace the <a> tags with <button> tags that setViewImage
const oldImageHTML = `<div className="flex items-center gap-3">
                                      <a href={phase.screenshotUrl} target="_blank" rel="noopener noreferrer" className="block w-12 h-12 rounded border border-slate-300 overflow-hidden bg-slate-100 hover:opacity-80 transition-opacity" title="Click to view full image">
                                        <img src={phase.screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                                      </a>
                                      <div className="flex flex-col items-start gap-1.5">
                                        <a href={phase.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline">View Full Image</a>
                                        <button type="button" onClick={() => updatePhase(phase.id, { screenshotUrl: undefined })} disabled={phase.status === 'Received' && !unlockedPhases[phase.id]} className="text-xs text-rose-500 hover:text-rose-700 underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed">Remove</button>
                                      </div>
                                    </div>`;

const newImageHTML = `<div className="flex items-center gap-3">
                                      <button type="button" onClick={() => setViewImage(phase.screenshotUrl || null)} className="block w-12 h-12 rounded border border-slate-300 overflow-hidden bg-slate-100 hover:opacity-80 transition-opacity" title="Click to view full image">
                                        <img src={phase.screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                                      </button>
                                      <div className="flex flex-col items-start gap-1.5">
                                        <button type="button" onClick={() => setViewImage(phase.screenshotUrl || null)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline">View Full Image</button>
                                        <button type="button" onClick={() => updatePhase(phase.id, { screenshotUrl: undefined })} disabled={phase.status === 'Received' && !unlockedPhases[phase.id]} className="text-xs text-rose-500 hover:text-rose-700 underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed">Remove</button>
                                      </div>
                                    </div>`;

code = code.replace(oldImageHTML, newImageHTML);

fs.writeFileSync(file, code);
console.log('Patched Image Viewer');
