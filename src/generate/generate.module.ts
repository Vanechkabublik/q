import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import {StorageService} from "../storage/storage.service";
import {ReplicateService} from "../replicate/replicate.service";
import {ConfigModule} from "@nestjs/config";
import {TemplateService} from "../template/template.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    GenerateController
  ],
  providers: [GenerateService, StorageService, ReplicateService, TemplateService],
})
export class GenerateModule {}
