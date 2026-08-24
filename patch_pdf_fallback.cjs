const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

const targetPdfBlock = /pdfBlobUrl \? \([\s\S]*?\) : \([\s\S]*?<div className="flex justify-center items-center h-full text-slate-500">Loading PDF...<\/div>\s*\)\s*\)/;

const replacementPdfBlock = `
                  <div className="flex flex-col h-full w-full">
                    {pdfBlobUrl && (
                      <div className="flex justify-end mb-3 shrink-0">
                        <a 
                          href={pdfBlobUrl} 
                          download={\`Quotation-\${order?.id || 'Document'}.pdf\`}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Download PDF File
                        </a>
                      </div>
                    )}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
                      {pdfBlobUrl ? (
                        <object data={\`\${pdfBlobUrl}#toolbar=0\`} type="application/pdf" className="w-full h-full absolute inset-0">
                          <embed src={\`\${pdfBlobUrl}#toolbar=0\`} type="application/pdf" className="w-full h-full" />
                        </object>
                      ) : (
                        <div className="flex justify-center items-center h-full text-slate-500">Loading PDF...</div>
                      )}
                    </div>
                  </div>
                )`;

content = content.replace(targetPdfBlock, replacementPdfBlock);
fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched PDF rendering with fallback download!");
