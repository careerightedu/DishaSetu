process.env.FIRESTORE_ENABLE_TRACING = "false";

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminApp;

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    adminApp = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    adminApp = initializeApp();
  }
} else {
  adminApp = getApp();
}

const adminDb = getFirestore(adminApp);

export { adminDb, adminApp };
