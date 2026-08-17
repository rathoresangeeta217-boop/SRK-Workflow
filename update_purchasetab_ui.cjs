const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

const oldSearchBlock = `          <div className="flex gap-2">
            {activeTab === 'products' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-48"
                />
              </div>
            )}`;

const newSearchBlock = `          <div className="flex gap-2">
            {activeTab === 'products' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-48"
                />
              </div>
            )}
            {activeTab === 'quotes' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={quoteSearchQuery}
                    onChange={(e) => setQuoteSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-48 lg:w-64"
                  />
                  {quoteSearchQuery && (
                    <button 
                      onClick={() => setQuoteSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="relative">
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
                </div>
              </div>
            )}`;

code = code.replace(oldSearchBlock, newSearchBlock);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated PurchaseTab.tsx UI for searching quotes");
