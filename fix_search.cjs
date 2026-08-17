const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

// Modify handleImageSearch to update the correct query state based on the active tab
code = code.replace(
  "setQuoteSearchQuery(data.searchQuery);",
  "if (activeTab === 'products') { setProductSearchQuery(data.searchQuery); } else { setQuoteSearchQuery(data.searchQuery); }"
);

// We should also remove the hardcoded setActiveTab('quotes'); so it stays on the current tab
code = code.replace(
  "setActiveTab('quotes');",
  "// setActiveTab('quotes');"
);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated handleImageSearch");
