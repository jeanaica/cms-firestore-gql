import * as admin from 'firebase-admin';
import { Post } from '../../types/post';
import { db } from '../../utils/firebase';

export const updatePost = async (
  _: unknown,
  args: { id: string; post: Post }
): Promise<Post | undefined> => {
  const postDoc = db.collection('posts').doc(args.id);
  const post = args.post;
  await postDoc.update({
    ...args.post,
    updatedAt: admin.firestore.Timestamp.now(),
  });
  return {
    ...post,
    id: args.id,
  };
};
