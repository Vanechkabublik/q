import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "../entities/category.entity";
import {Template} from "../entities/template.entity";

@Module({
  imports: [    TypeOrmModule.forFeature([Category, Template])],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
