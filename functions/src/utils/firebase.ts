import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Auth } from 'firebase-admin/auth';
import { Storage } from 'firebase-admin/lib/storage/storage';

import * as serviceAccount from './serviceAccountKey.json';
import * as stagingServiceAccount from './stagingServiceAccountKey.json';

function getAdmin(selectedServiceAccount: unknown): {
  db: admin.firestore.Firestore;
  auth: Auth;
  dbStorage: Storage;
} {
  admin.initializeApp({
    credential: admin.credential.cert(
      selectedServiceAccount as admin.ServiceAccount
    ),
    databaseURL: `https://${
      functions.config().config.project_id
    }.firebaseio.com`,
    storageBucket: functions.config().config.storage_bucket,
  });

  const dbInstance = admin.firestore();
  const authInstance = admin.auth();
  const storageInstance = admin.storage();

  dbInstance.settings({ ignoreUndefinedProperties: true });

  return { db: dbInstance, auth: authInstance, dbStorage: storageInstance };
}

export const { db, auth, dbStorage } = getAdmin(
  functions.config().config.env === 'production'
    ? serviceAccount
    : stagingServiceAccount
);
