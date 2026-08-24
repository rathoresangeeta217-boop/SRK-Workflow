const fs = require('fs');
let content = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');

if (!content.includes('const [parsedProducts')) {
  // Add parsedProducts state
  content = content.replace(
    '  const [drawingFile, setDrawingFile] = useState<File | null>(null);',
    '  const [drawingFile, setDrawingFile] = useState<File | null>(null);\n  const [parsedProducts, setParsedProducts] = useState<any[]>([]);'
  );

  // Set parsedProducts in fetch then
  content = content.replace(
    '            installationCharges: data.installationCharges || \'\'\n          });',
    '            installationCharges: data.installationCharges || \'\'\n          });\n          if (data.products && Array.isArray(data.products)) {\n            setParsedProducts(data.products.map((p, i) => ({ id: Math.random().toString(36).substr(2, 9), name: p.name, quantity: p.quantity, isDispatched: false })));\n          }'
  );

  // Reset parsedProducts when closing
  content = content.replace(
    '        installationCharges: \'\'\n      });',
    '        installationCharges: \'\'\n      });\n      setParsedProducts([]);'
  );

  // Pass products when handling submit
  content = content.replace(
    '      onAddOrder(orderData);',
    '      orderData.products = parsedProducts.length > 0 ? parsedProducts : Array.from({ length: formData.totalItems || 1 }).map((_, i) => ({\n        id: Math.random().toString(36).substr(2, 9),\n        name: `Product ${i + 1}`,\n        quantity: 1,\n        isDispatched: false\n      }));\n      onAddOrder(orderData);'
  );

  fs.writeFileSync('src/components/NewOrderModal.tsx', content);
}
