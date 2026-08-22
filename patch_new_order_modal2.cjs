const fs = require('fs');

let content = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');

// Just to be sure, let's output the content of the file and inspect it instead of blind replacement if it didn't work.
