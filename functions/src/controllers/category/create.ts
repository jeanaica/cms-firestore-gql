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

    if (!existingCategory.exists) {
      await existingCategoryRef.set({
        id: args.category,
      });

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
