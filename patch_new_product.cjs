const fs = require('fs');
let code = fs.readFileSync('src/components/NewProductModal.tsx', 'utf8');

// The initial state of formData
code = code.replace(
  /measuringMetric: 'kg',\n\s*vendorId: '',/g,
  "measuringMetric: 'kg',\n    category: '',\n    vendorId: '',"
);

// The reset state of formData
code = code.replace(
  /measuringMetric: 'kg',\n\s*vendorId: '',/g,
  "measuringMetric: 'kg',\n        category: '',\n        vendorId: '',"
);

// The UI insertion
const categoryUI = `
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                    <input 
                      type="text" 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      list="product-categories"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                      placeholder="Select or enter category (e.g. Hardware)"
                    />
                    <datalist id="product-categories">
                      {Array.from(new Set(vendors.map(v => v.category).filter(Boolean))).map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
`;

if (!code.includes('name="category"')) {
  code = code.replace(
    /<div className="space-y-1.5">\s*<label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Measuring Metric<\/label>/g,
    categoryUI + '\n                  <div className="space-y-1.5">\n                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Measuring Metric</label>'
  );
}

fs.writeFileSync('src/components/NewProductModal.tsx', code);
console.log("Patched NewProductModal");
