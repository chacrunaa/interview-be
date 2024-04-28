import { Module } from "@nestjs/common";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Company } from "./companies.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [SequelizeModule.forFeature([Company]), AuthModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
