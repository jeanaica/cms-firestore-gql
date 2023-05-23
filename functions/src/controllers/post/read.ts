import { OrderByDirection } from 'firebase-admin/firestore';
import { Post, PostAPI } from '../../types/post';
import { db } from '../../utils/firebase';

export const posts = async (
  _: unknown,
  args: { status: string; sort?: string }
): Promise<Post[]> => {
  const collection = db().collection('posts');
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
      ...doc.data(),
      createdAt: docData?.createdAt?.toMillis
        ? docData.createdAt.toMillis()
        : null,
      updatedAt: docData?.updatedAt?.toMillis
        ? docData.updatedAt.toMillis()
        : null,
      publishedAt: docData?.publishedAt?.toMillis
        ? docData.publishedAt.toMillis()
        : null,
      scheduledAt: docData?.scheduledAt?.toMillis
        ? docData.scheduledAt.toMillis()
        : null,
      archivedAt: docData?.archivedAt?.toMillis
        ? docData.archivedAt.toMillis()
        : null,
      meta: {
        ...docData?.meta,
        updatedAt: docData?.meta?.updatedAt?.toMillis
          ? docData.meta.updatedAt.toMillis()
          : null,
        publishedAt: docData?.meta?.publishedAt?.toMillis
          ? docData.meta.publishedAt.toMillis()
          : null,
      },
    } as Post;
  });
};

export const post = async (
  _: unknown,
  args: { id: string }
): Promise<Post | undefined> => {
  const postDoc = await db().collection('posts').doc(args.id).get();

  const post = postDoc.data() as PostAPI;
  post.id = postDoc.id;

  if (postDoc.exists) {
    return {
      ...post,
      createdAt: post?.createdAt?.toMillis ? post.createdAt.toMillis() : null,
      updatedAt: post?.updatedAt?.toMillis ? post.updatedAt.toMillis() : null,
      publishedAt: post?.publishedAt?.toMillis
        ? post.publishedAt.toMillis()
        : null,
      scheduledAt: post?.scheduledAt?.toMillis
        ? post.scheduledAt.toMillis()
        : null,
      archivedAt: post?.archivedAt?.toMillis
        ? post.archivedAt.toMillis()
        : null,
      meta: {
        ...post?.meta,
        updatedAt: post?.meta?.updatedAt?.toMillis
          ? post.meta.updatedAt.toMillis()
          : null,
        publishedAt: post?.meta?.publishedAt?.toMillis
          ? post.meta.publishedAt.toMillis()
          : null,
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
  const postDoc = await db()
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
    createdAt: post?.createdAt?.toMillis ? post.createdAt.toMillis() : null,
    updatedAt: post?.updatedAt?.toMillis ? post.updatedAt.toMillis() : null,
    publishedAt: post?.publishedAt?.toMillis
      ? post.publishedAt.toMillis()
      : null,
    scheduledAt: post?.scheduledAt?.toMillis
      ? post.scheduledAt.toMillis()
      : null,
    archivedAt: post?.archivedAt?.toMillis ? post.archivedAt.toMillis() : null,
    meta: {
      ...post?.meta,
      updatedAt: post?.updatedAt?.toMillis ? post.updatedAt.toMillis() : null,
      publishedAt: post?.publishedAt?.toMillis
        ? post.publishedAt.toMillis()
        : null,
    },
  } as Post;
};
