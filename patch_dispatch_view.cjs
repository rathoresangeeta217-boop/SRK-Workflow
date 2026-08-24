const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

const importRegex = /import \{ Order, OrderProduct, saveOrder \} from '\.\.\/lib\/orders';/;
const newImport = `import { Order, OrderProduct, saveOrder } from '../lib/orders';
import { Product, subscribeToProducts } from '../lib/products';
import { getProductFile } from '../lib/fileStorage';`;
content = content.replace(importRegex, newImport);

const stateRegex = /const \[editQty, setEditQty\] = useState\(1\);/;
const newState = `const [editQty, setEditQty] = useState(1);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [matchedImages, setMatchedImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = subscribeToProducts((prods) => {
      setInventory(prods);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      if (inventory.length === 0 || products.length === 0) return;
      const newImages = { ...matchedImages };
      let changed = false;
      
      for (const p of products) {
        if (!p.image && !newImages[p.id]) {
          // Try to match
          const match = inventory.find(inv => inv.name.toLowerCase() === p.name.toLowerCase() || (inv.name.toLowerCase().includes(p.name.toLowerCase()) && p.name.length > 3));
          if (match) {
            if (match.details?.productImageData) {
              newImages[p.id] = match.details.productImageData;
              changed = true;
            } else if (match.docId) {
              const fileData = await getProductFile(match.docId);
              if (fileData) {
                newImages[p.id] = fileData;
                changed = true;
              }
            }
          }
        }
      }
      
      if (changed) {
        setMatchedImages(newImages);
      }
    };
    
    loadImages();
  }, [inventory, products]);`;
content = content.replace(stateRegex, newState);

const imgRenderRegex = /\{product\.image \? \(\n\s*<img src=\{product\.image\}/g;
const newImgRender = `{product.image || matchedImages[product.id] ? (
                    <img src={product.image || matchedImages[product.id]}`;
content = content.replace(imgRenderRegex, newImgRender);

const editRenderRegex = /<input \n\s*type="text" \n\s*value=\{editName\}\n\s*onChange=\{e => setEditName\(e\.target\.value\)\}\n\s*className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500 outline-none"\n\s*placeholder="Product Name"\n\s*autoFocus\n\s*\/>/;

const newEditRender = `<div className="relative">
                          <input 
                            type="text" 
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Search product from inventory..."
                            autoFocus
                            list="inventory-products"
                          />
                          <datalist id="inventory-products">
                            {inventory.map(inv => (
                              <option key={inv.id} value={inv.name} />
                            ))}
                          </datalist>
                        </div>`;
content = content.replace(editRenderRegex, newEditRender);

fs.writeFileSync('src/components/DispatchView.tsx', content);
console.log("Patched dispatch view for dynamic images and datalist");
