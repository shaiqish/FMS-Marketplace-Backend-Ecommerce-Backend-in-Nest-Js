// src/common/interceptors/file-upload.utils.ts
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export function ProductImageUploadInterceptor() {
  return FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|gif)$/)) {
        return cb(
          new BadRequestException('Only image files are allowed!'),
          false,
        );
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
}
