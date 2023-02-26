import fetchAllPosts from '../../controllers/post/read';

const resolvers = {
  Query: {
    posts: () => {
      return new Promise((resolve, reject) => {
        fetchAllPosts(data => {
          resolve(data);
        });
      });
    },
  },
};

export default resolvers;
