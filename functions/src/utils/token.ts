import { Request } from 'firebase-functions/v1';

import { auth } from './firebase';

async function getAuthToken(request: Request) {
  if (!request.headers.authorization) {
    return null;
  }
  const token = request.headers.authorization.replace(/^Bearer\s/, '');
  return token;
}

export async function getUserIdFromGraphqlAuth(
  request: Request
): Promise<string | null> {
  try {
    const token = await getAuthToken(request);

    if (token === null) {
      return null;
    }
    const payload = await auth().verifyIdToken(token);

    return payload.uid;
  } catch (err) {
    throw Error();
  }
}
