import { join } from 'node:path';
import { loadSchema } from '@graphql-tools/load';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { Request, config } from 'firebase-functions/v1';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

import resolvers from '../graphql/resolvers/resolvers';
import { getUserIdFromGraphqlAuth } from './token';

async function main(): Promise<
  ApolloServer<{
    req: Request;
  }>
> {
  const schema = await loadSchema(
    join(__dirname, '../graphql/schema/schema.graphql'),
    {
      loaders: [new GraphQLFileLoader()],
    }
  );
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    context: async ({ req }: { req: Request }) => {
      try {
        const userId = await getUserIdFromGraphqlAuth(req);

        return { isAuthenticated: !!userId };
      } catch (error) {
        return { isAuthenticated: false };
      }
    },
    introspection: config().config.env !== 'production',
    cache: 'bounded',
    plugins: [
      // for production environment disable playground
      config().config.env === 'production'
        ? // eslint-disable-next-line new-cap
          ApolloServerPluginLandingPageDisabled()
        : // for staging environment playground
        config().config.env === 'staging'
        ? // eslint-disable-next-line new-cap
          ApolloServerPluginLandingPageGraphQLPlayground()
        : // for development playground
          // eslint-disable-next-line new-cap
          ApolloServerPluginLandingPageLocalDefault(),
    ],
  });
  await server.start();

  return server;
}

export default main;
