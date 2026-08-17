const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiveDeliveryModal.tsx', 'utf8');

code = code.replace(/import \{ X, CheckCircle, Save, FileText, Package, User, Calendar, ClipboardCheck \} from 'lucide-react';/, "import { X, CheckCircle, Save, FileText, Package, User, Calendar, ClipboardCheck, Upload } from 'lucide-react';");

code = code.replace(/    remarks: ''\n  }\);/g, "    remarks: '',\n    damageImageBase64: ''\n  });");

code = code.replace(/        qcReport: '',\n        remarks: ''\n      }\);/, "        qcReport: '',\n        remarks: '',\n        damageImageBase64: ''\n      });");

const damageImageHtml = `
              {formData.conditionStatus === 'Damaged' && (
                <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-4">
                  <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-rose-500" /> Damage Proof Image
                  </h3>
                  <div className="space-y-3">
                    {!isDelivered && (
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, damageImageBase64: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 transition-colors"
                      />
                    )}
                    {formData.damageImageBase64 && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                        <img src={formData.damageImageBase64} alt="Damage Proof" className="max-h-64 object-contain w-full bg-slate-100" />
                      </div>
                    )}
                    {isDelivered && !formData.damageImageBase64 && (
                      <p className="text-sm text-slate-500">No damage image uploaded.</p>
                    )}
                  </div>
                </div>
              )}
`;

code = code.replace(/              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">\n                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">\n                  <FileText className="w-4 h-4 text-indigo-500" \/> QC & Remarks/g, damageImageHtml + "\n              <div className=\"bg-white p-5 rounded-xl border border-slate-200 space-y-4\">\n                <h3 className=\"text-sm font-bold text-slate-800 flex items-center gap-2\">\n                  <FileText className=\"w-4 h-4 text-indigo-500\" /> QC & Remarks");

fs.writeFileSync('src/components/ReceiveDeliveryModal.tsx', code);
console.log('patched');
