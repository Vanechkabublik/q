import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { GenerateService } from './generate.service';
import {StorageService} from "../storage/storage.service";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('generate')
export class GenerateController {
  constructor(
      private readonly generateService: GenerateService,
      private readonly storageService: StorageService
  ) {}

  @Post('from-template')
  @UseInterceptors(FileInterceptor('image'))
  async generateTemplate(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: { template_id: string }
  ) {

    if (!file) {
      throw new BadRequestException('User image is required');
    }
    if (!body.template_id) {
      throw new BadRequestException('Template ID is required');
    }

    const url = await this.storageService.upload(file);

    return this.generateService.generateFromTemplate({
      templateId: body.template_id,
      userImageUrl: url.url
    });
  }
}