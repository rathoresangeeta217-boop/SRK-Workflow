const fs = require('fs');
let content = fs.readFileSync('src/components/DispatchView.tsx', 'utf8');

// There are three </div>s before <AnimatePresence>, which is one too many.
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<AnimatePresence>/,
  '</div>\n      </div>\n\n      <AnimatePresence>'
);

fs.writeFileSync('src/components/DispatchView.tsx', content);
