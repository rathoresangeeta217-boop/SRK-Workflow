const fs = require('fs');
let code = fs.readFileSync('src/lib/purchases.ts', 'utf8');

code = code.replace(
  "import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, onSnapshot, deleteDoc } from 'firebase/firestore';",
  "import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';"
);

const newSave = `export const savePurchase = async (purchaseData: Partial<Purchase>) => {
  const cleanData: any = { ...purchaseData };
  
  if (cleanData.details) {
    cleanData.details = Object.fromEntries(
      Object.entries(cleanData.details).filter(([_, v]) => v !== undefined)
    );
  }
  
  const finalData = Object.fromEntries(
    Object.entries(cleanData).filter(([_, v]) => v !== undefined && k !== 'docId')
  );

  if (purchaseData.docId) {
    const docRef = doc(db, 'purchases', purchaseData.docId);
    await updateDoc(docRef, finalData);
    return purchaseData.docId;
  }

  const docRef = await addDoc(getPurchasesCollection(), {
    ...finalData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};`;

code = code.replace(/export const savePurchase = async \(purchaseData: Partial<Purchase>\) => \{[\s\S]*?return docRef\.id;\n\};/, `export const savePurchase = async (purchaseData: Partial<Purchase>) => {
  const cleanData: any = { ...purchaseData };
  
  if (cleanData.details) {
    cleanData.details = Object.fromEntries(
      Object.entries(cleanData.details).filter(([_, v]) => v !== undefined)
    );
  }
  
  const finalData = Object.fromEntries(
    Object.entries(cleanData).filter(([k, v]) => v !== undefined && k !== 'docId')
  );

  if (purchaseData.docId) {
    const docRef = doc(db, 'purchases', purchaseData.docId);
    await updateDoc(docRef, finalData);
    return purchaseData.docId;
  }

  const docRef = await addDoc(getPurchasesCollection(), {
    ...finalData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};`);

fs.writeFileSync('src/lib/purchases.ts', code);
console.log('patched savePurchase');
