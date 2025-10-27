// dto/generate-image.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class GenerateImageDto {
    @IsString()
    prompt: string;

    @IsOptional()
    @IsString()
    aspect_ratio?: string;

    @IsOptional()
    @IsString()
    @IsIn(['jpg', 'png', 'webp'])
    output_format?: string;
}