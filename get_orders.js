import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);
const app = initializeApp(config);
const db = getFirestore(app, "ai-studio-nexusflowenterpr-71986131-a5cc-4eb8-8637-e19c6c912d2c");

async function check() {
  const snapshot = await getDocs(collection(db, 'orders'));
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.id === 'ORD-2026-274' || data.customer?.includes('AUTOEXIM')) {
       console.log("Found:", doc.id, data.id, data.details);
    }
  });
  console.log("Done");
}
check();
