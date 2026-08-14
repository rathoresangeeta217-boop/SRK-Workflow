import { motion } from 'motion/react';
import { ShoppingBag, ShoppingCart, Users, AlertCircle, Plus, Truck, Filter, MoreHorizontal, FileText, Building2, Trash2, Search, MessageCircle, X } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { NewProductModal } from '../components/NewProductModal';
import { NewVendorModal } from '../components/NewVendorModal';
import { CreatePOModal } from '../components/CreatePOModal';
import { CartModal } from '../components/CartModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { RequestQuoteModal } from '../components/RequestQuoteModal';
import { useState, useEffect } from 'react';
import { saveProductFile, getProductFile } from '../lib/fileStorage';
import { subscribeToPurchases, savePurchase, deletePurchase, Purchase } from '../lib/purchases';
import { subscribeToProducts, saveProduct, deleteProduct, Product } from '../lib/products';
import { subscribeToVendors, saveVendor, deleteVendor, Vendor } from '../lib/vendors';
import { subscribeToQuotes, QuoteRequest } from '../lib/quotes';

const ProductImage = ({ productId, productName, className }: { productId?: string, productName: string, className?: string }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      getProductFile(productId).then((data) => {
        if (data) setImageSrc(data);
      }).catch(console.error);
    }
  }, [productId]);

  if (!imageSrc) return (
    <div className={className || "w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200"}>
      <ShoppingBag className="w-4 h-4 text-slate-300" />
    </div>
  );
  return <img src={imageSrc} alt={productName} className={className || "w-8 h-8 rounded-md object-cover border border-slate-200"} />;
};

