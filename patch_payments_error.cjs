const fs = require('fs');

let content = fs.readFileSync('src/lib/payments.ts', 'utf8');

const replacement = `
export const savePaymentRecord = async (record: Partial<PaymentRecord>) => {
  try {
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
  } catch (err) {
    console.error("Firebase savePaymentRecord Error: ", err);
    throw err;
  }
};
`;

content = content.replace(/export const savePaymentRecord = async \([\s\S]*\}\;/m, replacement.trim());

fs.writeFileSync('src/lib/payments.ts', content);
