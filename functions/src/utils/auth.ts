import { Request, Response } from 'firebase-functions/v1';
import axios from 'axios';

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
    const payload = await auth.verifyIdToken(token);
    return payload.uid;
  } catch (err) {
    return null;
  }
}

export const createTokenForDev = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid } = req.body;
  try {
    const token = await auth.createCustomToken(uid);
    const authResult = await axios.post(
      `http://localhost:9099/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_TOKEN}`,
      {
        token,
        returnSecureToken: true,
      }
    );
    res.status(201).json({
      token: authResult.data.idToken,
    });
  } catch (err: any) {
    res.json({
      error: err.message,
    });
  }
  return;
};
