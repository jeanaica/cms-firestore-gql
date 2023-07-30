import Category from '../../types/category';
import { db } from '../../utils/firebase';
import toTitleCase from '../../utils/toTitleCase';

export const categories = async (): Promise<Category[]> => {
  try {
    const categoriesSnapshot = await db.collection('categories').get();

    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      label: toTitleCase(doc.id),
      value: doc.id,
      notRemovable: doc.data().notRemovable,
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
