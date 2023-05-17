import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';
import * as stagingServiceAccount from './stagingServiceAccountKey.json';

const selectedServiceAccount =
  process.env.ENV === 'staging' ? stagingServiceAccount : serviceAccount;

// Initialize the Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(selectedServiceAccount as ServiceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const auth = admin.auth();
