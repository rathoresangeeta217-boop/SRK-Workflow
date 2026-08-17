const fs = require('fs');

const code = fs.readFileSync('src/components/VendorQuoteForm.tsx', 'utf8');

const prefix = code.substring(0, code.indexOf('return ('));
const suffix = `return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-6 py-8 text-center text-white border-b-4 border-amber-500">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="h-16 bg-white rounded-xl flex items-center justify-center shadow-lg mb-3 p-2 min-w-[64px]">
                {!logoError ? (
                  <img 
                    src="/logo.png" 
                    alt="SRK Modular Logo" 
                    className="h-full object-contain" 
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="font-bold text-xl text-slate-800">SRK</span>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">SRK MODULAR</h1>
              <p className="text-slate-300 text-xs tracking-widest uppercase mt-1">FURNITURE.CO</p>
            </div>
            <div className="w-16 h-0.5 bg-slate-700 mx-auto my-4"></div>
            <h2 className="text-lg font-semibold text-white">Vendor Quote Request</h2>
            <p className="text-slate-400 mt-1 text-sm">Please provide your best price for the following requirement.</p>
          </div>
          
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {(quote.items && quote.items.length > 0 ? quote.items : [quote]).map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Column: Requirement Details */}
                  <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Requirement Details {quote.items && quote.items.length > 1 ? \`#\${index + 1}\` : ''}</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-4">
                        <span className="text-slate-500 w-24 shrink-0 font-medium">Product</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800 font-semibold">{item.productName}</span>
                        </div>
                      </div>
                      {item.imageUrl && (
                        <div className="flex gap-4">
                          <span className="text-slate-500 w-24 shrink-0 font-medium pt-2">Ref. Image</span>
                          <div 
                            className="relative w-full h-64 bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer group"
                            onClick={() => setViewingImage(item.imageUrl)}
                          >
                            <img src={item.imageUrl} alt="Reference" className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="bg-white/95 text-slate-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm transform scale-95 group-hover:scale-100 duration-200">
                                <Maximize2 className="w-4 h-4" /> Click to enlarge
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.specification && (
                        <div className="flex gap-4">
                          <span className="text-slate-500 w-24 shrink-0 font-medium">Specification</span>
                          <span className="text-slate-800">{item.specification}</span>
                        </div>
                      )}
                      <div className="flex gap-4">
                        <span className="text-slate-500 w-24 shrink-0 font-medium">Quantity</span>
                        <span className="text-slate-800 font-semibold">{item.quantity}</span>
                      </div>
                      {item.specialRemarks && (
                        <div className="flex gap-4">
                          <span className="text-slate-500 w-24 shrink-0 font-medium">Remarks</span>
                          <span className="text-slate-800 bg-amber-50 px-2 py-1 rounded text-amber-800">{item.specialRemarks}</span>
                        </div>
                      )}
                      {item.expectedDeliveryDate && (
                        <div className="flex gap-4">
                          <span className="text-slate-500 w-24 shrink-0 font-medium">Req. Delivery</span>
                          <span className="text-slate-800">{new Date(item.expectedDeliveryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {item.quoteDeadline && (
                        <div className="flex gap-4">
                          <span className="text-slate-500 w-24 shrink-0 font-medium">Deadline</span>
                          <span className="text-rose-600 font-semibold">{new Date(item.quoteDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Vendor Input Form */}
                  <div className="space-y-6 lg:p-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Your Quote Price (Rs.) *</label>
                      <input 
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={itemResponses[index]?.vendorPrice || ''}
                        onChange={e => handleResponseChange(index, 'vendorPrice', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold"
                        placeholder="e.g. 1500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Additional Remarks (Optional)</label>
                      <textarea 
                        value={itemResponses[index]?.vendorRemarks || ''}
                        onChange={e => handleResponseChange(index, 'vendorRemarks', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none custom-scrollbar"
                        placeholder="Any conditions, ETA, or alternative suggestions..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Product Reference Image (Optional)</label>
                      {itemResponses[index]?.imagePreview ? (
                        <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-300">
                          <img src={itemResponses[index].imagePreview as string} alt="Preview" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
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
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(index, e)} />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {quote.items && index < quote.items.length - 1 && (
                    <div className="col-span-1 lg:col-span-2 h-px bg-slate-200 w-full my-4"></div>
                  )}
                </div>
              ))}

              <div className="pt-4 flex justify-center">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-md py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-b-4 border-amber-500"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Quote to SRK Modular
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4" onClick={() => setViewingImage(null)}>
          <div className="relative w-full max-w-5xl max-h-screen flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
              <a
                href={viewingImage}
                download="product-reference.jpg"
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-lg"
                onClick={e => e.stopPropagation()}
              >
                <Download className="w-4 h-4" /> Download
              </a>
              <button
                onClick={() => setViewingImage(null)}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img src={viewingImage} alt="Full screen reference" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/VendorQuoteForm.tsx', prefix + suffix);
console.log("Rewrote VendorQuoteForm.tsx completely!");
