const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

const returnRegex = /return \([\s\S]*\}\);\s*\}/;

const newReturn = `return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            Dispatch Order
            <Badge variant="info">{order.id}</Badge>
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Customer: {order.customer}</p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-end">
          {quotationFile && (
            <button 
              onClick={() => setShowQuotation(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
            >
              <FileText className="w-4 h-4" />
              View Quotation
            </button>
          )}
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Order Items</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setProducts(prev => prev.map(p => ({ ...p, isDispatched: true })))}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Select All
              </button>
              <button 
                onClick={addProduct}
                className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {products.map(product => (
              <div key={product.id} className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 hover:bg-slate-50 transition-colors gap-4 group">
                <div 
                  className="flex-shrink-0 pt-1 sm:pt-0 cursor-pointer"
                  onClick={() => { if (editingId !== product.id) toggleDispatch(product.id); }}
                >
                  <div className={\`w-6 h-6 rounded border flex items-center justify-center transition-colors \${product.isDispatched ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}\`}>
                    {product.isDispatched && <CheckSquare className="w-4 h-4" />}
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  {editingId === product.id ? (
                    <div className="space-y-2 w-full max-w-sm">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Product Name"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={editSize}
                          onChange={e => setEditSize(e.target.value)}
                          className="w-2/3 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Size/Spec"
                        />
                        <input 
                          type="number" 
                          min="1"
                          value={editQty}
                          onChange={e => setEditQty(parseInt(e.target.value) || 1)}
                          className="w-1/3 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Qty"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="cursor-pointer" onClick={() => startEdit(product)}>
                      <h4 className="text-base font-bold text-slate-800">{product.name}</h4>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        {product.size && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium border border-slate-200">
                            Size: {product.size}
                          </span>
                        )}
                        <span className="font-semibold">Qty: {product.quantity}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {editingId === product.id ? (
                    <button onClick={() => saveEdit(product.id)} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => startEdit(product)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="ml-2">
                    <Badge variant={product.isDispatched ? 'success' : 'warning'}>
                      {product.isDispatched ? 'Ready' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No products found for this order.</p>
                <button onClick={addProduct} className="mt-4 text-indigo-600 font-medium hover:underline">
                  Add a product manually
                </button>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button 
              onClick={onBack}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Scheduled Dispatched'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showQuotation && quotationFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowQuotation(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Quotation Document</h3>
                </div>
                <button 
                  onClick={() => setShowQuotation(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-50 relative"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto bg-slate-100 p-4">
                {quotationFile.startsWith('data:image') ? (
                  <img src={quotationFile} alt="Quotation" className="max-w-full h-auto mx-auto rounded-lg shadow-sm border border-slate-200" />
                ) : quotationFile.startsWith('data:application/pdf') ? (
                  <iframe src={\`\${quotationFile}#toolbar=0\`} className="w-full h-full rounded-lg shadow-sm border border-slate-200" title="Quotation PDF" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <FileText className="w-12 h-12 mb-2 text-slate-300" />
                    <p>Document format not supported for preview</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`;

content = content.replace(returnRegex, newReturn);
fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched completely!");
