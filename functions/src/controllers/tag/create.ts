import { GraphQLError } from 'graphql';
import { FieldPath } from 'firebase-admin/firestore';

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
    const upperCaseTag = args.tag.toUpperCase();

    const existingTagSnapshot = await tagRef
      .where(FieldPath.documentId(), '==', upperCaseTag)
      .get();

    if (existingTagSnapshot.empty) {
      await tagRef.doc(upperCaseTag).set({
        id: upperCaseTag,
      });

      return {
        id: upperCaseTag,
        label: toTitleCase(args.tag),
        value: upperCaseTag,
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
