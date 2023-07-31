import { Response } from 'firebase-functions/v1';

export interface SuccessResponse {
  data?: any;
  message?: string;
}

export const handleSuccessResponse = (
  res: Response,
  response: SuccessResponse,
  statusCode: number = 200
): void => {
  const { data, message } = response;
  res.status(statusCode).json({ status: 'success', data, message });
};
