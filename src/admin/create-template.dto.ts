// create-template.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    prompt: string;

    @IsNotEmpty()
    category_id: number;
}