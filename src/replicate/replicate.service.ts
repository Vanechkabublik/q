// replicate.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReplicateService {
    constructor(private readonly configService: ConfigService) {}

    async generateImageFromTemplate(
        templatePrompt: string,
        userImageUrl: string,
        aspectRatio: string = 'match_input_image',
        outputFormat: string = 'jpg'
    ): Promise<string> {
        const replicateApiToken = this.configService.get<string>('REPLICATE_API_TOKEN');

        if (!replicateApiToken) {
            throw new HttpException(
                'REPLICATE_API_TOKEN is not configured',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        try {
            const response = await fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${replicateApiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    version: "google/nano-banana",
                    input: {
                        prompt: templatePrompt,
                        image_input: [userImageUrl],
                        aspect_ratio: aspectRatio,
                        output_format: outputFormat
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error details:', errorData);
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const predictionId = data.id;
            const result = await this.waitForPrediction(predictionId, replicateApiToken);

            return result;

        } catch (error) {
            console.error('Replicate API error:', error);
            throw new HttpException(
                `Image generation failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async waitForPrediction(predictionId: string, token: string): Promise<string> {
        const maxAttempts = 30;
        const delay = 2000;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, delay));

            const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                headers: {
                    'Authorization': `Token ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get prediction status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'succeeded') {
                // Для nano-banana output это строка, а не массив!
                return data.output; // Просто возвращаем строку
            } else if (data.status === 'failed') {
                throw new Error(`Prediction failed: ${data.error}`);
            }
        }

        throw new Error('Prediction timeout');
    }
}