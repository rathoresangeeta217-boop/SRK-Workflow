const fs = require('fs');

let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

// 1. State changes
content = content.replace(
  "const [unlockPassword, setUnlockPassword] = useState('');",
  "const [authPassword, setAuthPassword] = useState('');\n  const [authAction, setAuthAction] = useState<{type: 'editRates' | 'addPhase' | 'unlockPhase', phaseId?: string} | null>(null);"
);

content = content.replace(
  "setPhaseToUnlock(null);\n      setUnlockPassword('');",
  "setPhaseToUnlock(null);\n      setAuthPassword('');\n      setAuthAction(null);"
);

// Add handleAuthSubmit
const handleAuthCode = `
  const handleAuthSubmit = () => {
    const validPasswords = ['Anshu9785', 'Abhi6462', 'Kushi7608'];
    if (validPasswords.includes(authPassword)) {
      if (authAction?.type === 'editRates') {
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
      } else if (authAction?.type === 'addPhase') {
        addPhase();
      } else if (authAction?.type === 'unlockPhase' && authAction.phaseId) {
        setUnlockedPhases(prev => ({...prev, [authAction.phaseId]: true}));
      }
      setAuthAction(null);
      setAuthPassword('');
    } else {
      alert('Incorrect password! You are not authorized.');
    }
  };
`;

content = content.replace(
  "const loadPaymentRecord = async () => {",
  handleAuthCode + "\n  const loadPaymentRecord = async () => {"
);

// 2. Edit Rates button
const editRatesOld = `onClick={() => {
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

const editRatesNew = `onClick={() => {
                  if (isEditingAmount) {
                    setRecord({...record, editReason: ''});
                    setIsEditingAmount(false);
                  } else {
                    setAuthAction({ type: 'editRates' });
                  }
                }}`;

content = content.replace(editRatesOld, editRatesNew);

// 3. Add Phase button
content = content.replace(
  "onClick={addPhase}",
  "onClick={() => setAuthAction({ type: 'addPhase' })}"
);

// 4. Locked Phase button
content = content.replace(
  "onClick={() => setPhaseToUnlock(phase.id === phaseToUnlock ? null : phase.id)}",
  "onClick={() => setAuthAction({ type: 'unlockPhase', phaseId: phase.id })}"
);

// 5. Remove old inline phaseToUnlock UI
const inlineUIStart = "{phaseToUnlock === phase.id && (";
const inlineUIEnd = "Unlock\n                            </button>\n                          </div>\n                        )}";
// Use regex to remove this whole block robustly
content = content.replace(
  /\{phaseToUnlock === phase\.id && \([\s\S]*?Unlock\n\s*<\/button>\n\s*<\/div>\n\s*\)\}/g,
  ""
);

// 6. Add Auth Modal UI at the bottom
const authModalUI = `
      {authAction && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800">Employee Authorization</h3>
              <button onClick={() => { setAuthAction(null); setAuthPassword(''); }} className="text-slate-400 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Enter your password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAuthSubmit()}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Password"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-2">Only authorized employees can edit payment details.</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => { setAuthAction(null); setAuthPassword(''); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleAuthSubmit} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                  Verify
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
`;

content = content.replace(
  "{viewImage && (",
  authModalUI + "\n      {viewImage && ("
);

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
