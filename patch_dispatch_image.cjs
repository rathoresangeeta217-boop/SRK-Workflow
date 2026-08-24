const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

// 1. Add editImage state
content = content.replace(
  /const \[editQty, setEditQty\] = useState\(1\);/,
  `const [editQty, setEditQty] = useState(1);\n  const [editImage, setEditImage] = useState<string | null>(null);`
);

// 2. Update startEdit
content = content.replace(
  /setEditQty\(product\.quantity\);/,
  `setEditQty(product.quantity);\n    setEditImage(product.image || null);`
);

// 3. Update saveEdit
content = content.replace(
  /name: editName, size: editSize, quantity: editQty/,
  `name: editName, size: editSize, quantity: editQty, image: editImage || undefined`
);

// 4. Update the image rendering block
const oldImgRender = /<div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">[\s\S]*?<\/div>\s*<div className="flex-1">/;
const newImgRender = `<div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 relative group">
                    {editingId === product.id ? (
                      <label className="cursor-pointer w-full h-full relative block">
                        {editImage || matchedImages[product.id] ? (
                          <>
                            <img src={editImage || matchedImages[product.id]} alt="Product" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Plus className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center hover:bg-slate-200 transition-colors">
                            <Plus className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-500 font-medium">Add Img</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setEditImage(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} 
                        />
                      </label>
                    ) : (
                      product.image || matchedImages[product.id] ? (
                        <img src={product.image || matchedImages[product.id]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )
                    )}
                  </div>
                  
                  <div className="flex-1">`;
content = content.replace(oldImgRender, newImgRender);

// 5. Change "Size/Spec" to "Description"
content = content.replace(/placeholder="Size\/Spec"/, 'placeholder="Description"');
content = content.replace(/Size: \{product\.size\}/, 'Desc: {product.size}');

fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched dispatch image upload");
