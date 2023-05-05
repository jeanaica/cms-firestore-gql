import { OrderByDirection } from 'firebase-admin/firestore';
import { Post, PostAPI } from '../../types/post';
import { db } from '../../utils/firebase';

export const posts = async (
  _: unknown,
  args: { status: string; sort?: string }
): Promise<Post[]> => {
  const collection = db.collection('posts');
  const sortOrder = (
    args.sort ? args.sort.toLowerCase() : 'desc'
  ) as OrderByDirection;
  let query;

  // Check if a status filter is provided
  if (args.status) {
    query = collection.where('status', '==', args.status.toUpperCase());
  } else {
    query = collection;
  }

  // Apply sorting based on sortOrder
  query = query.orderBy('updatedAt', sortOrder);

  const snapshot = await query.get();

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
