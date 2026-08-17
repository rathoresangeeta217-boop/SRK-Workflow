import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"), limit(1));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log("=== QUOTE ===");
    console.log(JSON.stringify(data, null, 2));
  });
  process.exit(0);
}
run();
