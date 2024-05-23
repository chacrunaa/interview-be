import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { File } from "./file.model";

@Module({
  imports: [SequelizeModule.forFeature([File])],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
