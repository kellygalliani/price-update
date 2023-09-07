import { BadRequestException, Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PrismaService } from 'src/database/prisma.service';
import { UpdatepriceController } from './app.controller';
import { UpdatepriceService } from './app.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './tmp',
        filename: (_, file, callback) => {
          callback(null, file.originalname);
        },
      }),
      fileFilter: (_, file, callback) => {
        if (file.mimetype === 'text/csv') {
          callback(null, true);
        } else {
          callback(new BadRequestException('Only csv format allowed'), false);
        }
      },
    }),
  ],
  controllers: [UpdatepriceController],
  providers: [UpdatepriceService, PrismaService],
})
export class AppModule {}
