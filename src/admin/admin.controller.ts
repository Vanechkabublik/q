import {
  BadRequestException,
  Body,
  Controller, Get,
  HttpCode, HttpException, Param,
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
import {TemplateService} from "../template/template.service";
import {UpdateTemplateDto} from "./update-template.dto";
import * as url from "node:url";

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
      private readonly adminService: AdminService,
      private readonly storageService: StorageService,
      private readonly templateService: TemplateService,
  ) {}

  @HttpCode(200)
  @Get('templates/:id')
  async getTemplate(@Param('id') id: number) {
    return this.templateService.findOne(id);
  }

  @HttpCode(200)
  @Post('/newcategory')
  async newcategory(@Body() body: { title: string }) {
    if(!body.title) {
      throw new BadRequestException('Please enter a title');
    }
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
    const url = await this.storageService.upload(preview, true);
    return this.adminService.createTemplate(data, url.url);
  }

  @HttpCode(200)
  @Post('/update/:id')
  @UseInterceptors(FileInterceptor('preview'))
  async updateTemplate(
      @Param('id') id: number,
      @Body() data: UpdateTemplateDto,
      @UploadedFile() preview?: Express.Multer.File
  ) {
    let previewUrl: string | undefined;

    if (preview) {
      const storedFile = await this.storageService.upload(preview, true);
      previewUrl = storedFile.url;
    }

    return this.adminService.updateTemplate(id, data, previewUrl);
  }
}
