const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

// 1. Add visualMatchIds state
code = code.replace(
  "const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);",
  "const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);\n  const [visualMatchIds, setVisualMatchIds] = useState<string[] | null>(null);"
);

// 2. Clear visualMatchIds when text search is used
code = code.replace(
  "onChange={(e) => activeTab === 'products' ? setProductSearchQuery(e.target.value) : setQuoteSearchQuery(e.target.value)}",
  "onChange={(e) => { if (activeTab === 'products') { setProductSearchQuery(e.target.value); setVisualMatchIds(null); } else { setQuoteSearchQuery(e.target.value); setVisualMatchIds(null); } }}"
);
code = code.replace(
  "onClick={() => activeTab === 'products' ? setProductSearchQuery('') : setQuoteSearchQuery('')}",
  "onClick={() => { if (activeTab === 'products') { setProductSearchQuery(''); setVisualMatchIds(null); } else { setQuoteSearchQuery(''); setVisualMatchIds(null); } }}"
);

// 3. Update handleImageSearch to use the new endpoint
const oldHandleImageSearch = `      const response = await fetch('/api/identify-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Data })
      });
      
      if (!response.ok) throw new Error('Failed to analyze image');
      
      const data = await response.json();
      if (data.searchQuery) {
        if (activeTab === 'products') { setProductSearchQuery(data.searchQuery); } else { setQuoteSearchQuery(data.searchQuery); }
        // setActiveTab('quotes');
      }`;

const newHandleImageSearch = `      const catalog = activeTab === 'products' 
        ? products.map(p => ({ id: p.id, name: p.name, specification: p.specification, category: 'product' }))
        : quotes.map(q => ({ id: q.id, category: q.category, items: q.items?.map(i => i.productName + ' ' + (i.specification || '')) }));
      
      const response = await fetch('/api/visual-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Data, catalog })
      });
      
      if (!response.ok) throw new Error('Failed to analyze image');
      
      const data = await response.json();
      if (data.matchingIds) {
        setVisualMatchIds(data.matchingIds);
        if (activeTab === 'products') setProductSearchQuery('');
        else setQuoteSearchQuery('');
      }`;

code = code.replace(oldHandleImageSearch, newHandleImageSearch);

// 4. Update filtering logic to prioritize visualMatchIds
const oldFilterQuotes = `  const filteredQuotes = quotes.filter(quote => {
    if (!quoteSearchQuery) return true;
    const items = quote.items && quote.items.length > 0 ? quote.items : [quote];
    return items.some((item: any) => 
      item.productName?.toLowerCase().includes(quoteSearchQuery.toLowerCase()) || 
      item.specification?.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
      quote.category?.toLowerCase().includes(quoteSearchQuery.toLowerCase())
    );
  });`;

const newFilterQuotes = `  const filteredQuotes = quotes.filter(quote => {
    if (visualMatchIds) return visualMatchIds.includes(quote.id);
    if (!quoteSearchQuery) return true;
    const items = quote.items && quote.items.length > 0 ? quote.items : [quote];
    return items.some((item: any) => 
      item.productName?.toLowerCase().includes(quoteSearchQuery.toLowerCase()) || 
      item.specification?.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
      quote.category?.toLowerCase().includes(quoteSearchQuery.toLowerCase())
    );
  });`;

code = code.replace(oldFilterQuotes, newFilterQuotes);

const oldFilterProducts = `  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
    (p.vendorName || '').toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    (p.specification || '').toLowerCase().includes(productSearchQuery.toLowerCase())
  );`;

const newFilterProducts = `  const filteredProducts = products.filter(p => {
    if (visualMatchIds) return visualMatchIds.includes(p.id);
    return p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
      (p.vendorName || '').toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      (p.specification || '').toLowerCase().includes(productSearchQuery.toLowerCase());
  });`;

code = code.replace(oldFilterProducts, newFilterProducts);

// 5. Change "Search by Image" text if visualMatchIds is active
code = code.replace(
  "{isAnalyzingImage ? 'Analyzing...' : 'Search by Image'}",
  "{isAnalyzingImage ? 'Analyzing...' : (visualMatchIds ? 'Clear Image Match' : 'Search by Image')}"
);

// Allow clicking the camera button to clear the image match if it's already active
const oldCameraLabel = `                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageSearch} 
                      disabled={isAnalyzingImage}
                    />`;
const newCameraLabel = `                    {visualMatchIds ? (
                      <button 
                        type="button"
                        className="hidden" 
                        onClick={() => setVisualMatchIds(null)}
                      />
                    ) : (
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageSearch} 
                        disabled={isAnalyzingImage}
                      />
                    )}`;

code = code.replace(oldCameraLabel, newCameraLabel);

// Also need to make sure the label click works to clear it if it's a button.
// Actually, if it's a <label>, clicking it triggers the first input/button inside it.
// Let's modify the label tag to conditionally be a button if visualMatchIds is true.
const oldLabelOuter = `                  <label 
                    className={\`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer border \${
                      isAnalyzingImage 
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                    }\`}
                  >
                    {isAnalyzingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{isAnalyzingImage ? 'Analyzing...' : (visualMatchIds ? 'Clear Image Match' : 'Search by Image')}</span>
                    {visualMatchIds ? (
                      <button 
                        type="button"
                        className="hidden" 
                        onClick={() => setVisualMatchIds(null)}
                      />
                    ) : (
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageSearch} 
                        disabled={isAnalyzingImage}
                      />
                    )}
                  </label>`;

// It's safer to just wrap it in a div if it's visualMatchIds, or we can just use a generic button structure.
const improvedLabelOuter = `                  {visualMatchIds && !isAnalyzingImage ? (
                    <button 
                      onClick={() => setVisualMatchIds(null)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer border bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">Clear Image Match</span>
                    </button>
                  ) : (
                    <label 
                      className={\`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer border \${
                        isAnalyzingImage 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                      }\`}
                    >
                      {isAnalyzingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{isAnalyzingImage ? 'Analyzing...' : 'Search by Image'}</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageSearch} 
                        disabled={isAnalyzingImage}
                      />
                    </label>
                  )}`;

// Let's replace the entire label tag
code = code.replace(
  /<label[\s\S]*?<\/label>/,
  improvedLabelOuter
);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated PurchaseTab.tsx for direct visual matching");
