const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

const targetStr = `        </div>
        {/* Right Column: Quotation Document */}
        {quotationFile && (
          <div className="col-span-1 xl:col-span-5 h-[calc(100vh-160px)]">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
              <div className="flex items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                <h3 className="font-semibold text-slate-800">Quotation Document</h3>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center">
                {quotationFile.startsWith('data:image') ? (
                  <img src={quotationFile} alt="Quotation" className="max-w-full h-auto rounded-lg shadow-sm border border-slate-200" />
                ) : quotationFile.startsWith('data:application/pdf') ? (
                  <iframe src={\`\${quotationFile}#toolbar=0\`} className="w-full h-full rounded-lg shadow-sm border border-slate-200" title="Quotation PDF" />
                ) : (
                  <div className="text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>Document preview available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>`;

const newStr = `        </div>
      </div>

      <AnimatePresence>
        {showQuotation && quotationFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowQuotation(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Quotation Document</h3>
                </div>
                <button 
                  onClick={() => setShowQuotation(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto bg-slate-100 p-4">
                {quotationFile.startsWith('data:image') ? (
                  <img src={quotationFile} alt="Quotation" className="max-w-full h-auto mx-auto rounded-lg shadow-sm border border-slate-200" />
                ) : quotationFile.startsWith('data:application/pdf') ? (
                  <iframe src={\`\${quotationFile}#toolbar=0\`} className="w-full h-full rounded-lg shadow-sm border border-slate-200" title="Quotation PDF" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <FileText className="w-12 h-12 mb-2 text-slate-300" />
                    <p>Document format not supported for preview</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>`;

if (content.includes('{/* Right Column: Quotation Document */}')) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/components/DispatchView.tsx', content);
  console.log("Patched successfully!");
} else {
  console.log("Could not find target string.");
}
