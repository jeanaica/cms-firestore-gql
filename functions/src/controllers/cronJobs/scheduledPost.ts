import { logger } from 'firebase-functions';

import { scheduledPosts } from '../post/read';
import { publishScheduledPost } from '../post/update';

export const scheduledPostFunction = async (): Promise<void> => {
  try {
    const posts = await scheduledPosts();

    await Promise.all(posts.map(val => publishScheduledPost({ id: val.id })));

    logger.info('Posts Updated!');
  } catch (error) {
    logger.warn(`ERROR: ${error}`);
  }
};
