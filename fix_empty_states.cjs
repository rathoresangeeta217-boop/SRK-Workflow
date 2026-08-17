const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

// Quotes empty state
const oldQuotesEmpty = `{quoteSearchQuery ? \`No quotes found matching "\${quoteSearchQuery}"\` : 'No quotes found. Click "Request Quote" to create one.'}`;
const newQuotesEmpty = `
                          quotes.length === 0 
                            ? 'No quotes have been requested yet. Click "Request Quote" to create one.' 
                            : (visualMatchIds 
                                ? 'No visually similar quotes were found in your Requested Quotes list.' 
                                : (quoteSearchQuery ? \`No quotes found matching "\${quoteSearchQuery}"\` : 'No quotes found.'))
                        `;
code = code.replace(oldQuotesEmpty, newQuotesEmpty);

// Products empty state
const oldProductsEmpty = `{products.length === 0 ? 'No products found. Click "Add Product" to create one.' : 'No products match your search.'}`;
const newProductsEmpty = `
                      products.length === 0 
                        ? 'No products found. Click "Add Product" to create one.' 
                        : (visualMatchIds 
                            ? 'No visually similar products were found in your Product Directory.' 
                            : 'No products match your search.')
                    `;
code = code.replace(oldProductsEmpty, newProductsEmpty);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated empty states");