export function PurchaseTab() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'vendors' | 'quotes'>('orders');
  
  const [isNewVendorModalOpen, setIsNewVendorModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isRequestQuoteModalOpen, setIsRequestQuoteModalOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const pId = product.id || product.docId;
      const existing = prev.find(item => (item.product.id || item.product.docId) === pId);
      if (existing) {
        return prev.map(item => (item.product.id || item.product.docId) === pId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => (item.product.id || item.product.docId) !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => (item.product.id || item.product.docId) === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);


  useEffect(() => {
    const unsubPurchases = subscribeToPurchases(setPurchases);
    const unsubProducts = subscribeToProducts(setProducts);
    const unsubVendors = subscribeToVendors(setVendors);
    const unsubQuotes = subscribeToQuotes(setQuotes);
    
    return () => {
      unsubPurchases();
      unsubProducts();
      unsubVendors();
      unsubQuotes();
    };
  }, []);

  const handleAddVendor = async (vendorData: any) => {
    try {
      await saveVendor(vendorData);
      setIsNewVendorModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save vendor', error);
      alert('Failed to save vendor: ' + error.message);
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const newProduct: Partial<Product> = {
        name: productData.productName,
        vendorId: productData.vendorId,
        vendorName: productData.vendorName,
        price: productData.totalUnitPrice || productData.price,
        specification: productData.specification,
        details: {
          productImageName: productData.productImageName,
          details: productData.details,
          measuringMetric: productData.measuringMetric,
          totalUnitPrice: productData.totalUnitPrice,
          perUnitPrice: productData.perUnitPrice,
        }
      };

      const docId = await saveProduct(newProduct);
      
      if (productData.productImageData) {
        await saveProductFile(docId, productData.productImageData);
      }
      
      setIsNewProductModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save product', error);
      alert('Failed to save product: ' + error.message);
    }
  };

  const handleDeletePurchase = async (docId: string) => {
    try {
      await deletePurchase(docId);
      setConfirmingDeleteId(null);
    } catch (error: any) {
      console.error('Error deleting purchase order:', error);
      alert(`Failed to delete purchase order: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (docId: string) => {
    try {
      await deleteProduct(docId);
      setConfirmingDeleteId(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  const handleDeleteVendor = async (docId: string) => {
    try {
      await deleteVendor(docId);
      setConfirmingDeleteId(null);
    } catch (error: any) {
      console.error('Error deleting vendor:', error);
      alert(`Failed to delete vendor: ${error.message}`);
    }
  };

  const handleCreatePO = async (poData: any) => {
    try {
      const newPurchase: Partial<Purchase> = {
        productName: poData.productName,
        vendorName: poData.vendorName,
        price: poData.price,
        status: 'Pending',
        details: {
          poNumber: poData.poNumber,
          productId: poData.productId,
          quantity: poData.quantity,
          eta: poData.eta,
        }
      };

      await savePurchase(newPurchase);
      setIsCreatePOModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save purchase', error);
      alert('Failed to save purchase: ' + error.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
    (p.vendorName || '').toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    (p.specification || '').toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Purchase Management</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage vendor relations, purchase orders, and inbound materials.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsNewVendorModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Building2 className="w-4 h-4" />
            Add Vendor
          </button>
          <button 
            onClick={() => setIsNewProductModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Add Product
          </button>
          <button 
            onClick={() => setIsRequestQuoteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Request Quote
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreatePOModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Create PO
            </button>
          </div>
        </div>
      </div>

      <NewVendorModal 
        isOpen={isNewVendorModalOpen}
        onClose={() => setIsNewVendorModalOpen(false)}
        onAddVendor={handleAddVendor}
        vendors={vendors}
      />

      <NewProductModal 
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        vendors={vendors}
      />

      <CreatePOModal 
        isOpen={isCreatePOModalOpen}
        onClose={() => setIsCreatePOModalOpen(false)}
        onCreatePO={handleCreatePO}
        products={products}
        vendors={vendors}
      />

      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        vendors={vendors}
        onCreatePO={handleCreatePO}
        clearCart={clearCart}
      />

      <RequestQuoteModal
        isOpen={isRequestQuoteModalOpen}
        onClose={() => setIsRequestQuoteModalOpen(false)}
        products={products}
        vendors={vendors}
      />

      <ProductDetailModal
        isOpen={!!selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        product={selectedProductDetails}
        vendor={selectedProductDetails ? (vendors.find(v => v.id === selectedProductDetails.vendorId) || null) : null}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Spend (MTD)" 
          value="$1.2M" 
          trend={{ value: 4.5, isPositive: false }}
          icon={<ShoppingBag className="w-5 h-5" />}
          colorClass="bg-purple-50 text-purple-600"
        />
        <StatCard 
          title="Active Vendors" 
          value="156" 
          icon={<Users className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Pending Deliveries" 
          value="28" 
          trend={{ value: 12.0, isPositive: true }}
          icon={<Truck className="w-5 h-5" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Delayed Items" 
          value="3" 
          icon={<AlertCircle className="w-5 h-5" />}
          colorClass="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Purchase Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vendors' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Vendors
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'quotes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Quotes
        </button>
      </div>

      {/* Main Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col"
      >
        <div className="bg-white rounded-t-xl border border-slate-200 flex items-center justify-between px-6 py-4">
          <h2 className="font-bold text-slate-800">
            {activeTab === 'orders' && 'Active Purchase Orders'}
            {activeTab === 'products' && 'Product Directory'}
            {activeTab === 'vendors' && 'Vendor Directory'}
            {activeTab === 'quotes' && 'Requested Quotes'}
          </h2>
          <div className="flex gap-2">
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
            )}
            
            {activeTab === 'products' && cart.length > 0 && (
              <button 
                onClick={() => setIsCartModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1 bg-rose-500 text-white rounded text-xs font-semibold hover:bg-rose-600 transition-colors shadow-sm relative"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Cart
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </button>
            )}

            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5 mr-1.5 inline" /> Filters
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white border-x border-b border-slate-200 overflow-hidden rounded-b-xl">
          <div className="overflow-x-auto">
            {activeTab === 'orders' && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-200">PO Number</th>
                    <th className="px-6 py-3 border-b border-slate-200">Vendor</th>
                    <th className="px-6 py-3 border-b border-slate-200">Primary Item</th>
                    <th className="px-6 py-3 border-b border-slate-200">Amount</th>
                    <th className="px-6 py-3 border-b border-slate-200">Status</th>
                    <th className="px-6 py-3 border-b border-slate-200">ETA</th>
                    <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                        No active purchase orders found. Click "Create PO" to create one.
                      </td>
                    </tr>
                  ) : purchases.map((po, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      key={po.id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">{po.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{po.vendorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <ProductImage productId={po.details?.productId} productName={po.productName} />
                        {po.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{po.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        po.status === 'Delivered' ? 'success' : 
                        po.status === 'In Transit' ? 'info' : 
                        po.status === 'Delayed' ? 'error' : 
                        po.status === 'Pending' ? 'warning' : 'info'
                      }>
                        {po.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {po.createdAt ? new Date(po.createdAt.seconds * 1000).toLocaleDateString() : 'Pending'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {confirmingDeleteId === po.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Sure?</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmingDeleteId(null);
                              }}
                              className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold"
                            >
                              No
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePurchase(po.id);
                              }}
                              className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-xs font-semibold"
                            >
                              Yes
                            </button>
                          </div>
                        ) : (
                          <>
                            <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmingDeleteId(po.id);
                              }}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                </tbody>
              </table>
            )}

            {activeTab === 'products' && (
              <div className="p-6">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    {products.length === 0 ? 'No products found. Click "Add Product" to create one.' : 'No products match your search.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, i) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        key={product.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                        onClick={() => setSelectedProductDetails(product)}
                      >
                        <div className="aspect-square bg-slate-50 flex items-center justify-center relative group w-full h-full overflow-hidden">
                          <ProductImage productId={product.id} productName={product.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setConfirmingDeleteId(product.id!);
                               }}
                               className="p-1.5 bg-white text-rose-500 hover:bg-rose-50 rounded-md shadow-sm border border-slate-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {confirmingDeleteId === product.id && (
                             <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2">
                               <span className="text-sm font-medium text-slate-700">Delete product?</span>
                               <div className="flex gap-2">
                                 <button onClick={() => setConfirmingDeleteId(null)} className="px-3 py-1 bg-slate-100 rounded text-xs font-medium">No</button>
                                 <button onClick={() => handleDeleteProduct(product.id!)} className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-medium">Yes</button>
                               </div>
                             </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="text-xs font-medium text-indigo-600 mb-1">{product.vendorName}</div>
                          <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{product.name}</h3>
                          <div className="text-xs text-slate-500 mb-3">{product.specification || 'No specification'} • {product.details?.measuringMetric || '-'}</div>
                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                            <div>
                              <div className="text-xs text-slate-500 font-medium mb-0.5">Unit Price</div>
                              <div className="font-bold text-lg text-emerald-600 leading-none">
                                {product.details?.perUnitPrice ? `Rs. ${product.details.perUnitPrice}` : '-'}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                addToCart(product);
                              }}
                              className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vendors' && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-200">Vendor Name</th>
                    <th className="px-6 py-3 border-b border-slate-200">Contact Person</th>
                    <th className="px-6 py-3 border-b border-slate-200">Email</th>
                    <th className="px-6 py-3 border-b border-slate-200">Phone</th>
                    <th className="px-6 py-3 border-b border-slate-200">Address</th>
                    <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                        No vendors found. Click "Add Vendor" to create one.
                      </td>
                    </tr>
                  ) : vendors.map((vendor, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      key={vendor.id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{vendor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{vendor.contactPerson || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{vendor.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{vendor.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium min-w-[200px]">{vendor.address || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {confirmingDeleteId === vendor.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 font-medium">Sure?</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmingDeleteId(null);
                                }}
                                className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold"
                              >
                                No
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteVendor(vendor.id!);
                                }}
                                className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-xs font-semibold"
                              >
                                Yes
                              </button>
                            </div>
                          ) : (
                            <>
                              <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmingDeleteId(vendor.id!);
                                }}
                                className="text-slate-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {activeTab === 'quotes' && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-200">Product</th>
                    <th className="px-6 py-3 border-b border-slate-200">Vendor</th>
                    <th className="px-6 py-3 border-b border-slate-200">Quantity</th>
                    <th className="px-6 py-3 border-b border-slate-200">Deadline</th>
                    <th className="px-6 py-3 border-b border-slate-200">Req. Delivery</th>
                    <th className="px-6 py-3 border-b border-slate-200">Status</th>
                    <th className="px-6 py-3 border-b border-slate-200">Price (Rs.)</th>
                    <th className="px-6 py-3 border-b border-slate-200">Remarks</th>
                    <th className="px-6 py-3 border-b border-slate-200">Ref Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-sm text-slate-500">
                        No quotes found. Click "Request Quote" to create one.
                      </td>
                    </tr>
                  ) : quotes.map((quote, i) => {
                    const vendor = vendors.find(v => v.id === quote.vendorId);
                    return (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        key={quote.id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{quote.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{vendor?.name || 'Unknown Vendor'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{quote.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{quote.quoteDeadline ? new Date(quote.quoteDeadline).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{quote.expectedDeliveryDate ? new Date(quote.expectedDeliveryDate).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={quote.status === 'submitted' ? 'success' : 'warning'}>
                            {quote.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{quote.vendorPrice ? `Rs. ${quote.vendorPrice}` : '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium max-w-[200px] truncate">{quote.vendorRemarks || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                          {quote.vendorImageUrl ? (
                            <button onClick={() => setViewingImageUrl(quote.vendorImageUrl!)} className="text-indigo-600 hover:underline">View Image</button>
                          ) : '-'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>

      {/* Image View Modal */}
      {viewingImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingImageUrl(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end p-2 absolute top-0 right-0 z-10">
              <button 
                onClick={() => setViewingImageUrl(null)}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center min-h-[50vh]">
              <img src={viewingImageUrl} alt="Product Reference" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
