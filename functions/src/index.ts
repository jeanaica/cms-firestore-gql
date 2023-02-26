import * as functions from 'firebase-functions';
import express from 'express';
import main from './utils/graphql';

const app = express();

main().then(server => server.applyMiddleware({ app, path: '/' }));

exports.graphql = functions.region('asia-southeast1').https.onRequest(app);
