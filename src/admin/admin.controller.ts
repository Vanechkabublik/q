import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {AdminGuard} from "./admin.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {StorageService} from "../storage/storage.service";
import {CreateTemplateDto} from "./create-template.dto";

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
      private readonly adminService: AdminService,
      private readonly storageService: StorageService,
  ) {}

  @HttpCode(200)
  @Post('/newcategory')
  async newcategory(@Body() body: { title: string }) {
    return this.adminService.createCategory(body.title)
  }

  @Post('/newtemplate')
  @UseInterceptors(FileInterceptor('preview'))
  async newtemplate(
      @Body() data: CreateTemplateDto,
      @UploadedFile() preview: Express.Multer.File
  ) {
    if (!preview) {
      throw new BadRequestException('Preview image is required');
    }
    const url = await this.storageService.upload(preview);
    return this.adminService.createTemplate(data, url.url);
  }
}
