import * as admin from 'firebase-admin';

export interface Post {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}
