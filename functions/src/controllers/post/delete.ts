import { Post } from '../../types/post';
import { db } from '../../utils/firebase';

export const deletePost = async (
  _: unknown,
  args: { id: string }
): Promise<Post | undefined> => {
  const postRef = db.collection('posts').doc(args.id);
  const postDoc = await postRef.get();
  if (postDoc.exists) {
    const post = postDoc.data() as Post;
    await postRef.delete();
    post.id = postDoc.id;
    return post;
  } else {
    console.log('No such document!');
    return undefined;
  }
};
