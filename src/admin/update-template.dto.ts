// update-template.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTemplateDto {

    @IsString()
    title?: string;


    @IsString()
    prompt?: string;


    @IsString()
    category_id?: number;

    @IsOptional()
    @IsString()
    preview_url?: string;
}