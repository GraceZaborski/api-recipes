import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyFileInterceptor } from '../interceptors/fastifyFile.interceptor';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ACL, AuthContext } from '@cerbero/mod-auth';

@ApiTags('unlayer')
@ApiSecurity('api_key')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FastifyFileInterceptor('image', {
      storage: diskStorage({ destination: '/tmp' }),
      fileFilter: (req: Request, file: Express.Multer.File, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  @ACL('templates/template:create')
  async uploadImage(
    @AuthContext() { companyId },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException();
    }

    return this.uploadService.uploadImage(companyId, file);
  }
}
