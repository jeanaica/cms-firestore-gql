import * as functions from 'firebase-functions';
import express from 'express';

import main from './utils/graphql';
import { createTokenForDev } from './utils/auth';

const app = express();

main().then(server => server.applyMiddleware({ app, path: '/', cors: true }));

exports.graphql = functions.region('asia-southeast1').https.onRequest(app);

exports.createTestTokenForUser = functions.https.onRequest(createTokenForDev);
