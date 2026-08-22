const fs = require('fs');

let content = fs.readFileSync('src/tabs/OrdersTab.tsx', 'utf8');

if (!content.includes('>Salesperson</th>')) {
  content = content.replace(
    '<th className="px-6 py-3 border-b border-slate-200">Date</th>',
    '<th className="px-6 py-3 border-b border-slate-200">Date</th>\n                  <th className="px-6 py-3 border-b border-slate-200">Salesperson</th>'
  );
  
  content = content.replace(
    '<td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{order.date}</td>',
    '<td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{order.date}</td>\n                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{order.details?.employeeName || \'-\'}</td>'
  );
  
  // Also fix the colspan in the empty states
  content = content.replace(
    /colSpan=\{6\}/g,
    'colSpan={8}'
  );
}

fs.writeFileSync('src/tabs/OrdersTab.tsx', content);
