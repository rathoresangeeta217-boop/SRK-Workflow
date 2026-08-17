const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

const filterLogic = `
  const filteredQuotes = quotes.filter(quote => {
    if (!quoteSearchQuery) return true;
    const items = quote.items && quote.items.length > 0 ? quote.items : [quote];
    return items.some((item: any) => 
      item.productName?.toLowerCase().includes(quoteSearchQuery.toLowerCase()) || 
      item.specification?.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
      quote.category?.toLowerCase().includes(quoteSearchQuery.toLowerCase())
    );
  });
`;

code = code.replace(
  "const filteredProducts = products.filter(p =>",
  filterLogic + "\n  const filteredProducts = products.filter(p =>"
);

code = code.replace(
  "quotes.length === 0",
  "filteredQuotes.length === 0"
);

code = code.replace(
  "quotes.flatMap((quote, i) => {",
  "filteredQuotes.flatMap((quote, i) => {"
);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated PurchaseTab.tsx with quote filtering");
