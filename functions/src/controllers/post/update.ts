import { Timestamp } from 'firebase-admin/firestore';
import { GraphQLError } from 'graphql';
import DOMPurify from 'isomorphic-dompurify';

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

  const postDoc = db().collection('posts').doc(args.id);
  const postData = args.post;
  const savedPost = (await postDoc.get()).data();
  const publishedTime = savedPost?.publishedAt
    ? savedPost?.publishedAt
    : Timestamp.now();
  let cleanContent = savedPost?.content || '';

  if (args?.post.content) {
    cleanContent = DOMPurify.sanitize(args?.post.content, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target'],
    });
  }

  const meta = {
    ...savedPost?.meta,
    ...args.post.meta,
    publishedAt: publishedTime,
    title: args.post.title,
    keywords: args.post?.tags?.map(tag => tag.value),
    updatedAt: Timestamp.now(),
  };

  await postDoc.update({
    ...savedPost,
    ...postData,
    content: cleanContent,
    publishedAt: publishedTime,
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
