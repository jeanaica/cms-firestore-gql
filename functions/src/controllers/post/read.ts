import { Post, PostAPI } from '../../types/post';
import { db } from '../../utils/firebase';

export const posts = async (): Promise<Post[]> => {
  const snapshot = await db.collection('posts').get();
  return snapshot.docs.map(
    doc =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toMillis(),
        updatedAt: doc.data()?.updatedAt?.toMillis(),
        publishedAt: doc.data()?.publishedAt?.toMillis(),
        scheduledAt: doc.data()?.scheduledAt?.toMillis(),
        archivedAt: doc.data()?.archivedAt?.toMillis(),
        meta: {
          ...doc.data()?.meta,
          publishedAt: doc.data()?.meta?.publishedAt?.toMillis(),
        },
      } as Post)
  );
};

export const post = async (
  _: unknown,
  args: { id: string }
): Promise<Post | undefined> => {
  const postDoc = await db.collection('posts').doc(args.id).get();

  const post = postDoc.data() as PostAPI;
  post.id = postDoc.id;

  if (postDoc.exists) {
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
  } else {
    console.log('No such document!');
    return undefined;
  }
};
