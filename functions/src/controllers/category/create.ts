import { GraphQLError } from 'graphql';
import { db } from '../../utils/firebase';
import Category from '../../types/category';
import toTitleCase from '../../utils/toTitleCase';

export const createCategory = async (
  _: unknown,
  args: { category: string },
  { isAuthenticated }: { isAuthenticated: boolean }
): Promise<Category> => {
  if (!isAuthenticated) {
    throw new GraphQLError('You must be logged in to query this schema', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  try {
    const categoryRef = db.collection('categories');
    const existingCategoryRef = categoryRef.doc(args.category);
    const existingCategory = await existingCategoryRef.get();

    const tagRef = db.collection('tags');
    const existingTagRef = tagRef.doc(args.category);
    const existingTag = await existingTagRef.get();

    if (!existingCategory.exists) {
      await existingCategoryRef.set({
        id: args.category,
        notRemovable: true,
      });

      if (!existingTag.exists) {
        await existingTagRef.set({
          id: args.category,
          notRemovable: true,
        });
      } else {
        throw new Error('Tag already exists');
      }

      return {
        id: args.category,
        label: toTitleCase(args.category),
        value: args.category,
      };
    } else {
      throw new Error('Category already exists');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
