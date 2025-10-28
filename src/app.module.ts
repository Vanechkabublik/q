import { Module } from '@nestjs/common';
import { GenerateModule } from './generate/generate.module';
import { StorageService } from './storage/storage.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import { ReplicateService } from './replicate/replicate.service';
import { TemplateModule } from './template/template.module';
import { AdminModule } from './admin/admin.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";
import {Template} from "./entities/template.entity";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    GenerateModule,
    TemplateModule,
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Category, Template],
      synchronize: true, // false для prod
    }),
    TypeOrmModule.forFeature([Category, Template])
  ],
  controllers: [],
  providers: [StorageService, ReplicateService],
})
export class AppModule {}
