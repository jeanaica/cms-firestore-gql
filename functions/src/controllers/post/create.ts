import * as admin from 'firebase-admin';
import { Post, PostAPI } from '../../types/post';
import { db } from '../../utils/firebase';

export const createPost = async (
  _: unknown,
  args: { post: Partial<Post> }
): Promise<Post> => {
  const { title, content, category, tags, banner, meta, status } = args.post;
  const now = admin.firestore.Timestamp.now();
  const newPost = {
    title,
    content,
    category,
    tags,
    banner,
    meta,
    status,
    createdAt: now,
    updatedAt: now,
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
      publishedAt: post?.meta?.publishedAt?.toMillis(),
    },
  } as Post;
};
