const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

const oldHandleImageSearchEnd = `      if (data.matchingIds) {
        setVisualMatchIds(data.matchingIds);
        if (activeTab === 'products') setProductSearchQuery('');
        else setQuoteSearchQuery('');
      }`;

const newHandleImageSearchEnd = `      if (data.matchingIds) {
        setVisualMatchIds(data.matchingIds);
        if (activeTab === 'products') setProductSearchQuery('');
        else setQuoteSearchQuery('');
        
        if (data.matchingIds.length === 0) {
          alert('No visually similar items were found in the catalog.');
        }
      }`;

code = code.replace(oldHandleImageSearchEnd, newHandleImageSearchEnd);
fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated handleImageSearch alert");
