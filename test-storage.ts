import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
import config from './firebase-applet-config.json';

const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  appId: config.appId
});
const storage = getStorage(app);
const auth = getAuth(app);

async function run() {
  await signInAnonymously(auth);
  const fileRef = ref(storage, 'test-file.txt');
  await uploadString(fileRef, 'hello world');
  console.log('Upload success');
}
run().catch(console.error);
