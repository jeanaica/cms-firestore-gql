import { Post } from '../../types/post';
import { db } from '../../utils/firebase';

export const fetchAllPosts = async (
  callback: (posts: Post[]) => void
): Promise<void> => {
  const snapshot = await db.collection('posts').get();
  const posts: Post[] = [];
  snapshot.forEach(doc => {
    console.log('Adding...');
    posts.push({
      id: doc.id,
      ...doc.data(),
    } as Post);
  });
  callback(posts);
};

export default fetchAllPosts;
