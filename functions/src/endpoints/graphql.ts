import express from 'express';
import main from '../utils/graphql';

const graphqlApp = express();

main().then(server =>
  server.applyMiddleware({ app: graphqlApp, path: '/', cors: true })
);

export default graphqlApp;
