import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Save, Package, CheckSquare, Image as ImageIcon, Plus, Trash2, Edit2, FileText, Check } from 'lucide-react';
import { Order, OrderProduct, saveOrder } from '../lib/orders';
import { Product, subscribeToProducts } from '../lib/products';
import { getProductFile } from '../lib/fileStorage';
import { Badge } from './Badge';
import { getOrderFiles } from '../lib/fileStorage';

interface DispatchViewProps {
  order: Order;
  onBack: () => void;
}

export function DispatchView({ order, onBack }: DispatchViewProps) {
  const [products, setProducts] = useState<OrderProduct[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [quotationFile, setQuotationFile] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  
  // Temporary edit state
  const [editName, setEditName] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editQty, setEditQty] = useState(1);
  const [editImage, setEditImage] = useState<string | null>(null);
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
  }, [inventory, products]);

  useEffect(() => {
    if (quotationFile && quotationFile.startsWith('data:application/pdf')) {
      fetch(quotationFile)
        .then(res => res.blob())
        .then(blob => setPdfBlobUrl(URL.createObjectURL(blob)))
        .catch(e => console.error(e));
    }
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [quotationFile]);

  useEffect(() => {
    if (order) {
      if (order.details?.products && order.details.products.length > 0) {
        setProducts(order.details.products);
      } else {
        const itemCount = order.items || 1;
        const mockProducts: OrderProduct[] = Array.from({ length: itemCount }).map((_, i) => ({
          id: `prod-${i}-${Date.now()}`,
          name: '',
          quantity: 1,
          size: '',
          isDispatched: false
        }));
        setProducts(mockProducts);
      }

      getOrderFiles(order.id).then(files => {
        if (files?.quotationFileData) {
          setQuotationFile(files.quotationFileData);
        }
      });
    }
  }, [order]);

  const toggleDispatch = (id: string) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, isDispatched: !p.isDispatched } : p)
    );
  };

  const startEdit = (product: OrderProduct) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditSize(product.size || '');
    setEditQty(product.quantity);
    setEditImage(product.image || null);
  };

  const saveEdit = (id: string) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, name: editName, size: editSize, quantity: editQty, image: editImage || undefined } : p)
    );
    setEditingId(null);
  };

  const addProduct = () => {
    const newProduct: OrderProduct = {
      id: `prod-new-${Date.now()}`,
      name: 'New Product',
      quantity: 1,
      size: '',
      isDispatched: false
    };
    setProducts([...products, newProduct]);
    startEdit(newProduct);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    if (!order || !order.docId) return;
    setIsSaving(true);
    try {
      const updatedOrder = {
        ...order,
        items: products.length, // update item count
        details: {
          ...order.details,
          products: products
        }
      };
      
      const allDispatched = products.length > 0 && products.every(p => p.isDispatched);
      if (allDispatched && order.status !== 'Delivered') {
         updatedOrder.status = 'Out for Delivery';
      }
      
      await saveOrder(updatedOrder);
      onBack();
    } catch (error) {
      console.error('Failed to schedule dispatch:', error);
      alert('Failed to save dispatch schedule.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
        <div>
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
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${product.isDispatched ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {product.isDispatched && <CheckSquare className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 relative group">
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
                  
                  <div className="flex-1">
                    {editingId === product.id ? (
                      <div className="space-y-2 w-full max-w-sm">
                        <div className="relative">
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
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={editSize}
                            onChange={e => setEditSize(e.target.value)}
                            className="w-2/3 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Description"
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
                        <h4 className="text-base font-bold text-slate-800">
                          {product.name || <span className="text-slate-400 italic">Click to select product...</span>}
                        </h4>
                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                          {product.size && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium border border-slate-200">
                              Desc: {product.size}
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
                  
                  
                  <div className="flex flex-col h-full w-full">
                    
                    {pdfBlobUrl && (
                      <div className="flex justify-end mb-3 shrink-0">
                        <a 
                          href={pdfBlobUrl} 
                          download={`Quotation-${order?.id || 'Document'}.pdf`}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Download PDF
                        </a>
                      </div>
                    )}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-y-auto relative flex justify-center p-4">
                      {pdfBlobUrl ? (
                        <Document file={pdfBlobUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="text-slate-500 py-10">Rendering PDF...</div>}>
                          {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} className="mb-4 shadow-md border border-slate-200 bg-white">
                              <Page pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} width={800} />
                            </div>
                          ))}
                        </Document>
                      ) : (
                        <div className="flex justify-center items-center h-full text-slate-500">Loading PDF...</div>
                      )}
                    </div>
                  </div>
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
}
