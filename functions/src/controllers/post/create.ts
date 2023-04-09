import { Timestamp } from 'firebase-admin/firestore';
import { GraphQLError } from 'graphql';
import { Post, PostAPI, PostStatus } from '../../types/post';
import { db } from '../../utils/firebase';

const setPublishedAt = ({
  status,
  value,
  current,
}: {
  status?: PostStatus;
  value?: number;
  current: Timestamp;
}) => {
  switch (status) {
    case PostStatus.DRAFT:
      return null;

    case PostStatus.PUBLISHED:
      return current;

    case PostStatus.SCHEDULED:
      return value;

    case PostStatus.ARCHIVED:
      return null;

    default:
      return null;
  }
};

export const createPost = async (
  _: unknown,
  args: { post: Partial<Post> },
  { isAuthenticated }: { isAuthenticated: boolean }
): Promise<Post> => {
  if (!isAuthenticated) {
    throw new GraphQLError('You must be logged in to query this schema', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const { title, content, category, tags, banner, meta, status, scheduledAt } =
    args.post;
  const now = Timestamp.now();
  const publishedTime = setPublishedAt({
    status,
    value: scheduledAt,
    current: now,
  });
  const newPost = {
    title,
    content,
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
