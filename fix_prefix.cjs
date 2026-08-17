const fs = require('fs');

let code = fs.readFileSync('src/components/VendorQuoteForm.tsx', 'utf8');

// I'll grab the file from git to restore it, since I messed it up.
