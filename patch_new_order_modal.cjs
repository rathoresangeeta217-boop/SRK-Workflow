const fs = require('fs');

let content = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');

if (!content.includes('employeeName?: string')) {
  content = content.replace(
    "onAddOrder?: (order: any) => void;",
    "onAddOrder?: (order: any) => void;\n  employeeName?: string;"
  );
  
  content = content.replace(
    "export function NewOrderModal({ isOpen, onClose, fileName, fileData, onAddOrder }: NewOrderModalProps) {",
    "export function NewOrderModal({ isOpen, onClose, fileName, fileData, onAddOrder, employeeName }: NewOrderModalProps) {"
  );
  
  content = content.replace(
    "const [formData, setFormData] = useState({",
    "const [formData, setFormData] = useState({\n    employeeName: '',"
  );
  
  content = content.replace(
    "setFormData({",
    "setFormData({\n        employeeName: employeeName || '',"
  );
  
  content = content.replace(
    /setFormData\(\{\s*\n\s*\.\.\.formData,/,
    "setFormData({\n            ...formData,\n            employeeName: employeeName || '',"
  );
  
  content = content.replace(
    "setFormData({",
    "setFormData({\n        employeeName: '',"
  );

  // Fix the first replacement of setFormData({ which was inside useEffect when parsing starts
  content = content.replace(
    "setFormData({\n        employeeName: employeeName || '',\n            ...formData,\n            employeeName: employeeName || '',",
    "setFormData({\n            ...formData,\n            employeeName: employeeName || '',"
  );

  // We should just use a precise regex to update the formData initial state and resets.
}

fs.writeFileSync('src/components/NewOrderModal.tsx', content);
