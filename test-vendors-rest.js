import fs from 'fs';
const configPath = './firebase-applet-config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function run() {
  const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId || '(default)'}/documents/vendors`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.documents) {
    data.documents.forEach(doc => {
      const fields = doc.fields;
      console.log(
        fields.name?.stringValue, 
        fields.phone?.stringValue
      );
    });
  } else {
    console.log("No vendors found.");
  }
}
run();
