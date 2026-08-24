const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchModal.tsx', 'utf8');

const oldLabel = `<label key={product.id} className="flex items-center p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div className="flex-shrink-0 mr-4">
                        <div className={\`w-6 h-6 rounded border flex items-center justify-center transition-colors \${product.isDispatched ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}\`}>
                          {product.isDispatched && <CheckSquare className="w-4 h-4" />}
                        </div>
                      </div>`;

const newLabel = `<label key={product.id} className="flex items-center p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={product.isDispatched}
                        onChange={() => toggleDispatch(product.id)}
                      />
                      <div className="flex-shrink-0 mr-4">
                        <div className={\`w-6 h-6 rounded border flex items-center justify-center transition-colors \${product.isDispatched ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}\`}>
                          {product.isDispatched && <CheckSquare className="w-4 h-4" />}
                        </div>
                      </div>`;

content = content.replace(oldLabel, newLabel);
fs.writeFileSync('src/components/DispatchModal.tsx', content);
