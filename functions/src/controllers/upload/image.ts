import formidable, { Fields, Files } from 'formidable-serverless';
import { Request, Response } from 'firebase-functions/v1';
import { UploadResponse } from '@google-cloud/storage';
import uuid from 'uuid-v4';

import { dbStorage } from '../../utils/firebase';
import { imageFileTypes } from '../../constants/fileTypes';

const parseForm = (req: Request): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err: Error, fields: Fields, files: Files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
};

const uploadFileToStorage = async (
  file: { name: string; path: string; type: string },
  folder: string,
  uuidToken: string
) => {
  const uniqueFilename = `${new Date().getTime()}-${file.name}`;
  const filePath = `${folder}/${uniqueFilename}`;

  const uploadResp = await dbStorage.bucket().upload(file.path, {
    destination: filePath,
    contentType: file.type,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: uuidToken,
      },
    },
  });

  return uploadResp;
};

const generateDownloadUrl = (uploadResp: UploadResponse, uuidToken: string) => {
  const fullMediaLink = uploadResp[0].metadata.mediaLink + '';
  const mediaLinkPath = fullMediaLink.substring(
    0,
    fullMediaLink.lastIndexOf('/') + 1
  );
  const downloadUrl =
    mediaLinkPath +
    encodeURIComponent(uploadResp[0].name) +
    '?alt=media&token=' +
    uuidToken;

  return downloadUrl;
};

const uploadImageFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuidToken = uuid();
    const { fields, files } = await parseForm(req);

    const file = files.file;
    const { folder } = fields;

    if (!file || !imageFileTypes.includes(file.type)) {
      throw new Error('no file to upload, please choose a file.');
    }

    const uploadResp = await uploadFileToStorage(file, folder, uuidToken);
    const downloadUrl = generateDownloadUrl(uploadResp, uuidToken);

    res.status(200).json({ fileInfo: uploadResp[0].metadata, downloadUrl });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'no file to upload, please choose a file.') {
        res
          .status(400)
          .json({ error: 'No file to upload or file type is invalid' });
      } else {
        res
          .status(500)
          .json({ error: 'An error occurred while uploading the file' });
      }
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export default uploadImageFile;
