import { GraphQLError } from 'graphql';
import { FieldPath } from 'firebase-admin/firestore';

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
    const upperCaseCategory = args.category.toUpperCase();
    const categoryRef = db().collection('categories');

    const existingCategorySnapshot = await categoryRef
      .where(FieldPath.documentId(), '==', upperCaseCategory)
      .get();

    const tagRef = db().collection('tags');
    const existingTagSnapshot = await tagRef
      .where(FieldPath.documentId(), '==', upperCaseCategory)
      .get();

    if (existingCategorySnapshot.empty) {
      await categoryRef.doc(upperCaseCategory).set({
        id: upperCaseCategory,
        notRemovable: true,
      });

      if (existingTagSnapshot.empty) {
        await tagRef.doc(upperCaseCategory).set({
          id: upperCaseCategory,
          notRemovable: true,
        });
      } else {
        throw new Error('Tag already exists');
      }

      return {
        id: upperCaseCategory,
        label: toTitleCase(args.category),
        value: upperCaseCategory,
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
