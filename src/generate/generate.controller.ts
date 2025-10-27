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
import {GenerateImageDto} from "./dto/generate-image.dto";

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
    // const url = "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_68d6905efe9a410665ba7f5c_68d6906264a0d91b3f4085ba/scale_1200";

    return this.generateService.generateFromTemplate({
      templateId: body.template_id,
      userImageUrl: url.url
    });
  }

  @Post('from-prompt')
  @UseInterceptors(FileInterceptor('image')) // image - опциональное поле
  async generateFromPrompt(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: GenerateImageDto
  ) {
    if (!body.prompt) {
      throw new BadRequestException('Prompt is required');
    }

    let imageUrl: string | undefined;

    if (file) {
      const url = await this.storageService.upload(file);
      imageUrl = url.url;
    }

    return this.generateService.generateFromPrompt({
      prompt: body.prompt,
      imageUrl: imageUrl,
      aspectRatio: body.aspect_ratio,
      outputFormat: body.output_format
    });
  }
}