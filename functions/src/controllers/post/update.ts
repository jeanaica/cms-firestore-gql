import { Timestamp } from 'firebase-admin/firestore';
import { GraphQLError } from 'graphql';
import { Post } from '../../types/post';
import { db } from '../../utils/firebase';

export const updatePost = async (
  _: unknown,
  args: { id: string; post: Post },
  { isAuthenticated }: { isAuthenticated: boolean }
): Promise<Post | undefined> => {
  if (!isAuthenticated) {
    throw new GraphQLError('you must be logged in to query this schema', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const postDoc = db.collection('posts').doc(args.id);
  const post = args.post;
  await postDoc.update({
    ...args.post,
    meta: {
      ...args.post.meta,
      keywords: args.post?.tags?.map(tag => tag.value),
      updatedAt: Timestamp.now(),
    },
    updatedAt: Timestamp.now(),
  });
  return {
    ...post,
    id: args.id,
  };
};
