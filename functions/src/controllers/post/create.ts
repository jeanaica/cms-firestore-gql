import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';
import DOMPurify from 'isomorphic-dompurify';

import { Post, PostAPI, PostInput, PostStatus } from '../../types/post';
import { db } from '../../utils/firebase';
import toFirebaseTimestamp from '../../utils/toFirebaseTimestamp';

const setPublishedAt = ({
  status,
  value,
}: {
  status: PostStatus;
  value: string | Timestamp;
}) => {
  switch (status.toUpperCase()) {
    case 'DRAFT':
      return null;

    case 'PUBLISHED':
      return value;

    case 'SCHEDULED':
      return toFirebaseTimestamp(value as string);

    case 'ARCHIVED':
      return null;

    default:
      return null;
  }
};

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
    meta,
    status = 'DRAFT',
    scheduledAt,
  } = args.post;

  const now = Timestamp.now();

  const publishedTime = setPublishedAt({
    status,
    value: scheduledAt ? scheduledAt : now,
  });
  let cleanContent = '';

  if (content) {
    cleanContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
    });
  }

  const newPost = {
    title,
    content: cleanContent,
    category,
    tags,
    banner,
    meta: {
      ...meta,
      title,
      keywords: tags?.map(tag => tag.value),
      updatedAt: now,
      publishedAt: publishedTime,
    },
    status,
    createdAt: now,
    updatedAt: now,
    publishedAt: publishedTime,
  };
  const postRef = await db().collection('posts').add(newPost);
  const postDoc = await postRef.get();
  const postData = postDoc.data() as PostAPI;

  postData.id = postRef.id;

  return {
    ...postData,
    createdAt: postData?.createdAt?.toMillis(),
    updatedAt: postData?.updatedAt?.toMillis(),
    publishedAt: postData?.publishedAt?.toMillis(),
    scheduledAt: postData?.scheduledAt?.toMillis(),
    archivedAt: postData?.archivedAt?.toMillis(),
    meta: {
      ...postData?.meta,
      updatedAt: postData?.meta?.updatedAt?.toMillis(),
      publishedAt: postData?.meta?.publishedAt?.toMillis(),
    },
  } as Post;
};
