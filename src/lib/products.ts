import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';

export interface ProductDetails {
  productName?: string;
  specification?: string;
  price?: string; // keeping for backwards compatibility, but we might use totalUnitPrice/perUnitPrice
  vendorName?: string;
  vendorId?: string;
  details?: string;
  productImageName?: string;
  productImageData?: string;
  measuringMetric?: string;
  totalUnitPrice?: string;
  perUnitPrice?: string;
}

export interface Product {
  id: string;
  docId?: string;
  name: string;
  specification?: string;
  price: string;
  vendorId: string;
  vendorName: string;
  details?: ProductDetails;
  createdAt: any;
}

const getProductsCollection = () => collection(db, 'products');

export const saveProduct = async (productData: Partial<Product>) => {
  const cleanData: any = { ...productData };
  
  if (cleanData.details) {
    cleanData.details = Object.fromEntries(
      Object.entries(cleanData.details).filter(([_, v]) => v !== undefined)
    );
  }
  
  const finalData = Object.fromEntries(
    Object.entries(cleanData).filter(([_, v]) => v !== undefined)
  );

  const docRef = await addDoc(getProductsCollection(), {
    ...finalData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const deleteProduct = async (docId: string) => {
  await deleteDoc(doc(db, 'products', docId));
};

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  let unsubscribeSnapshot: () => void;
  
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(getProductsCollection(), orderBy('createdAt', 'desc'));
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const products = snapshot.docs.map(docSnap => ({
          ...docSnap.data(),
          id: docSnap.data().id || docSnap.id,
          docId: docSnap.id
        })) as Product[];
        callback(products);
      }, (error) => {
        console.error("Error fetching products:", error);
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
