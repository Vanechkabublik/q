import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "../entities/category.entity";
import {Template} from "../entities/template.entity";
import {Repository} from "typeorm";
import {CreateTemplateDto} from "./create-template.dto";
import {UpdateTemplateDto} from "./update-template.dto";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,

        @InjectRepository(Template)
        private templateRepository: Repository<Template>,
    ) {}

    async createCategory(title: string) {
        const existingCategory = await this.categoryRepository.findOne({
            where: { title }
        });

        if (existingCategory) {
            throw new BadRequestException(`Category "${title}" already exists`);
        }

        const category = this.categoryRepository.create({ title });
        const createcategory = await this.categoryRepository.save(category);
        return {
            data: createcategory,
            message: "Category created",
        }
    }

    async createTemplate(data: CreateTemplateDto, url: string){
        const { title, prompt, category_id } = data;
        const category = await this.categoryRepository.findOne({
            where: { id: category_id }
        });

        if (!category) {
            throw new BadRequestException(`Category with id ${category_id} not found`);
        }

        const template = this.templateRepository.create({
            title,
            prompt,
            category_id,
            preview_url: url
        });

        const savedTemplate = await this.templateRepository.save(template);

        return savedTemplate;
    }

    async updateTemplate(
        id: number,
        updateData: UpdateTemplateDto,
        previewUrl?: string
    ): Promise<Template> {

        const template = await this.templateRepository.findOne({ where: { id } });

        if (!template) {
            throw new BadRequestException(`Template with id ${id} not found`);
        }

        // Проверяем существование категории если передана
        if (updateData.category_id !== undefined) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateData.category_id }
            });
            if (!category) {
                throw new BadRequestException(`Category with id ${updateData.category_id} not found`);
            }
        }

        if (previewUrl) {
            updateData.preview_url = previewUrl;
        }

        await this.templateRepository.update(id, updateData);

        const updatedTemplate = await this.templateRepository.findOne({
            where: { id },
            relations: ['category']
        });

        if (!updatedTemplate) {
            throw new BadRequestException(`Template with id ${id} not found after update`);
        }

        return updatedTemplate;
    }
}
