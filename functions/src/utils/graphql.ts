import { join } from 'node:path';
import { loadSchema } from '@graphql-tools/load';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import resolvers from '../graphql/resolvers/post';

async function main() {
  const schema = await loadSchema(
    join(__dirname, '../graphql/schema/schema.graphql'),
    {
      loaders: [new GraphQLFileLoader()],
    }
  );
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
  });
  await server.start();

  return server;
}

export default main;
