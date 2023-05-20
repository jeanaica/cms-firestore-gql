import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Auth } from 'firebase-admin/auth';

import * as serviceAccount from './serviceAccountKey.json';
import * as stagingServiceAccount from './stagingServiceAccountKey.json';

let dbInstance: admin.firestore.Firestore | null = null;
let authInstance: Auth | null = null;

function getAdmin() {
  const selectedServiceAccount =
    functions.config().config.env === 'staging'
      ? stagingServiceAccount
      : serviceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(
      selectedServiceAccount as admin.ServiceAccount
    ),
    databaseURL: `https://${
      functions.config().config.project_id
    }.firebaseio.com`,
  });

  dbInstance = admin.firestore();
  authInstance = admin.auth();

  dbInstance.settings({ ignoreUndefinedProperties: true });

  return { db: dbInstance, auth: authInstance };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const db = () => dbInstance || getAdmin().db;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const auth = () => authInstance || getAdmin().auth;
