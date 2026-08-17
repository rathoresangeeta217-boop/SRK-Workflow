const fs = require('fs');
let code = fs.readFileSync('src/tabs/PurchaseTab.tsx', 'utf8');

// 1. Add Icons
if (!code.includes("import { Camera }")) {
  code = code.replace(
    "import { ShoppingBag, ShoppingCart",
    "import { ShoppingBag, ShoppingCart, Camera, Loader2, Image as ImageIcon"
  );
}

// 2. Add state variables
code = code.replace(
  "const [productSearchQuery, setProductSearchQuery] = useState('');",
  "const [productSearchQuery, setProductSearchQuery] = useState('');\n  const [quoteSearchQuery, setQuoteSearchQuery] = useState('');\n  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);"
);

// 3. Add handleImageSearch
const handleImageSearchCode = `
  const handleImageSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setIsAnalyzingImage(true);
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      
      const base64Data = await base64Promise;
      
      const response = await fetch('/api/identify-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Data })
      });
      
      if (!response.ok) throw new Error('Failed to analyze image');
      
      const data = await response.json();
      if (data.searchQuery) {
        setQuoteSearchQuery(data.searchQuery);
        setActiveTab('quotes');
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      alert("Could not identify the product in the image. Please try another image or use text search.");
    } finally {
      setIsAnalyzingImage(false);
      // Reset input
      e.target.value = '';
    }
  };
`;

code = code.replace(
  "const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);",
  "const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);\n" + handleImageSearchCode
);

fs.writeFileSync('src/tabs/PurchaseTab.tsx', code);
console.log("Updated PurchaseTab.tsx state");
