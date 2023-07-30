import * as functions from 'firebase-functions';

import graphqlApp from './endpoints/graphql';
import uploadImageFile from './controllers/upload/image';
import { scheduledPostFunction } from './controllers/cronJobs/scheduledPost';

exports.graphql = functions
  .region('asia-southeast1')
  .https.onRequest(graphqlApp);

exports.scheduledPost = functions
  .region('asia-southeast1')
  .pubsub.schedule('0 8 * * *')
  .timeZone('Asia/Manila')
  .onRun(scheduledPostFunction);

exports.uploadImage = functions
  .region('asia-southeast1')
  .https.onRequest(uploadImageFile);
