import {BadRequestException, Injectable} from '@nestjs/common';
import {randomUUID} from "crypto";
import {join} from "path";
import {createWriteStream, existsSync, mkdirSync} from "fs";
import {StoredFile} from "../generate/stored-file-interface";

@Injectable()
export class StorageService {

    private readonly uploadPath = process.env.UPLOAD_PATH || './uploads';
    private readonly publicUrl = process.env.PUBLIC_URL || 'https://codematter.space/';

    constructor() {
        if (!existsSync(this.uploadPath)) {
            mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async upload(file: Express.Multer.File): Promise<StoredFile> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Only image files are allowed');
        }

        const fileExtension = file.originalname.split('.').pop();
        const filename = `${randomUUID()}.${fileExtension}`;
        const filepath = join(this.uploadPath, filename);

        return new Promise((resolve, reject) => {
            const writeStream = createWriteStream(filepath);

            writeStream.write(file.buffer);
            writeStream.end();

            writeStream.on('finish', () => {
                const storedFile: StoredFile = {
                    filename,
                    filepath,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    url: `${this.publicUrl}/uploads/${filename}`,
                };
                resolve(storedFile);
            });

            writeStream.on('error', (error) => {
                reject(new BadRequestException(`Failed to save file: ${error.message}`));
            });
        });
    }
}
