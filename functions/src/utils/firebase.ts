import * as admin from 'firebase-admin';

// initialize firebase app instance
admin.initializeApp();
// add your Firebase Admin SDK configuration here

export const db = admin.firestore();
export const auth = admin.auth();
