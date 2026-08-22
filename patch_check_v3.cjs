import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);
const app = initializeApp(config);
const db = getFirestore(app); // default DB

async function fix() {
  const q = query(collection(db, 'orders'), where('id', '==', 'ORD-2026-274'));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docData = snapshot.docs[0];
    const docRef = doc(db, 'orders', docData.id);
    
    // Hardcode the values based on user's screenshots
    const update = {
      "details.advancePayment": "₹50,000",
      "details.transportationCharges": "₹2,000",
      "details.installationCharges": "₹5,000",
      // Backwards compatible fields
      "advancePayment": "₹50,000",
      "transportationCharges": "₹2,000",
      "installationCharges": "₹5,000"
    };
    
    await updateDoc(docRef, update);
    console.log("Updated order successfully!");
    
    // Also delete any broken payment records so it re-generates
    const pq = query(collection(db, 'payments'), where('orderId', '==', 'ORD-2026-274'));
    const pSnap = await getDocs(pq);
    if (!pSnap.empty) {
      await deleteDoc(doc(db, 'payments', pSnap.docs[0].id));
      console.log("Deleted broken payment record.");
    }
  } else {
    console.log("Order not found");
  }
}
fix();
