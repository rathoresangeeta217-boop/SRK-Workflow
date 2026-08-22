import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Loader2, CheckCircle2, Upload, Paperclip } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  fileData?: string;
  onAddOrder?: (order: any) => void;
  employeeName?: string;
}

export function NewOrderModal({ isOpen, onClose, fileName, fileData, onAddOrder, employeeName }: NewOrderModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    customerName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    address: '',
    gst: '',
    totalItems: 0,
    totalAmount: '₹0.00',
    advancePayment: '',
    transportationCharges: '',
    installationCharges: ''
  });

  const [poFile, setPoFile] = useState<File | null>(null);
  const [drawingFile, setDrawingFile] = useState<File | null>(null);
  const poInputRef = useRef<HTMLInputElement>(null);
  const drawingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && fileName && fileData) {
      setIsProcessing(true);
      
      fetch('/api/parse-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileData })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('API Error:', data.error);
            alert(`AI parsing is temporarily unavailable: ${data.error}. Please fill out the details manually.`);
            return;
          }
          setFormData({
            ...formData,
            employeeName: employeeName || '',
            customerName: data.customerName || '',
            companyName: data.companyName || '',
            mobileNumber: data.mobileNumber || '',
            email: data.email || '',
            address: data.address || '',
            gst: data.gst || '',
            totalItems: data.totalItems || 0,
            totalAmount: data.totalAmount || '₹0.00',
            advancePayment: data.advancePayment || '',
            transportationCharges: data.transportationCharges || '',
            installationCharges: data.installationCharges || ''
          });
        })
        .catch(err => {
          console.error("Error parsing order:", err);
          alert("Failed to process quotation due to a network or AI error. Please fill the details manually.");
        })
        .finally(() => setIsProcessing(false));
    } else if (!isOpen) {
      setFormData({
        employeeName: '',
        customerName: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        address: '',
        gst: '',
        totalItems: 0,
        totalAmount: '₹0.00'
      });
      setPoFile(null);
      setDrawingFile(null);
    }
  }, [isOpen, fileName, fileData]);

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
      const poFileData = await readFileAsDataURL(poFile);
      const drawingFileData = await readFileAsDataURL(drawingFile);
      
      if (onAddOrder) {
        await onAddOrder({
          ...formData,
          quotationFileName: fileName,
          poFileName: poFile?.name,
          drawingFileName: drawingFile?.name,
          poFileData,
          drawingFileData
        });
      }
    } catch (error) {
      console.error("Error reading files", error);
    } finally {
      setIsProcessing(false);
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
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">New Order</h3>
                  {fileName ? (
                    <p className="text-xs font-medium text-slate-500">From quotation: {fileName}</p>
                  ) : (
                    <p className="text-xs font-medium text-slate-500">Manual entry</p>
                  )}
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
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                  <p className="text-sm font-medium text-slate-600">Extracting details from quotation...</p>
                  <p className="text-xs text-slate-400 mt-1">This uses AI to parse the uploaded document.</p>
                </div>
              ) : (
                <form id="new-order-form" onSubmit={handleSubmit} className="space-y-4">
                  {fileName && (
                    <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg flex items-start mb-6">
                      <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Successfully extracted data</p>
                        <p className="text-emerald-600/80 mt-0.5 text-xs">Please review the details below and make any necessary corrections.</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Employee Name</label>
                      <input 
                        type="text" 
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50"
                        placeholder="Employee Name"
                        readOnly
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Customer Name</label>
                      <input 
                        type="text" 
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
                      <input 
                        type="text" 
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                      <input 
                        type="tel" 
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Items</label>
                      <input 
                        type="number" 
                        name="totalItems"
                        value={formData.totalItems}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Amount</label>
                      <input 
                        type="text" 
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="₹0.00"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">GST Number</label>
                      <input 
                        type="text" 
                        name="gst"
                        value={formData.gst}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address</label>
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none custom-scrollbar"
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div className="mt-8">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Attachments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* PO Upload */}
                      <div className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => poInputRef.current?.click()}>
                        <input 
                          type="file" 
                          ref={poInputRef} 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setPoFile(e.target.files[0]);
                            }
                          }}
                        />
                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mb-3">
                          <Paperclip className="w-5 h-5 text-indigo-500" />
                        </div>
                        {poFile ? (
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-800 break-all line-clamp-1">{poFile.name}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-1">Attached successfully</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">Attach PO (Purchase Order)</p>
                            <p className="text-xs text-slate-500 mt-1">PDF, DOCX, JPG</p>
                          </div>
                        )}
                      </div>

                      {/* Drawing Upload */}
                      <div className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => drawingInputRef.current?.click()}>
                        <input 
                          type="file" 
                          ref={drawingInputRef} 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setDrawingFile(e.target.files[0]);
                            }
                          }}
                        />
                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5 text-indigo-500" />
                        </div>
                        {drawingFile ? (
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-800 break-all line-clamp-1">{drawingFile.name}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-1">Attached successfully</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">Attach Drawing</p>
                            <p className="text-xs text-slate-500 mt-1">PDF, AutoCAD, Image</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
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
                form="new-order-form"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Create Order'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
