const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

const targetPdfBlock = /<div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">[\s\S]*?<\/object>\s*\) : \(\s*<div className="flex justify-center items-center h-full text-slate-500">Loading PDF...<\/div>\s*\)\}\s*<\/div>/;

const replacementPdfBlock = `<div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative flex flex-col items-center justify-center p-8 text-center">
                      <FileText className="w-16 h-16 text-indigo-200 mb-4" />
                      <h4 className="text-lg font-medium text-slate-800 mb-2">PDF Ready for Download</h4>
                      <p className="text-slate-500 max-w-md mb-6">
                        For security reasons, inline PDF preview is disabled in this environment. Please download the document to view it.
                      </p>
                      {pdfBlobUrl ? (
                        <a 
                          href={pdfBlobUrl} 
                          download={\`Quotation-\${order?.id || 'Document'}.pdf\`}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Download PDF
                        </a>
                      ) : (
                        <div className="px-5 py-2.5 text-sm font-medium text-slate-400 bg-slate-100 rounded-lg">
                          Preparing download...
                        </div>
                      )}
                    </div>`;

content = content.replace(targetPdfBlock, replacementPdfBlock);

// Also remove the redundant top right download button since we have one centrally located now.
content = content.replace(/\{pdfBlobUrl && \([\s\S]*?<div className="flex justify-end mb-3 shrink-0">[\s\S]*?<\/div>\s*\)\}/, '');

fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched PDF to be download only!");
