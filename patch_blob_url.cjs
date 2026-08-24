const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

// Add state for pdfBlobUrl
content = content.replace(
  'const [showQuotation, setShowQuotation] = useState(false);',
  'const [showQuotation, setShowQuotation] = useState(false);\n  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);'
);

// Add useEffect to generate blob URL
const effectRegex = /useEffect\(\(\) => \{\n    if \(order\)/;
const newEffect = `useEffect(() => {
    if (quotationFile && quotationFile.startsWith('data:application/pdf')) {
      fetch(quotationFile)
        .then(res => res.blob())
        .then(blob => setPdfBlobUrl(URL.createObjectURL(blob)))
        .catch(e => console.error(e));
    }
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [quotationFile]);

  useEffect(() => {
    if (order)`;

content = content.replace(effectRegex, newEffect);

// Replace the iframe source
const iframeRegex = /<iframe src=\{\`\\\$\\{quotationFile\\}#toolbar=0\`\} className="w-full h-full rounded-lg shadow-sm border border-slate-200" title="Quotation PDF" \/>/g;
const newIframe = `
                  {pdfBlobUrl ? (
                    <iframe src={\`\${pdfBlobUrl}#toolbar=0\`} className="w-full h-full rounded-lg shadow-sm border border-slate-200" title="Quotation PDF" />
                  ) : (
                    <div className="flex justify-center items-center h-full text-slate-500">Loading PDF...</div>
                  )}
`;

content = content.replace(/<iframe src=\{`\$\{quotationFile\}#toolbar=0`\} className="w-full h-full rounded-lg shadow-sm border border-slate-200" title="Quotation PDF" \/>/, newIframe);

fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched dispatch view for PDF rendering!");
