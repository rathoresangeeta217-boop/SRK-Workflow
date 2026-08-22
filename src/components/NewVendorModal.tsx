import { motion, AnimatePresence } from 'motion/react';
import { X, Building2 } from 'lucide-react';
import React, { useState } from 'react';

interface NewVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor?: (vendor: any) => void;
  vendors: any[];
}

export function NewVendorModal({ isOpen, onClose, onAddVendor, vendors }: NewVendorModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    category: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      if (onAddVendor) {
        await onAddVendor(formData);
      }
    } catch (error) {
      console.error("Error adding vendor", error);
    } finally {
      setIsProcessing(false);
      setFormData({ name: '', contactPerson: '', category: '', email: '', phone: '', address: '' });
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
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Add Vendor</h3>
                  <p className="text-xs font-medium text-slate-500">Add a new supplier to the system</p>
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
              <form id="new-vendor-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Vendor Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g. Steel Dynamics Inc."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Person</label>
                    <input 
                      type="text" 
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                    <input 
                      type="text" 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g. Boards, Hardware, Electronics"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g. jane@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g. +1 555-0123"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none custom-scrollbar"
                    placeholder="e.g. 123 Industrial Parkway, City, State, ZIP"
                  />
                </div>
              </form>

              {vendors.length > 0 && (
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Existing Vendors</h4>
                  <div className="space-y-3">
                    {vendors.map((vendor: any, i: number) => (
                      <div key={`${vendor.docId || vendor.id || 'k'}-${i}`} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="font-semibold text-slate-800 text-sm">{vendor.name}</p>
                        <div className="flex flex-wrap gap-x-4 mt-2">
                          {vendor.category && (
                            <p className="text-xs text-slate-500"><span className="font-medium">Category:</span> {vendor.category}</p>
                          )}
                          {vendor.contactPerson && (
                            <p className="text-xs text-slate-500"><span className="font-medium">Contact:</span> {vendor.contactPerson}</p>
                          )}
                          {vendor.email && (
                            <p className="text-xs text-slate-500"><span className="font-medium">Email:</span> {vendor.email}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                form="new-vendor-form"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Add Vendor'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
