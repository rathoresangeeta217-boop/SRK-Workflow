const fs = require('fs');
let content = fs.readFileSync('src/tabs/DispatchedTab.tsx', 'utf8');

// Replace DispatchModal import with DispatchView
content = content.replace(
  "import { DispatchModal } from '../components/DispatchModal';",
  "import { DispatchView } from '../components/DispatchView';"
);

// We need to render the main view or the DispatchView conditionally.
// The component is a large return block. Let's wrap the main view in AnimatePresence or just an if.
// First, find the return (
const mainReturnMatch = content.match(/return \(\s*<div className="space-y-6 pb-8">/);
if (mainReturnMatch) {
  const parts = content.split('return (');
  
  // Create a conditional render
  const newReturn = `return (
    <AnimatePresence mode="wait">
      {selectedOrder ? (
        <DispatchView 
          key="dispatch-view"
          order={selectedOrder} 
          onBack={() => setSelectedOrder(null)} 
        />
      ) : (
        <motion.div 
          key="list-view"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6 pb-8"
        >`;
        
  // Replace the first 'return (' and `<div className="space-y-6 pb-8">`
  let updatedContent = parts[0] + newReturn + parts[1].replace(/<div className="space-y-6 pb-8">/, '');
  
  // Add AnimatePresence import
  if (!updatedContent.includes('AnimatePresence')) {
    updatedContent = updatedContent.replace(
      "import { motion } from 'motion/react';",
      "import { motion, AnimatePresence } from 'motion/react';"
    );
  }
  
  // Remove the old DispatchModal render
  updatedContent = updatedContent.replace(
    /<DispatchModal[\s\S]*?\/>/,
    ''
  );
  
  // Close the AnimatePresence block at the end
  updatedContent = updatedContent.replace(
    /    <\/div>\n  \);\n}\n$/,
    '        </motion.div>\n      )}\n    </AnimatePresence>\n  );\n}\n'
  );

  fs.writeFileSync('src/tabs/DispatchedTab.tsx', updatedContent);
} else {
  console.log("Could not find the return block.");
}
