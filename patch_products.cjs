const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

content = content.replace(
  /setProducts\(\[\]\);/,
  `const itemCount = order.items || 1;
        const mockProducts: OrderProduct[] = Array.from({ length: itemCount }).map((_, i) => ({
          id: \`prod-\$\{i\}-\$\{Date.now()\}\`,
          name: '',
          quantity: 1,
          size: '',
          isDispatched: false
        }));
        setProducts(mockProducts);`
);

content = content.replace(
  /<h4 className="text-base font-bold text-slate-800">\{product\.name\}<\/h4>/,
  `<h4 className="text-base font-bold text-slate-800">
                          {product.name || <span className="text-slate-400 italic">Click to select product...</span>}
                        </h4>`
);

fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched dispatch view mock products");
