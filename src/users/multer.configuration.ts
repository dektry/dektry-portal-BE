import * as mime from 'mime-types';
import { ConflictException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const uploadAvatarConfiguration = {
  storage: diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, 'upload/img/avatars');
    },
    filename: function (_req, file, cb) {
      const ext = mime.extension(file.mimetype);
      cb(null, `${Date.now()}.${ext}`);
    },
  }),
  limits: {
    fileSize: 2000000,
  },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new ConflictException('Only .png, .jpg and .jpeg format allowed!'),
        false,
      );
    }
  },
};
