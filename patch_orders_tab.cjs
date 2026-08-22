const fs = require('fs');

let content = fs.readFileSync('src/tabs/OrdersTab.tsx', 'utf8');

// 1. Add employee state
if (!content.includes('isEmployeeModalOpen')) {
  content = content.replace(
    "const [isModalOpen, setIsModalOpen] = useState(false);",
    "const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);\n  const [selectedEmployee, setSelectedEmployee] = useState('');\n  const [isModalOpen, setIsModalOpen] = useState(false);"
  );
}

// 2. Modify handleNewOrderClick
content = content.replace(
  "const handleNewOrderClick = () => {\n    fileInputRef.current?.click();\n  };",
  "const handleNewOrderClick = () => {\n    setIsEmployeeModalOpen(true);\n  };\n\n  const handleProceedToUpload = () => {\n    setIsEmployeeModalOpen(false);\n    fileInputRef.current?.click();\n  };"
);

// 3. Add employee modal markup
const employeeModalMarkup = `
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Select Salesperson</h2>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Employee Name</label>
              <select 
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="" disabled>Select an employee</option>
                <option value="Khushboo Modi">Khushboo Modi</option>
                <option value="Abhilasha verma">Abhilasha verma</option>
                <option value="Anshuman Singh">Anshuman Singh</option>
                <option value="Bhawna Khandelwal">Bhawna Khandelwal</option>
              </select>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToUpload}
                disabled={!selectedEmployee}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                Next <FileText className="w-4 h-4 ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <NewOrderModal 
`;

content = content.replace(
  "<NewOrderModal",
  employeeModalMarkup.trim()
);

// Add employeeName to NewOrderModal props
content = content.replace(
  "onAddOrder={handleAddOrder}",
  "onAddOrder={handleAddOrder}\n        employeeName={selectedEmployee}"
);

// If there's an import X missing, we might need it, but X and FileText are already in lucide-react import
// Wait, looking at OrdersTab.tsx, X is NOT imported. Let's add it.
if (content.includes("import { ShoppingCart, TrendingUp, Clock, CheckCircle2, MoreHorizontal, Filter, Plus, FileText, Download, Loader2 } from 'lucide-react';")) {
  content = content.replace(
    "import { ShoppingCart, TrendingUp, Clock, CheckCircle2, MoreHorizontal, Filter, Plus, FileText, Download, Loader2 } from 'lucide-react';",
    "import { ShoppingCart, TrendingUp, Clock, CheckCircle2, MoreHorizontal, Filter, Plus, FileText, Download, Loader2, X } from 'lucide-react';"
  );
} else if (!content.includes(' X,')) {
  content = content.replace(
    "lucide-react';",
    " X } from 'lucide-react';"
  );
}

fs.writeFileSync('src/tabs/OrdersTab.tsx', content);
