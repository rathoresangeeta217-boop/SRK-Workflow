const fs = require('fs');

let code = fs.readFileSync('src/components/VendorQuoteForm.tsx', 'utf8');

// 1. Update imports
code = code.replace(
  "import { Package, Send, Building2, CheckCircle2, Upload, X } from 'lucide-react';",
  "import { Package, Send, Building2, CheckCircle2, Upload, X, Maximize2, Download } from 'lucide-react';"
);

// 2. Add state
code = code.replace(
  "const [logoError, setLogoError] = useState(false);",
  "const [logoError, setLogoError] = useState(false);\n  const [viewingImage, setViewingImage] = useState<string | null>(null);"
);

// 3. Update image rendering logic
const oldImageHtml = `{item.imageUrl && (
                        <div className="flex gap-4">
                          <span className="text-slate-500 w-24 shrink-0 font-medium pt-2">Ref. Image</span>
                          <div className="w-full h-48 bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <img src={item.imageUrl} alt="Reference" className="w-full h-full object-contain p-1" />
                          </div>
                        </div>
                      )}`;

const newImageHtml = `{item.imageUrl && (
                        <div className="flex gap-4">
                          <span className="text-slate-500 w-24 shrink-0 font-medium pt-2">Ref. Image</span>
                          <div 
                            className="relative w-full h-64 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group"
                            onClick={() => setViewingImage(item.imageUrl)}
                          >
                            <img src={item.imageUrl} alt="Reference" className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="bg-white/95 text-slate-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm transform scale-95 group-hover:scale-100 duration-200">
                                <Maximize2 className="w-4 h-4" /> Click to enlarge
                              </div>
                            </div>
                          </div>
                        </div>
                      )}`;

code = code.replace(oldImageHtml, newImageHtml);

// 4. Add Modal at the end of the return
const modalHtml = `
      {/* Full Screen Image Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4" onClick={() => setViewingImage(null)}>
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
}`;

code = code.replace(/    <\/div>\n  \);\n}$/g, modalHtml);

fs.writeFileSync('src/components/VendorQuoteForm.tsx', code);
console.log("Updated VendorQuoteForm.tsx");
