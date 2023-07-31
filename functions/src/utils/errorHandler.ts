import { Response } from 'firebase-functions/v1';
import { ErrorMessages } from '../constants/errorMessages';

export const handleErrorResponse = (err: unknown, res: Response): void => {
  if (err instanceof Error) {
    switch (err.message) {
      case ErrorMessages.INVALID_FILE_TYPE:
        res.status(400).json({ error: err.message });
        break;
      case ErrorMessages.FILE_TOO_LARGE:
        res.status(413).json({ error: err.message });
        break;
      default:
        res.status(500).json({ error: ErrorMessages.UNEXPECTED_ERROR });
    }
  } else {
    res.status(500).json({ error: ErrorMessages.UNEXPECTED_ERROR });
  }
};
