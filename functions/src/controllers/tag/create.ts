import { GraphQLError } from 'graphql';
import { db } from '../../utils/firebase';
import Tag from '../../types/tag';
import toTitleCase from '../../utils/toTitleCase';

export const createTag = async (
  _: unknown,
  args: { tag: string },
  { isAuthenticated }: { isAuthenticated: boolean }
): Promise<Tag> => {
  if (!isAuthenticated) {
    throw new GraphQLError('You must be logged in to query this schema', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  try {
    const tagRef = db.collection('tags');
    const existingTagRef = tagRef.doc(args.tag);
    const existingTag = await existingTagRef.get();

    if (!existingTag.exists) {
      await existingTagRef.set({
        id: args.tag,
      });

      return {
        id: args.tag,
        label: toTitleCase(args.tag),
        value: args.tag,
      };
    } else {
      throw new Error('Tag already exists');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
