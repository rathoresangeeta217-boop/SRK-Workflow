import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"), limit(5));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log("=== QUOTE", doc.id, "===");
    console.log("items count:", data.items?.length);
    if (data.items) {
      data.items.forEach((item, i) => {
        console.log(`item ${i} imageUrl length:`, item.imageUrl ? item.imageUrl.length : "undefined");
      });
    } else {
      console.log("root imageUrl length:", data.imageUrl ? data.imageUrl.length : "undefined");
    }
  });
  process.exit(0);
}
run();
