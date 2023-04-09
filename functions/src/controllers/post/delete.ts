import { Timestamp } from 'firebase-admin/firestore';
import { GraphQLError } from 'graphql';
import { Post } from '../../types/post';
import { db } from '../../utils/firebase';

export const deletePost = async (
  _: unknown,
  args: { id: string },
  { isAuthenticated }: { isAuthenticated: boolean }
): Promise<Partial<Post> | undefined> => {
  if (!isAuthenticated) {
    throw new GraphQLError('you must be logged in to query this schema', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

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
