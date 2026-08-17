const fs = require('fs');

let code = fs.readFileSync('src/components/VendorQuoteForm.tsx', 'utf8');

const modalHtml = `
      {/* Full Screen Image Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4" onClick={() => setViewingImage(null)}>
          <div className="relative w-full max-w-5xl max-h-screen flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
              <a
                href={viewingImage}
                download="product-reference.jpg"
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-lg"
                onClick={e => e.stopPropagation()}
              >
                <Download className="w-4 h-4" /> Download
              </a>
              <button
                onClick={() => setViewingImage(null)}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img src={viewingImage} alt="Full screen reference" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
`;

code = code.replace(/    <\/div>\n  \);\n}$/, modalHtml);

fs.writeFileSync('src/components/VendorQuoteForm.tsx', code);
console.log("Fixed VendorQuoteForm modal");
