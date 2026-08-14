import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Upload, Image as ImageIcon } from 'lucide-react';
import React, { useState, useRef } from 'react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct?: (product: any) => void;
  vendors: any[];
}

export function NewProductModal({ isOpen, onClose, onAddProduct, vendors }: NewProductModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    specification: '',
    price: '',
    totalUnitPrice: '',
    perUnitPrice: '',
    measuringMetric: 'kg',
    vendorId: '',
    details: ''
  });

  const [productImage, setProductImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const readFileAsDataURL = (file: File | null): Promise<string | undefined> => {
    if (!file) return Promise.resolve(undefined);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const productImageData = await readFileAsDataURL(productImage);
      
      const selectedVendor = vendors.find(v => v.id === formData.vendorId);
      
      if (onAddProduct) {
        await onAddProduct({
          ...formData,
          vendorName: selectedVendor?.name || '',
          productImageName: productImage?.name,
          productImageData
        });
      }
    } catch (error) {
      console.error("Error reading file", error);
    } finally {
      setIsProcessing(false);
      
      // Reset form
      setFormData({
        productName: '',
        specification: '',
        price: '',
        totalUnitPrice: '',
        perUnitPrice: '',
        measuringMetric: 'kg',
        vendorId: '',
        details: ''
      });
      setProductImage(null);
      
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Add Product</h3>
                  <p className="text-xs font-medium text-slate-500">Add a new product to purchase</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="new-purchase-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Product Name</label>
                    <input 
                      type="text" 
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      placeholder="e.g. Raw Steel Sheets"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Specification</label>
                    <input 
                      type="text" 
                      name="specification"
                      value={formData.specification}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      placeholder="e.g. 5mm thickness, industrial grade"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Measuring Metric</label>
                    <select 
                      name="measuringMetric"
                      value={formData.measuringMetric}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                      required
                    >
                      <option value="kg">kg</option>
                      <option value="sqft">sqft</option>
                      <option value="meters">meters</option>
                      <option value="liters">liters</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Unit Price</label>
                    <input 
                      type="text" 
                      name="totalUnitPrice"
                      value={formData.totalUnitPrice}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      placeholder="e.g. $1000"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Per Unit Price</label>
                    <input 
                      type="text" 
                      name="perUnitPrice"
                      value={formData.perUnitPrice}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      placeholder="e.g. $10/kg"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Vendor</label>
                    <select 
                      name="vendorId"
                      value={formData.vendorId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                      required
                    >
                      <option value="" disabled>Select a vendor</option>
                      {vendors.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Details</label>
                    <textarea 
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none custom-scrollbar"
                      placeholder="Additional details about the product or purchase..."
                    />
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Product Image</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                      <input 
                        type="file" 
                        ref={imageInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setProductImage(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="w-12 h-12 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="w-6 h-6 text-emerald-500" />
                      </div>
                      {productImage ? (
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-800 break-all">{productImage.name}</p>
                          <p className="text-xs text-emerald-600 font-medium mt-1">Image selected successfully</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-700">Click to upload product image</p>
                          <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="new-purchase-form"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Add Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
