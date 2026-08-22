const fs = require('fs');
let code = fs.readFileSync('src/tabs/OrdersTab.tsx', 'utf8');

const regex = /const getOrdersStats[\s\S]*?const stats = getOrdersStats\(\);\n/m;
const match = code.match(regex);

if (match) {
  // Remove the old injected code from inside useEffect
  code = code.replace(match[0], "");
  
  // Inject it right before the actual return statement of the component
  code = code.replace(/return \(\s*<div className="space-y-6 pb-8">/, match[0] + '\n  return (\n    <div className="space-y-6 pb-8">');
  
  fs.writeFileSync('src/tabs/OrdersTab.tsx', code);
  console.log("Fixed stats scope.");
} else {
  console.log("Could not find stats logic");
}
