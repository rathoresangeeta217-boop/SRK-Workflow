const fs = require('fs');

let code = fs.readFileSync('src/components/VendorQuoteForm.tsx', 'utf8');

// Update fetchQuote to always populate initialResponses
const oldFetchLogic = `          if (data.status === 'submitted') {
            setSubmitted(true);
          } else {
            // Initialize item responses
            const items = data.items && data.items.length > 0 ? data.items : [data];
            const initialResponses: any = {};
            items.forEach((_: any, i: number) => {
              initialResponses[i] = { vendorPrice: '', vendorRemarks: '', imageFile: null, imagePreview: null };
            });
            setItemResponses(initialResponses);
          }`;

const newFetchLogic = `          const items = data.items && data.items.length > 0 ? data.items : [data];
          const initialResponses: any = {};
          items.forEach((item: any, i: number) => {
            initialResponses[i] = { 
              vendorPrice: item.vendorPrice || '', 
              vendorRemarks: item.vendorRemarks || '', 
              imageFile: null, 
              imagePreview: item.vendorImageUrl || null 
            };
          });
          setItemResponses(initialResponses);

          if (data.status === 'submitted') {
            setSubmitted(true);
          }`;

code = code.replace(oldFetchLogic, newFetchLogic);

// Add Edit button on the submitted view
const oldSubmittedViewEnd = `          <div className="bg-slate-50 p-4 rounded-lg text-left text-sm text-slate-700 space-y-4 max-h-48 overflow-y-auto custom-scrollbar">
            {items.map((item: any, i: number) => (
              <div key={i} className="space-y-1 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                <p className="font-semibold text-slate-800">{item.productName}</p>
                <p className="text-slate-600">Your Price: Rs. {item.vendorPrice || itemResponses[i]?.vendorPrice || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }`;

const newSubmittedViewEnd = `          <div className="bg-slate-50 p-4 rounded-lg text-left text-sm text-slate-700 space-y-4 max-h-48 overflow-y-auto custom-scrollbar">
            {items.map((item: any, i: number) => (
              <div key={i} className="space-y-1 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                <p className="font-semibold text-slate-800">{item.productName}</p>
                <p className="text-slate-600">Your Price: Rs. {item.vendorPrice || itemResponses[i]?.vendorPrice || '-'}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setSubmitted(false)}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Edit Quote
            </button>
          </div>
        </div>
      </div>
    );
  }`;

code = code.replace(oldSubmittedViewEnd, newSubmittedViewEnd);

// Also need to make sure the submit button says "Resubmit Quote" if status was submitted but now they are editing
// I'll leave it as "Submit Quote" or change it based on quote.status
code = code.replace("Submit Quote to SRK Modular", "{quote.status === 'submitted' ? 'Resubmit Quote to SRK Modular' : 'Submit Quote to SRK Modular'}");

fs.writeFileSync('src/components/VendorQuoteForm.tsx', code);
console.log("Updated VendorQuoteForm.tsx for editing capabilities");
