const fs = require('fs');
const file = 'src/components/PaymentManagementModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const lightboxCode = `
      {viewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-4" onClick={() => setViewImage(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 bg-slate-800 rounded-full" onClick={() => setViewImage(null)}>
            <X className="w-6 h-6" />
          </button>
          <img src={viewImage} alt="Full Proof" className="max-w-full max-h-[90vh] rounded-lg object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
`;

code = code.replace(
  /<\/motion\.div>\s*<\/div>\s*<\/AnimatePresence>/,
  `</motion.div>\n      </div>\n${lightboxCode}\n    </AnimatePresence>`
);

fs.writeFileSync(file, code);
console.log('Fixed lightbox');
