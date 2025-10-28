import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Template } from './template.interface';

@Injectable()
export class TemplateService {
    private readonly templatesPath = join(process.cwd(), 'templates.json');

    findAll(): Template[] {
        try {
            const data = readFileSync(this.templatesPath, 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData.templates || [];
        } catch (error) {
            console.error('Error reading templates:', error);
            return [];
        }
    }

    findOne(id: string): Template | null {
        const templates = this.findAll();
        return templates.find(template => template.id === id) || null;
    }
}
