import { Post, PostAPI } from '../../types/post';
import { db } from '../../utils/firebase';

export const posts = async (
  _: unknown,
  args: { status: string }
): Promise<Post[]> => {
  const collection = db.collection('posts');
  let snapshot;

  if (args.status) {
    snapshot = await collection
      .where('status', '==', args.status.toUpperCase())
      .get();
  } else {
    snapshot = await collection.get();
  }

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
          updatedAt: doc.data()?.meta?.updatedAt?.toMillis(),
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
        updatedAt: post?.meta?.updatedAt?.toMillis(),
        publishedAt: post?.meta?.publishedAt?.toMillis(),
      },
    } as Post;
  } else {
    console.log('No such document!');
    return undefined;
  }
};
