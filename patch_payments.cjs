const fs = require('fs');

let content = fs.readFileSync('src/lib/payments.ts', 'utf8');

const replacement = `
const removeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        newObj[key] = removeUndefined(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

export const savePaymentRecord = async (record: Partial<PaymentRecord>) => {
  const cleanData = removeUndefined(record);
  if (cleanData.docId) {
    const { docId, ...updateData } = cleanData;
    await updateDoc(doc(db, 'payments', docId), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return docId;
  } else {
    const docRef = await addDoc(getPaymentsCollection(), {
      ...cleanData,
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }
};
`;

content = content.replace(/export const savePaymentRecord = async \([\s\S]*\}\;/m, replacement.trim());

fs.writeFileSync('src/lib/payments.ts', content);
