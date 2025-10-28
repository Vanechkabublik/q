import {Controller, Get, Param} from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get('categories')
  async getCategories() {
    return this.templateService.getAllCategories();
  }

  @Get('templates')
  async getTemplates() {
    return this.templateService.getAllTemplates();
  }

  @Get('category/:categoryId')
  async getTemplatesByCategory(@Param('categoryId') categoryId: number) {
    return this.templateService.getTemplatesByCategory(categoryId);
  }
}
