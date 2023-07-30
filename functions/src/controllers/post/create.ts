import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';
import DOMPurify from 'isomorphic-dompurify';

import { Post, PostAPI, PostInput } from '../../types/post';
import { db } from '../../utils/firebase';
import { setTimestamps } from './helper';

export const createPost = async (
  _: unknown,
  args: { post: Partial<PostInput> },
  { isAuthenticated }: { isAuthenticated: boolean }
): Promise<Post> => {
  if (!isAuthenticated) {
    throw new GraphQLError('You must be logged in to query this schema', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const {
    title,
    content,
    category,
    tags,
    banner,
    caption,
    meta,
    status = 'DRAFT',
    scheduledAt,
  } = args.post;

  const now = Timestamp.now();

  const { newPublishedAt, newScheduledAt } = setTimestamps({
    status,
    publishedAt: now,
    scheduledAt: scheduledAt,
  });

  let cleanContent = '';

  if (content) {
    cleanContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'allowfullscreen', 'scrolling'],
      ADD_TAGS: ['iframe'],
    });
  }

  const newPost = {
    title,
    content: cleanContent,
    category,
    tags,
    banner,
    caption,
    meta: {
      ...meta,
      title,
      keywords: tags?.map(tag => tag.value),
      updatedAt: now,
      publishedAt: newPublishedAt,
    },
    status,
    createdAt: now,
    updatedAt: now,
    publishedAt: newPublishedAt,
    firstPublishedAt: newPublishedAt,
    scheduledAt: newScheduledAt,
  };
  const postRef = await db.collection('posts').add(newPost);
  const postDoc = await postRef.get();
  const postData = postDoc.data() as PostAPI;

  postData.id = postRef.id;

  return {
    ...postData,
    createdAt: postData?.createdAt?.toMillis
      ? postData.createdAt.toMillis()
      : null,
    updatedAt: postData?.updatedAt?.toMillis
      ? postData.updatedAt.toMillis()
      : null,
    publishedAt: postData?.publishedAt?.toMillis
      ? postData.publishedAt.toMillis()
      : null,
    scheduledAt: postData?.scheduledAt?.toMillis
      ? postData.scheduledAt.toMillis()
      : null,
    archivedAt: postData?.archivedAt?.toMillis
      ? postData.archivedAt.toMillis()
      : null,
    meta: {
      ...postData?.meta,
      updatedAt: postData?.updatedAt?.toMillis
        ? postData.updatedAt.toMillis()
        : null,
      publishedAt: postData?.publishedAt?.toMillis
        ? postData.publishedAt.toMillis()
        : null,
    },
  } as Post;
};
