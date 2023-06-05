import * as functions from 'firebase-functions';

import graphqlApp from './endpoints/graphql';
import { scheduledPosts } from './controllers/post/read';
import { publishScheduledPost } from './controllers/post/update';

exports.graphql = functions
  .region('asia-southeast1')
  .https.onRequest(graphqlApp);

exports.scheduledPost = functions
  .region('asia-southeast1')
  .pubsub.schedule('0 8 * * *')
  .timeZone('Asia/Manila')
  .onRun(async () => {
    try {
      const posts = await scheduledPosts();

      await Promise.all(posts.map(val => publishScheduledPost({ id: val.id })));

      functions.logger.info('Posts Updated!');
    } catch (error) {
      // NOOP
      functions.logger.warn(`ERROR: ${error}`);
    }

    return null;
  });
