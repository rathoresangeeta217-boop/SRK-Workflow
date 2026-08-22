const fs = require('fs');

let content = fs.readFileSync('src/components/OrderDetailsModal.tsx', 'utf8');

// We can add it next to Customer Name
if (!content.includes('Salesperson')) {
  const salespersonHtml = `
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Salesperson</p>
                      <p className="text-sm font-semibold text-slate-800">{order.details?.employeeName || 'N/A'}</p>
                    </div>
                  </div>`;
  
  content = content.replace(
    /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">\s*<div className="flex items-start gap-3">/,
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n' + salespersonHtml + '\n                  <div className="flex items-start gap-3">'
  );
}

fs.writeFileSync('src/components/OrderDetailsModal.tsx', content);
