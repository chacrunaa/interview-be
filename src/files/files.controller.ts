import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { File } from "./file.model";

import * as crypto from "crypto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CustomException } from "src/common/error-handling/custom-exception";
import { CreateFileDto } from "src/files/dto/createFileDto";
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @ApiOperation({ summary: "Загрузка видео файлов" })
  @ApiResponse({
    status: 201,
    description: "Файлы успешно загружены",
    type: [File],
  })
  @ApiResponse({ status: 400, description: "Некорректный запрос" })
  @ApiBody({ type: CreateFileDto })
  @UseInterceptors(FilesInterceptor("file", 10))
  async uploadFiles(
    @UploadedFiles() files: any[],
    @Body() body: { articleId: string }
  ): Promise<File[]> {
    if (files.length > 3) {
      throw new CustomException("Загружено более 3 файлов");
    }
    const fileRecords = [];
    const fileHashes = new Set();
    for (const file of files) {
      if (file.size > 250 * 1024 * 1024) {
        throw new CustomException("Размер одного из файлов превышает 250 МБ");
      }
      console.log("Валидация - размер файла допустимый");
      if (file.mimetype !== "video/mp4") {
        throw new CustomException("Все файлы должны быть в формате mp4");
      }
      console.log("Валидация - формат файла допустимый");
      const hash = this.calculateFileHash(file.buffer);
      if (fileHashes.has(hash)) {
        throw new CustomException("Загружены несколько одинаковых файлов");
      }
      console.log("Валидация - файл является уникальным");
      fileHashes.add(hash);
      const fileRecord = await this.filesService.createFile(
        file,
        body.articleId
      );
      fileRecords.push(fileRecord);
    }
    console.log("Файлы загружены и готовы к обработке, клиент получил ответ");
    return fileRecords;
  }
  private calculateFileHash(buffer: Buffer): string {
    const hash = crypto.createHash("sha256");
    hash.update(buffer);
    return hash.digest("hex");
  }
  @Get(":id")
  @ApiOperation({ summary: "Получить информацию о файле по ID" })
  @ApiResponse({ status: 200, description: "Информация о файле", type: File })
  @ApiResponse({ status: 404, description: "Файл не найден" })
  @ApiParam({ name: "id", description: "ID файла", type: Number })
  async getFileById(@Param("id") id: number): Promise<File> {
    return this.filesService.getFileById(id);
  }

  @Get()
  @ApiOperation({ summary: "Получить список всех файлов" })
  @ApiResponse({ status: 200, description: "Список файлов", type: [File] })
  async getAllFiles(): Promise<{
    statusCode: number;
    message: string;
    data: File[];
  }> {
    const files = await this.filesService.getAllFiles();
    return { statusCode: 200, message: "", data: files };
  }
}
