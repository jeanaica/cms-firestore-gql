import { join } from 'node:path';
import { loadSchema } from '@graphql-tools/load';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { Request } from 'firebase-functions/v1';

import resolvers from '../graphql/resolvers/resolvers';
import { getUserIdFromGraphqlAuth } from './auth';
import { db } from './firebase';
import { GraphQLError } from 'graphql';

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
  });
  await server.start();

  return server;
}

export default main;
