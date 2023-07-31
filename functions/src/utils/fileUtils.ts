import { File } from 'formidable-serverless';
import {
  ALLOWED_IMG_TYPES,
  MAXIMUM_FILE_SIZE,
} from '../constants/fileSpecifications';
import { ErrorMessages } from '../constants/errorMessages';

export const verifyFile = (
  file: File,
  maxFileSize: number = MAXIMUM_FILE_SIZE
): void => {
  if (!file || !ALLOWED_IMG_TYPES.includes(file.type)) {
    throw new Error(ErrorMessages.INVALID_FILE_TYPE);
  }
  if (file.size > maxFileSize) {
    throw new Error(ErrorMessages.FILE_TOO_LARGE);
  }
};
