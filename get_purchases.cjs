const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

async function run() {
  const snapshot = await db.collection('purchases').get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}
run();
