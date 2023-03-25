import * as functions from 'firebase-functions';
import authApp from './endpoints/auth';
import graphqlApp from './endpoints/graphql';

exports.graphql = functions
  .region('asia-southeast1')
  .https.onRequest(graphqlApp);

exports.auth = functions.region('asia-southeast1').https.onRequest(authApp);
