import re

with open('src/tabs/PurchaseTab.tsx', 'r') as f:
    content = f.read()

# Replace Copy Link block
copy_pattern = r"onClick=\{async \(e\) => \{\s*const btn = e\.currentTarget;[\s\S]*?className=\"flex items-center gap-1\.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded\"\s*title=\"Copy Quote Link\"\s*>"
copy_replacement = """onClick={() => {
                                    const baseUrl = getPublicUrl();
                                    const link = `${baseUrl}?quoteId=${quote.id}`;
                                    
                                    try {
                                      navigator.clipboard.writeText(link);
                                      alert('Link copied to clipboard!');
                                    } catch (err) {
                                      alert(`Failed to copy automatically. Here is your link:\\n\\n${link}`);
                                    }
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded"
                                  title="Copy Quote Link"
                                >"""
content = re.sub(copy_pattern, copy_replacement, content)

# Replace Email Link block
email_pattern = r"onClick=\{async \(e\) => \{\s*const btn = e\.currentTarget;[\s\S]*?className=\"flex items-center gap-1\.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded\"\s*title=\"Email Quote Link\"\s*>"
email_replacement = """onClick={() => {
                                    const baseUrl = getPublicUrl();
                                    const link = `${baseUrl}?quoteId=${quote.id}`;

                                    const itemsList = quote.items && quote.items.length > 0 ? quote.items : [quote];
                                    const productNames = itemsList.map((i: any) => i.productName).join(', ');
                                    const subject = `Quote Request from SRK Modular: ${productNames}`;
                                    const text = `Hi ${vendor?.contactPerson || vendor?.name},\\n\\nPlease review our requirement for ${productNames} and provide a quote using this link:\\n\\n${link}\\n\\nThank you,\\nSRK Modular Purchasing`;
                                    
                                    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(vendor?.email || '')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
                                    window.open(mailUrl, '_blank');
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                                  title="Email Quote Link"
                                >"""
content = re.sub(email_pattern, email_replacement, content)

# Replace WhatsApp Link block
whatsapp_pattern = r"onClick=\{async \(e\) => \{\s*let phoneNum = vendor\?\.phone\?\.replace\(\/\[\^0-9\]\/g, ''\) \|\| '';[\s\S]*?className=\"flex items-center gap-1\.5 text-xs font-semibold text-\[#25D366\] hover:text-\[#128C7E\] bg-green-50 px-2 py-1 rounded\"\s*title=\"WhatsApp Quote Link\"\s*>"
whatsapp_replacement = """onClick={() => {
                                    let phoneNum = vendor?.phone?.replace(/[^0-9]/g, '') || '';
                                    if (phoneNum.length >= 10) {
                                      phoneNum = '91' + phoneNum.slice(-10);
                                    }
                                    if (!phoneNum) {
                                      alert('Vendor does not have a valid phone number.');
                                      return;
                                    }

                                    const baseUrl = getPublicUrl();
                                    const link = `${baseUrl}?quoteId=${quote.id}`;

                                    const itemsList = quote.items && quote.items.length > 0 ? quote.items : [quote];
                                    const productNames = itemsList.map((i: any) => i.productName).join(', ');
                                    const text = `Hi ${vendor?.contactPerson || vendor?.name},\\n\\nPlease review our requirement for ${productNames} and provide a quote using this link:\\n${link}`;
                                    
                                    const whatsappUrl = `https://web.whatsapp.com/send/?phone=${phoneNum}&text=${encodeURIComponent(text)}`;
                                    window.open(whatsappUrl, 'whatsapp_web_tab');
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-[#128C7E] bg-green-50 px-2 py-1 rounded"
                                  title="WhatsApp Quote Link"
                                >"""
content = re.sub(whatsapp_pattern, whatsapp_replacement, content)

with open('src/tabs/PurchaseTab.tsx', 'w') as f:
    f.write(content)

