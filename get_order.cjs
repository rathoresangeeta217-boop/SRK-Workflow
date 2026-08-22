const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);
const app = initializeApp(config);
const db = getFirestore(app);

async function check() {
  const d = await getDoc(doc(db, 'orders', 'ORD-2026-274'));
  console.log(JSON.stringify(d.data(), null, 2));
}
check();
