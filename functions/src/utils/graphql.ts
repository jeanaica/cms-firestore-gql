import { join } from 'node:path';
import { loadSchema } from '@graphql-tools/load';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { Request } from 'firebase-functions/v1';
import { GraphQLError } from 'graphql';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';

import resolvers from '../graphql/resolvers/resolvers';
import { getUserIdFromGraphqlAuth } from './token';
import { db } from './firebase';

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
      const userId = await getUserIdFromGraphqlAuth(req);

      if (!userId)
        throw new GraphQLError('you must be logged in to query this schema', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });

      return {
        userId,
        db,
      };
    },
    introspection: process.env.NODE_ENV !== 'production',
    cache: 'bounded',
    plugins: [
      process.env.NODE_ENV === 'production'
        ? // eslint-disable-next-line new-cap
          ApolloServerPluginLandingPageGraphQLPlayground()
        : // eslint-disable-next-line new-cap
          ApolloServerPluginLandingPageLocalDefault(),
    ],
  });
  await server.start();

  return server;
}

export default main;
