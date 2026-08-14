import React, { useState, useEffect } from 'react';
import { updateQuoteStatus } from '../lib/quotes';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Package, Send, Building2, CheckCircle2, Upload, X } from 'lucide-react';

export function VendorQuoteForm({ quoteId }: { quoteId: string }) {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vendorPrice, setVendorPrice] = useState('');
  const [vendorRemarks, setVendorRemarks] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const docRef = doc(db, 'quotes', quoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuote({ id: docSnap.id, ...docSnap.data() });
          if (docSnap.data().status === 'submitted') {
            setSubmitted(true);
          }
        }
      } catch (e) {
        console.error("Error fetching quote:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [quoteId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let vendorImageUrl = '';
      if (imageFile) {
        vendorImageUrl = await resizeImage(imageFile);
      }

      await updateQuoteStatus(quoteId, {
        vendorPrice,
        vendorRemarks,
        ...(vendorImageUrl ? { vendorImageUrl } : {}),
        status: 'submitted'
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Quote Request Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 text-center">The link might be invalid or expired.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quote Submitted!</h2>
          <p className="text-sm text-slate-500 mb-6">Thank you for submitting your quote to <strong>SRK Modular</strong>. The purchasing team will review it shortly.</p>
          <div className="bg-slate-50 p-4 rounded-lg text-left text-sm text-slate-700">
            <p className="mb-2"><span className="font-semibold">Product:</span> {quote.productName}</p>
            <p className="mb-2"><span className="font-semibold">Your Price:</span> Rs. {quote.vendorPrice || vendorPrice}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-6 py-8 text-center text-white border-b-4 border-amber-500">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="h-16 bg-white rounded-xl flex items-center justify-center shadow-lg mb-3 p-2">
                <img src="/srk-logo.png" alt="SRK Modular Logo" className="h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">SRK MODULAR</h1>
              <p className="text-slate-300 text-xs tracking-widest uppercase mt-1">FURNITURE.CO</p>
            </div>
            <div className="w-16 h-0.5 bg-slate-700 mx-auto my-4"></div>
            <h2 className="text-lg font-semibold text-white">Vendor Quote Request</h2>
            <p className="text-slate-400 mt-1 text-sm">Please provide your best price for the following requirement.</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-8">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Requirement Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <span className="text-slate-500 w-24 shrink-0 font-medium">Product</span>
                  <span className="text-slate-800 font-semibold">{quote.productName}</span>
                </div>
                {quote.specification && (
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 shrink-0 font-medium">Specification</span>
                    <span className="text-slate-800">{quote.specification}</span>
                  </div>
                )}
                <div className="flex gap-4">
                  <span className="text-slate-500 w-24 shrink-0 font-medium">Quantity</span>
                  <span className="text-slate-800 font-semibold">{quote.quantity}</span>
                </div>
                {quote.specialRemarks && (
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 shrink-0 font-medium">Remarks</span>
                    <span className="text-slate-800 bg-amber-50 px-2 py-1 rounded text-amber-800">{quote.specialRemarks}</span>
                  </div>
                )}
                {quote.expectedDeliveryDate && (
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 shrink-0 font-medium">Req. Delivery</span>
                    <span className="text-slate-800">{new Date(quote.expectedDeliveryDate).toLocaleDateString()}</span>
                  </div>
                )}
                {quote.quoteDeadline && (
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 shrink-0 font-medium">Deadline</span>
                    <span className="text-rose-600 font-semibold">{new Date(quote.quoteDeadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Quote Price (Rs.) *</label>
                <input 
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={vendorPrice}
                  onChange={e => setVendorPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold"
                  placeholder="e.g. 1500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Additional Remarks (Optional)</label>
                <textarea 
                  value={vendorRemarks}
                  onChange={e => setVendorRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none custom-scrollbar"
                  placeholder="Any conditions, ETA, or alternative suggestions..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Product Reference Image (Optional)</label>
                {imagePreview ? (
                  <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-300">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-white text-slate-600 rounded-full shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-2 text-slate-500" />
                        <p className="text-sm text-slate-500 font-medium">Click to upload image</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-b-4 border-amber-500"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Quote to SRK Modular
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
