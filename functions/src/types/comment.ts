import * as admin from 'firebase-admin';

export interface Comment {
  id: string;
  body: string;
  authorId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}
