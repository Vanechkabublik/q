import { Injectable } from '@nestjs/common';
import {StoredFile} from "./stored-file-interface";
import {ReplicateService} from "../replicate/replicate.service";

@Injectable()
export class GenerateService {
    constructor(private readonly replicateService: ReplicateService) {
    }
    private async getTemplatePrompt(templateId: string): Promise<string> {
        const templates = {
            '1': 'Профессиональный портрет в деловом стиле',
            '2': 'Фэнтези персонаж с магическими элементами',
            '3': 'Художественный стиль картины с яркими цветами',
            '4': 'Поп-арт стиль с контрастными цветами',
            '5': 'Неоновый киберпанк с подсветкой',
            '6': 'Сказочный стиль с волшебными эффектами',
            '7': 'Ретро стиль 80-х годов',
            '8': 'Футуристический sci-fi стиль',
            '9': 'Аниме стиль с большими глазами',
            '10': 'Мрачный готический стиль',
            'default': 'Улучшить и преобразовать изображение сохраняя сходство'
        };

        return templates[templateId] || templates['default'];
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
