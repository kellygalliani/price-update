import {
  Controller,
  Get,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express/multer';
import { UpdatepriceService } from './app.service';

@Controller('')
export class UpdatepriceController {
  constructor(private readonly updatepriceService: UpdatepriceService) {}

  @Get()
  findAll() {
    return this.updatepriceService.findAll();
  }

  @Patch('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.updatepriceService.update(file);
  }
}
