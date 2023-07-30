import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Auth } from 'firebase-admin/auth';
import { Storage } from 'firebase-admin/lib/storage/storage';

import * as serviceAccount from './serviceAccountKey.json';
import * as stagingServiceAccount from './stagingServiceAccountKey.json';

let dbInstance: admin.firestore.Firestore | null = null;
let authInstance: Auth | null = null;
let storageInstance: Storage | null = null;

function getAdmin() {
  const selectedServiceAccount =
    functions.config().config.env === 'production'
      ? serviceAccount
      : stagingServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(
      selectedServiceAccount as admin.ServiceAccount
    ),
    databaseURL: `https://${
      functions.config().config.project_id
    }.firebaseio.com`,
    storageBucket: functions.config().config.storage_bucket,
  });

  dbInstance = admin.firestore();
  authInstance = admin.auth();
  storageInstance = admin.storage();

  dbInstance.settings({ ignoreUndefinedProperties: true });

  return { db: dbInstance, auth: authInstance, dbStorage: storageInstance };
}

export const db = (): admin.firestore.Firestore => dbInstance || getAdmin().db;
export const auth = (): Auth => authInstance || getAdmin().auth;
export const dbStorage = (): Storage => storageInstance || getAdmin().dbStorage;
