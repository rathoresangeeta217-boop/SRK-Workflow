const fs = require('fs');

let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

content = content.replace(
  "disabled={isLoading}",
  "disabled={isLoading || (isEditingAmount && (!record.editReason || !record.editReason.trim()))}"
);

content = content.replace(
  "className=\"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none\"",
  "className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${(!record.editReason || !record.editReason.trim()) ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}"
);

fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
