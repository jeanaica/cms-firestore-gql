import { GraphQLError } from 'graphql';
import { Timestamp } from 'firebase-admin/firestore';

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

  const newPost = {
    title,
    content,
    category,
    tags,
    banner,
    meta: {
      ...meta,
      url: `${process.env.BLOG_URL}/${meta?.slug}`,
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
  const postRef = await db.collection('posts').add(newPost);
  const postDoc = await postRef.get();
  const post = postDoc.data() as PostAPI;

  post.id = postRef.id;

  return {
    ...post,
    createdAt: post?.createdAt?.toMillis(),
    updatedAt: post?.updatedAt?.toMillis(),
    publishedAt: post?.publishedAt?.toMillis(),
    scheduledAt: post?.scheduledAt?.toMillis(),
    archivedAt: post?.archivedAt?.toMillis(),
    meta: {
      ...post?.meta,
      updatedAt: post?.meta?.updatedAt?.toMillis(),
      publishedAt: post?.meta?.publishedAt?.toMillis(),
    },
  } as Post;
};
