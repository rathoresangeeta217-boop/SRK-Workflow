const fs = require('fs');
let code = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');

const searchCode = `          setFormData({
            customerName: data.customerName || '',
            companyName: data.companyName || '',
            mobileNumber: data.mobileNumber || '',
            email: data.email || '',
            address: data.address || '',
            gst: data.gst || '',
            totalItems: data.totalItems || 0,
            totalAmount: data.totalAmount || '₹0.00'
          });`;

const replaceCode = `          setFormData({
            ...formData,
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
          });`;

code = code.replace(searchCode, replaceCode);

const searchInitial = `  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    address: '',
    gst: '',
    totalItems: 0,
    totalAmount: '₹0.00'
  });`;

const replaceInitial = `  const [formData, setFormData] = useState({
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
  });`;

code = code.replace(searchInitial, replaceInitial);

const saveSearch = `      const orderDetails = {
        customerName: formData.customerName,
        companyName: formData.companyName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        address: formData.address,
        gst: formData.gst,
        quotationFileName: fileName,
        quotationFileData: fileData,
        poFileName: poFile ? poFile.name : undefined,
        poFileData: poBase64,
        drawingFileName: drawingFile ? drawingFile.name : undefined,
        drawingFileData: drawingBase64
      };`;

const saveReplace = `      const orderDetails = {
        customerName: formData.customerName,
        companyName: formData.companyName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        address: formData.address,
        gst: formData.gst,
        quotationFileName: fileName,
        quotationFileData: fileData,
        poFileName: poFile ? poFile.name : undefined,
        poFileData: poBase64,
        drawingFileName: drawingFile ? drawingFile.name : undefined,
        drawingFileData: drawingBase64,
        advancePayment: formData.advancePayment,
        transportationCharges: formData.transportationCharges,
        installationCharges: formData.installationCharges
      };`;

code = code.replace(saveSearch, saveReplace);

fs.writeFileSync('src/components/NewOrderModal.tsx', code);
console.log("Patched NewOrderModal");
