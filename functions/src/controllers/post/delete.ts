import { Timestamp } from 'firebase-admin/firestore';
import { Post } from '../../types/post';
import { db } from '../../utils/firebase';

export const deletePost = async (
  _: unknown,
  args: { id: string }
): Promise<Partial<Post> | undefined> => {
  const postRef = db.collection('posts').doc(args.id);

  await postRef.update({
    updatedAt: Timestamp.now(),
    status: 'ARCHIVED',
  });

  const postDoc = await postRef.get();
  const post = postDoc.data() as Post;

  return {
    ...post,
    id: args.id,
  };
};
