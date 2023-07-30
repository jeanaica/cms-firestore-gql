import { OrderByDirection } from 'firebase-admin/firestore';
import { Post, PostAPI } from '../../types/post';
import { db } from '../../utils/firebase';
import { timeValue } from './helper';

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

  return snapshot.docs.map(doc => {
    const docData = doc.data();

    return {
      id: doc.id,
      ...docData,
      createdAt: timeValue(docData?.createdAt),
      updatedAt: timeValue(docData?.updatedAt),
      publishedAt: timeValue(docData?.publishedAt),
      firstPublishedAt: timeValue(docData?.firstPublishedAt),
      scheduledAt: timeValue(docData?.scheduledAt),
      archivedAt: timeValue(docData?.archivedAt),
      meta: {
        ...docData?.meta,
        updatedAt: timeValue(docData?.meta?.updatedAt),
        publishedAt: timeValue(docData?.meta?.publishedAt),
      },
    } as Post;
  });
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
      createdAt: timeValue(post?.createdAt),
      updatedAt: timeValue(post?.updatedAt),
      publishedAt: timeValue(post?.publishedAt),
      firstPublishedAt: timeValue(post?.firstPublishedAt),
      scheduledAt: timeValue(post?.scheduledAt),
      archivedAt: timeValue(post?.archivedAt),
      meta: {
        ...post?.meta,
        updatedAt: timeValue(post?.meta?.updatedAt),
        publishedAt: timeValue(post?.meta?.publishedAt),
      },
    } as Post;
  } else {
    console.log('No such document!');
    return undefined;
  }
};

export const postSlug = async (
  _: unknown,
  args: { slug: string }
): Promise<Post | undefined> => {
  const postDoc = await db
    .collection('posts')
    .where('meta.slug', '==', args.slug.toLowerCase())
    .where('status', '==', 'PUBLISHED')
    .get();

  if (postDoc.empty) {
    console.log('No such document!');
    return undefined;
  }

  const post = postDoc.docs[0].data() as PostAPI;
  post.id = postDoc.docs[0].id;

  return {
    ...post,
    createdAt: timeValue(post?.createdAt),
    updatedAt: timeValue(post?.updatedAt),
    publishedAt: timeValue(post?.publishedAt),
    firstPublishedAt: timeValue(post?.firstPublishedAt),
    scheduledAt: timeValue(post?.scheduledAt),
    archivedAt: timeValue(post?.archivedAt),
    meta: {
      ...post?.meta,
      updatedAt: timeValue(post?.meta?.updatedAt),
      publishedAt: timeValue(post?.meta?.publishedAt),
    },
  } as Post;
};

export const scheduledPosts = async (): Promise<Post[]> => {
  const collection = db.collection('posts');

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const query = collection
    .where('status', '==', 'SCHEDULED')
    .where('scheduledAt', '>=', startOfToday)
    .where('scheduledAt', '<=', endOfToday);

  const snapshot = await query.get();

  return snapshot.docs.map(doc => {
    return {
      id: doc.id,
    } as Post;
  });
};
