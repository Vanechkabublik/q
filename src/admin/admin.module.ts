import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "../entities/category.entity";
import {Template} from "../entities/template.entity";
import {StorageService} from "../storage/storage.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Category, Template])
  ],
  controllers: [AdminController],
  providers: [AdminService, StorageService],
})
export class AdminModule {}
