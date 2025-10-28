import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "../entities/category.entity";
import {Template} from "../entities/template.entity";
import {Repository} from "typeorm";
import {CreateTemplateDto} from "./create-template.dto";

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
}
