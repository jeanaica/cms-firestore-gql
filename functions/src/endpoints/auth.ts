import { Request, Response } from 'firebase-functions/v1';
import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

import { auth } from '../utils/firebase';

const authApp = express();

authApp.use(cors({ origin: true }));

authApp.post('/createTestTokenForUser', async (req: Request, res: Response) => {
  const { uid } = req.body;
  try {
    const token = await auth().createCustomToken(uid);
    const authResult = await axios.post(
      `http://localhost:9099/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${
        functions.config().config.token
      }`,
      {
        token,
        returnSecureToken: true,
      }
    );

    res.status(201).json({
      token: authResult.data.idToken,
      refreshToken: authResult.data.refreshToken,
      expiresIn: authResult.data.expiresIn,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.json({
      error: err.message,
    });
  }
  return;
});

export default authApp;
