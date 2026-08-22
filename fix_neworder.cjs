const fs = require('fs');

let content = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');

// Fix the setFormData block in fetch response
content = content.replace(
  /setFormData\(\{\s*employeeName:\s*'',\s*employeeName:\s*employeeName\s*\|\|\s*'',\s*\.\.\.formData,/,
  "setFormData({\n            ...formData,\n            employeeName: employeeName || '',"
);

// Fix the else if (!isOpen) block
content = content.replace(
  "setFormData({\n        customerName: '',\n        companyName: '',",
  "setFormData({\n        employeeName: '',\n        customerName: '',\n        companyName: '',"
);

// Add Employee Name input to the UI if not exists
if (!content.includes('Employee Name</label>')) {
  const employeeInput = `
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Employee Name</label>
                      <input 
                        type="text" 
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50"
                        placeholder="Employee Name"
                        readOnly
                      />
                    </div>
`;
  
  content = content.replace(
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">',
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n' + employeeInput
  );
}

fs.writeFileSync('src/components/NewOrderModal.tsx', content);
