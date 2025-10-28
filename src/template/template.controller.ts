import {Controller, Get, Param} from '@nestjs/common';
import { TemplateService } from './template.service';
import {Template} from "./template.interface";

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  findAll(): Template[] {
    return this.templateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Template | { message: string } {
    const template = this.templateService.findOne(id);
    if (!template) {
      return { message: 'Template not found' };
    }
    return template;
  }
}
