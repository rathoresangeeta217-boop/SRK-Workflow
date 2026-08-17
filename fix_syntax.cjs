const fs = require('fs');

let code = fs.readFileSync('src/components/VendorQuoteForm.tsx', 'utf8');

code = code.replace(
  `                  </div>
                  {quote.items && index < quote.items.length - 1 && (
                    <div className="col-span-1 lg:col-span-2 h-px bg-slate-200 w-full my-4"></div>
                  )}
              ))}`,
  `                  </div>
                  {quote.items && index < quote.items.length - 1 && (
                    <div className="col-span-1 lg:col-span-2 h-px bg-slate-200 w-full my-6"></div>
                  )}
                </div>
              ))}`
);

fs.writeFileSync('src/components/VendorQuoteForm.tsx', code);
