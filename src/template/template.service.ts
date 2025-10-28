import {BadRequestException, Injectable} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import {Category} from "../entities/category.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Template} from "../entities/template.entity";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,

        @InjectRepository(Template)
        private templateRepository: Repository<Template>,
    ) {}

    async getAllCategories(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async getAllTemplates(): Promise<Template[]> {
        return await this.templateRepository.find({
            relations: ['category'] // если нужна информация о категории
        });
    }

    async getTemplatesByCategory(categoryId: number): Promise<Template[]> {
        return await this.templateRepository.find({
            where: { category_id: categoryId },
            relations: ['category']
        });
    }

    async findOne(id: number): Promise<Template> {
        const template = await this.templateRepository.findOne({
            where: { id },
            relations: ['category']
        });

        if (!template) {
            throw new BadRequestException(`Template with id ${id} not found`);
        }

        return template;
    }
}
