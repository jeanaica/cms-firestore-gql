import { Timestamp } from 'firebase-admin/firestore';
import { GraphQLError } from 'graphql';

import { Post, PostAPI } from '../../types/post';
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
  const postData = args.post;
  const savedPost = (await postDoc.get()).data();

  const meta = {
    ...savedPost?.meta,
    ...args.post.meta,
    publishedAt: savedPost?.publishedAt,
    title: args.post.title,
    keywords: args.post?.tags?.map(tag => tag.value),
    updatedAt: Timestamp.now(),
  };

  await postDoc.update({
    ...savedPost,
    ...postData,
    publishedAt: savedPost?.publishedAt,
    meta,
    updatedAt: Timestamp.now(),
  });

  const updatedPost = (await postDoc.get()).data() as PostAPI;

  return {
    ...updatedPost,
    id: args.id,
    createdAt: updatedPost?.createdAt?.toMillis(),
    updatedAt: updatedPost?.updatedAt?.toMillis(),
    publishedAt: updatedPost?.publishedAt?.toMillis(),
    scheduledAt: updatedPost?.scheduledAt?.toMillis(),
    archivedAt: updatedPost?.archivedAt?.toMillis(),
    meta: {
      ...updatedPost?.meta,
      updatedAt: updatedPost?.meta?.updatedAt?.toMillis(),
      publishedAt: updatedPost?.meta?.publishedAt?.toMillis(),
    },
  };
};
