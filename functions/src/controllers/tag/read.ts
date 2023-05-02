import Tag from '../../types/tag';
import { db } from '../../utils/firebase';
import toTitleCase from '../../utils/toTitleCase';

export const tags = async (): Promise<Tag[]> => {
  try {
    const tagsSnapshot = await db.collection('tags').get();

    return tagsSnapshot.docs.map(doc => ({
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
