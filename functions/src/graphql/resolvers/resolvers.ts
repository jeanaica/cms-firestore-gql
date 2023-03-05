import postMutations from './post/mutation';
import postQueries from './post/query';

const resolvers = {
  Query: {
    ...postQueries,
  },
  Mutation: {
    ...postMutations,
  },
};

export default resolvers;
