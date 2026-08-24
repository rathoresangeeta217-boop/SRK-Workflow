const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');
content = content.replace(
  /if \(order\.details\?\.products && order\.details\.products\.length > 0\) \{\n\s*setProducts\(order\.details\.products\);\n\s*\} else \{\n\s*const itemCount = order\.items \|\| 1;\n\s*const mockProducts: OrderProduct\[\] = Array\.from\(\{ length: itemCount \}\)\.map\(\(_, i\) => \(\{\n\s*id: \`prod-\$\{i\}-\$\{Date\.now\(\)\}\`,\n\s*name: \`Product \$\{i \+ 1\}\`,\n\s*quantity: 1,\n\s*size: 'Standard',\n\s*isDispatched: false\n\s*\}\)\);\n\s*setProducts\(mockProducts\);\n\s*\}/,
  \`if (order.details?.products && order.details.products.length > 0) {
        setProducts(order.details.products);
      } else {
        setProducts([]);
      }\`
);
fs.writeFileSync('src/components/DispatchView.tsx', content);
