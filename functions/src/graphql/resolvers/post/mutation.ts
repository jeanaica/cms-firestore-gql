import { createPost } from '../../../controllers/post/create';
import { deletePost } from '../../../controllers/post/delete';
import { updatePost } from '../../../controllers/post/update';

const postMutations = {
  createPost,
  updatePost,
  deletePost,
};

export default postMutations;
