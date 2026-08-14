import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Product } from '../lib/products';
import { Vendor } from '../lib/vendors';
import { saveQuoteRequest } from '../lib/quotes';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  vendors: Vendor[];
}

export function RequestQuoteModal({ isOpen, onClose, products, vendors }: RequestQuoteModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [specification, setSpecification] = useState('');
  const [quantity, setQuantity] = useState('');
  const [specialRemarks, setSpecialRemarks] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [quoteDeadline, setQuoteDeadline] = useState('');
  
  // Available categories from vendors
  const categories = Array.from(new Set(vendors.map(v => v.category).filter(Boolean))) as string[];
  
  // Filtered vendors for step 2
  const filteredVendors = vendors.filter(v => v.category === category);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [createdQuotes, setCreatedQuotes] = useState<any[]>([]);

  useEffect(() => {
    if (selectedProductId) {
      const p = products.find(p => p.id === selectedProductId || p.docId === selectedProductId);
      if (p) {
        setProductName(p.name);
        setSpecification(p.specification || '');
      }
    } else {
      setProductName('');
      setSpecification('');
    }
  }, [selectedProductId, products]);

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCreateQuotes = async () => {
    if (selectedVendorIds.length === 0) return;
    setIsProcessing(true);
    
    try {
      const quotes = [];
      for (const vendorId of selectedVendorIds) {
        const quoteId = await saveQuoteRequest({
          category,
          productId: selectedProductId,
          productName,
          specification,
          quantity,
          specialRemarks,
          expectedDeliveryDate,
          quoteDeadline,
          vendorId
        });
        quotes.push({ quoteId, vendorId });
      }
      setCreatedQuotes(quotes);
      setStep(3);
    } catch (e) {
      console.error(e);
      alert('Failed to create quote requests');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setStep(1);
    setCategory('');
    setSelectedProductId('');
    setProductName('');
    setSpecification('');
    setQuantity('');
    setSpecialRemarks('');
    setExpectedDeliveryDate('');
    setQuoteDeadline('');
    setSelectedVendorIds([]);
    setCreatedQuotes([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getWhatsAppLink = (vendorId: string, quoteId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?quoteId=${quoteId}`;
    const text = `Hi ${vendor?.contactPerson || vendor?.name},\n\nPlease review our requirement for ${productName} and provide a quote using this link:\n${link}`;
    return `https://wa.me/${vendor?.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">Request Quote</h3>
              <button 
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {step === 1 && (
                <form id="quote-form" onSubmit={handleSubmitDetails} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Vendor Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Select Product (Optional)</label>
                    <select 
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="">-- Manual Entry --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                        disabled={!!selectedProductId}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm disabled:bg-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Quantity Required</label>
                      <input 
                        type="text" 
                        required
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Specification</label>
                    <input 
                      type="text"
                      value={specification}
                      onChange={e => setSpecification(e.target.value)}
                      disabled={!!selectedProductId}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm disabled:bg-slate-100"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Expected Delivery (Optional)</label>
                      <input 
                        type="date"
                        value={expectedDeliveryDate}
                        onChange={e => setExpectedDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Quote Deadline (Optional)</label>
                      <input 
                        type="date"
                        value={quoteDeadline}
                        onChange={e => setQuoteDeadline(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Special Remarks</label>
                    <textarea 
                      value={specialRemarks}
                      onChange={e => setSpecialRemarks(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800">Select Vendors in "{category}"</h4>
                  {filteredVendors.length === 0 ? (
                    <p className="text-sm text-slate-500">No vendors found in this category.</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredVendors.map(v => (
                        <label key={v.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input 
                            type="checkbox"
                            checked={selectedVendorIds.includes(v.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedVendorIds([...selectedVendorIds, v.id]);
                              else setSelectedVendorIds(selectedVendorIds.filter(id => id !== v.id));
                            }}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{v.name}</p>
                            <p className="text-xs text-slate-500">{v.contactPerson} • {v.phone || 'No phone'}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Quotes Generated!</h3>
                  <p className="text-sm text-slate-500">You can now send the fillable quote link to the vendors via WhatsApp.</p>
                  
                  <div className="space-y-3 mt-6 text-left">
                    {createdQuotes.map(({ quoteId, vendorId }) => {
                      const v = vendors.find(vend => vend.id === vendorId);
                      return (
                        <div key={quoteId} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                          <div>
                            <p className="font-semibold text-slate-800">{v?.name}</p>
                            <p className="text-xs text-slate-500">Quote ID: {quoteId}</p>
                          </div>
                          <a 
                            href={getWhatsAppLink(vendorId, quoteId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-sm font-semibold hover:bg-[#128C7E] transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Send Link
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              {step === 1 && (
                <>
                  <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700">Cancel</button>
                  <button type="submit" form="quote-form" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Next step</button>
                </>
              )}
              {step === 2 && (
                <>
                  <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700">Back</button>
                  <button 
                    type="button" 
                    onClick={handleCreateQuotes}
                    disabled={selectedVendorIds.length === 0 || isProcessing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    {isProcessing ? 'Creating...' : 'Generate Quote Links'}
                  </button>
                </>
              )}
              {step === 3 && (
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">Done</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
