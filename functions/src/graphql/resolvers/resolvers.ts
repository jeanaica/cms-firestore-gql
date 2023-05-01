import categoryMutations from './category/mutation';
import categoryQueries from './category/query';
import postMutations from './post/mutation';
import postQueries from './post/query';
import tagMutations from './tag/mutation';
import tagQueries from './tag/query';

const resolvers = {
  Query: {
    ...postQueries,
    ...categoryQueries,
    ...tagQueries,
  },
  Mutation: {
    ...postMutations,
    ...categoryMutations,
    ...tagMutations,
  },
};

export default resolvers;
