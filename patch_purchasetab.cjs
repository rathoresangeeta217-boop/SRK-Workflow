const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

if (!code.includes('import { ReceiveDeliveryModal }')) {
  code = code.replace(
    "import { EditQuoteModal } from '../components/EditQuoteModal';",
    "import { EditQuoteModal } from '../components/EditQuoteModal';\nimport { ReceiveDeliveryModal } from '../components/ReceiveDeliveryModal';"
  );
}

if (!code.includes('const [selectedPO, setSelectedPO] = useState')) {
  code = code.replace(
    "const [isRequestQuoteModalOpen, setIsRequestQuoteModalOpen] = useState(false);",
    "const [isRequestQuoteModalOpen, setIsRequestQuoteModalOpen] = useState(false);\n  const [selectedPO, setSelectedPO] = useState<Purchase | null>(null);\n  const [isReceiveDeliveryModalOpen, setIsReceiveDeliveryModalOpen] = useState(false);"
  );
}

if (!code.includes('<ReceiveDeliveryModal')) {
  code = code.replace(
    "{/* Image View Modal */}",
    `<ReceiveDeliveryModal\n        isOpen={isReceiveDeliveryModalOpen}\n        onClose={() => setIsReceiveDeliveryModalOpen(false)}\n        purchase={selectedPO}\n      />\n\n      {/* Image View Modal */}`
  );
}

const oldActionBtn = `<button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>`;
const newActionBtn = `<button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPO(po);
                                setIsReceiveDeliveryModalOpen(true);
                              }}
                              className={\`p-1.5 rounded-md transition-colors \${po.status === 'Delivered' ? 'text-green-500 hover:text-green-700 hover:bg-green-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}\`}
                              title={po.status === 'Delivered' ? 'View QC Report' : 'Receive Delivery'}
                            >
                              {po.status === 'Delivered' ? <FileText className="w-5 h-5" /> : <ClipboardCheck className="w-5 h-5" />}
                            </button>`;

code = code.replace(oldActionBtn, newActionBtn);

// Ensure ClipboardCheck is imported
if (!code.includes('ClipboardCheck')) {
    code = code.replace(
        "Edit, ShoppingBag, Camera, Loader2, ShoppingCart, Users, AlertCircle, Plus, Truck, Filter, MoreHorizontal, FileText, Building2, Trash2, Search, MessageCircle, X, Copy, Mail",
        "Edit, ShoppingBag, Camera, Loader2, ShoppingCart, Users, AlertCircle, Plus, Truck, Filter, MoreHorizontal, FileText, Building2, Trash2, Search, MessageCircle, X, Copy, Mail, ClipboardCheck"
    );
}

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log('Patched');
