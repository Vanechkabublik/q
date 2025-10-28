import { Module } from '@nestjs/common';
import { GenerateModule } from './generate/generate.module';
import { StorageService } from './storage/storage.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import { ReplicateService } from './replicate/replicate.service';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    GenerateModule,
    TemplateModule
  ],
  controllers: [],
  providers: [StorageService, ReplicateService],
})
export class AppModule {}
