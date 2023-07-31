import formidable, { Fields, Files } from 'formidable-serverless';
import { Request, Response } from 'firebase-functions/v1';
import { UploadResponse } from '@google-cloud/storage';
import uuid from 'uuid-v4';

import { dbStorage } from '../../utils/firebase';
import { verifyFile } from '../../utils/fileUtils';
import { handleErrorResponse } from '../../utils/errorHandler';
import { handleSuccessResponse } from '../../utils/successHandler';
import { SuccessMessages } from '../../constants/successMessages';
import { MAXIMUM_IMG_SIZE } from '../../constants/fileSpecifications';

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

    verifyFile(file, MAXIMUM_IMG_SIZE);

    const uploadResp = await uploadFileToStorage(file, folder, uuidToken);
    const downloadUrl = generateDownloadUrl(uploadResp, uuidToken);

    handleSuccessResponse(res, {
      data: {
        fileInfo: uploadResp[0].metadata,
        downloadUrl,
      },
      message: SuccessMessages.FILE_UPLOADED_SUCCESSFULLY,
    });

    return;
  } catch (err) {
    handleErrorResponse(err, res);
    return;
  }
};

export default uploadImageFile;
