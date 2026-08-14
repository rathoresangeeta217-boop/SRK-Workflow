import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const configPath = './firebase-applet-config.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snap = await getDocs(collection(db, 'vendors'));
  snap.forEach(doc => {
    console.log(doc.id, doc.data().name, doc.data().phone);
  });
  process.exit(0);
}
run();
