import { Timestamp } from 'firebase-admin/firestore';
import { GraphQLError } from 'graphql';
import DOMPurify from 'isomorphic-dompurify';
import { logger } from 'firebase-functions/v1';

import { Post, PostAPI } from '../../types/post';
import { db } from '../../utils/firebase';
import { timeValue } from './helper';

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

  const now = Timestamp.now();
  const postDoc = db().collection('posts').doc(args.id);
  const postData = args.post;
  const savedPost = (await postDoc.get()).data();
  // Fetching the current status of the post
  const currentStatus = savedPost?.status;

  // Determine firstPublishedAt timestamp
  let firstPublishedAt;
  if (
    args.post.status === 'PUBLISHED' &&
    currentStatus !== 'PUBLISHED' &&
    !savedPost?.firstPublishedAt
  ) {
    firstPublishedAt = now;
  } else {
    firstPublishedAt = savedPost?.firstPublishedAt;
  }

  const publishedTime = savedPost?.publishedAt ? savedPost?.publishedAt : now;
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
    firstPublishedAt,
    updatedAt: now,
    meta,
  });

  const updatedPost = (await postDoc.get()).data() as PostAPI;

  return {
    ...updatedPost,
    id: args.id,
    createdAt: timeValue(updatedPost?.createdAt),
    updatedAt: timeValue(updatedPost?.updatedAt),
    publishedAt: timeValue(updatedPost?.publishedAt),
    scheduledAt: timeValue(updatedPost?.scheduledAt),
    archivedAt: timeValue(updatedPost?.archivedAt),
    meta: {
      ...updatedPost?.meta,
      updatedAt: timeValue(updatedPost?.meta?.updatedAt),
      publishedAt: timeValue(updatedPost?.meta?.publishedAt),
    },
  };
};

export const publishScheduledPost = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  const postDoc = db().collection('posts').doc(id);
  const savedPost = (await postDoc.get()).data();
  const now = Timestamp.now();
  const meta = {
    ...savedPost?.meta,
    publishedAt: now,
    updatedAt: now,
  };

  try {
    await postDoc.update({
      ...savedPost,
      meta,
      scheduledAt: null,
      publishedAt: now,
      updatedAt: now,
      firstPublishedAt: now,
      status: 'PUBLISHED',
    });
    logger.log(`SUCCESS: ${id} posted`);
  } catch (error) {
    logger.warn('ERROR: ', error);
  }

  return;
};
