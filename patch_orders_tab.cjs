const fs = require('fs');
let content = fs.readFileSync('src/tabs/OrdersTab.tsx', 'utf8');

const imageCompressor = `
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      
      const isImage = file.type.startsWith('image/');
      
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDimension = 1200;
            
            if (width > height && width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compress
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setUploadedFileData(compressedDataUrl);
            setIsModalOpen(true);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedFileData(reader.result as string);
          setIsModalOpen(true);
        };
        reader.onerror = () => {
          console.error("Failed to read file");
          setIsModalOpen(true);
        };
        reader.readAsDataURL(file);
      }
      
      e.target.value = '';
    }
  };
`;

content = content.replace(/const handleFileChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?e\.target\.value = '';\s*\}\s*\};/, imageCompressor.trim());

fs.writeFileSync('src/tabs/OrdersTab.tsx', content);
