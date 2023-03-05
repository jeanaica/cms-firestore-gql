import { Timestamp } from 'firebase-admin/firestore';
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
    updatedAt: Timestamp.now(),
  });
  return {
    ...post,
    id: args.id,
  };
};
