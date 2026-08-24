const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

const importRegex = /import React, \{ useState, useEffect \} from 'react';/;
const replacementImports = `import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();`;

content = content.replace(importRegex, replacementImports);

const stateRegex = /const \[pdfBlobUrl, setPdfBlobUrl\] = useState<string \| null>\(null\);/;
const replacementState = `const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }`;

content = content.replace(stateRegex, replacementState);

const targetPdfBlock = /<div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative flex flex-col items-center justify-center p-8 text-center">[\s\S]*?<\/div>\s*<\/div>/;

const replacementPdfBlock = `{pdfBlobUrl && (
                      <div className="flex justify-end mb-3 shrink-0">
                        <a 
                          href={pdfBlobUrl} 
                          download={\`Quotation-\${order?.id || 'Document'}.pdf\`}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Download PDF
                        </a>
                      </div>
                    )}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-y-auto relative flex justify-center p-4">
                      {pdfBlobUrl ? (
                        <Document file={pdfBlobUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="text-slate-500 py-10">Rendering PDF...</div>}>
                          {Array.from(new Array(numPages), (el, index) => (
                            <div key={\`page_\${index + 1}\`} className="mb-4 shadow-md border border-slate-200 bg-white">
                              <Page pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} width={800} />
                            </div>
                          ))}
                        </Document>
                      ) : (
                        <div className="flex justify-center items-center h-full text-slate-500">Loading PDF...</div>
                      )}
                    </div>
                  </div>`;

content = content.replace(targetPdfBlock, replacementPdfBlock);
fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched PDF with react-pdf!");
