import { Injectable } from '@nestjs/common';
import {StoredFile} from "./stored-file-interface";
import {ReplicateService} from "../replicate/replicate.service";
import {TemplateService} from "../template/template.service";

@Injectable()
export class GenerateService {
    constructor(
        private readonly replicateService: ReplicateService,
        private readonly templatesService: TemplateService
    ) {
    }
    private async getTemplatePrompt(templateId: string): Promise<string> {
        const template = this.templatesService.findOne(templateId);

        if (template) {
            return template.prompt;
        }

        return 'Улучшить и преобразовать изображение сохраняя сходство';
    }
    async generateFromTemplate(
        data: {
            templateId: string;
            userImageUrl: string;
        }
    ): Promise<{ generatedImage: string; imageUrl: string }> {
        const templatePrompt = await this.getTemplatePrompt(data.templateId);

        const imageUrl = data.userImageUrl;

        const generatedImage = await this.replicateService.generateImageFromTemplate(
            templatePrompt,
            imageUrl
        );

        return { generatedImage, imageUrl };
    }
    async generateFromPrompt(data: {
        prompt: string;
        imageUrl?: string;  // теперь принимаем готовый URL, а не File
        aspectRatio?: string;
        outputFormat?: string;
    }) {
        // Вызываем Replicate service напрямую с URL
        const result = await this.replicateService.generateImageFromPrompt(
            data.prompt,
            data.imageUrl,  // передаем готовый URL
            data.aspectRatio || 'match_input_image',
            data.outputFormat || 'jpg'
        );

        return {
            success: true,
            image_url: result,
            prompt: data.prompt,
            has_input_image: !!data.imageUrl  // проверяем наличие URL
        };
    }
}
