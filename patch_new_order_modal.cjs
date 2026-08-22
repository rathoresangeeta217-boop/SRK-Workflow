const fs = require('fs');

let content = fs.readFileSync('src/components/NewOrderModal.tsx', 'utf8');

const replacement = `      fetch('/api/parse-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileData })
      })
        .then(async res => {
          if (!res.ok) {
            let errorMsg = 'Server error';
            try {
              const errorData = await res.json();
              errorMsg = errorData.error || errorMsg;
            } catch (e) {
              if (res.status === 413) errorMsg = "File is too large (must be under 4MB).";
              else if (res.status === 504) errorMsg = "The AI service timed out while reading the file.";
              else errorMsg = \`HTTP \${res.status}\`;
            }
            throw new Error(errorMsg);
          }
          return res.json();
        })
        .then(data => {
          if (data.error) {
            console.error('API Error:', data.error);
            alert(\`AI parsing is temporarily unavailable: \${data.error}. Please fill out the details manually.\`);
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
          alert(\`Failed to process quotation: \${err.message}. Please fill the details manually.\`);
        })
        .finally(() => setIsProcessing(false));`;

content = content.replace(/fetch\('\/api\/parse-order'[\s\S]*?finally\(\(\) => setIsProcessing\(false\)\);/m, replacement);

fs.writeFileSync('src/components/NewOrderModal.tsx', content);
