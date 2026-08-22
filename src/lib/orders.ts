import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';

export interface OrderDetails {
  customerName?: string;
  companyName?: string;
  mobileNumber?: string;
  email?: string;
  address?: string;
  gst?: string;
  quotationFileName?: string;
  quotationFileData?: string;
  poFileName?: string;
  poFileData?: string;
  drawingFileName?: string;
  drawingFileData?: string;
  advancePayment?: string;
  transportationCharges?: string;
  installationCharges?: string;
}

export interface Order {
  id: string;
  docId?: string;
  customer: string;
  amount: string;
  date: string;
  status: string;
  items: number;
  createdAt: any;
  details?: OrderDetails;
}

const getOrdersCollection = () => collection(db, 'orders');

export const saveOrder = async (orderData: Partial<Order>) => {
  const cleanData: any = { ...orderData };
  
  if (cleanData.details) {
    cleanData.details = Object.fromEntries(
      Object.entries(cleanData.details).filter(([_, v]) => v !== undefined)
    );
  }
  
  const finalData = Object.fromEntries(
    Object.entries(cleanData).filter(([_, v]) => v !== undefined)
  );

  const docRef = await addDoc(getOrdersCollection(), {
    ...finalData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const deleteOrder = async (docId: string) => {
  await deleteDoc(doc(db, 'orders', docId));
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  let unsubscribeSnapshot: () => void;
  
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(getOrdersCollection(), orderBy('createdAt', 'desc'));
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          ...doc.data(),
          // Use firestore id as the backup if id is missing
          id: doc.data().id || doc.id,
          docId: doc.id
        })) as Order[];
        callback(orders);
      }, (error) => {
        console.error("Error fetching orders:", error);
      });
    } else {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      callback([]);
    }
  });

  return () => {
    unsubscribeAuth();
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
    }
  };
};
