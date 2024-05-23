import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";

@Injectable()
export class FilesService {
  async createFile(file: any): Promise<string> {
    console.log(file, "file");

    try {
      const fileName = uuid.v4() + path.extname(file.originalname);
      const filePath = path.resolve("static");
      console.log("File path:", filePath);
      if (!fs.existsSync(filePath)) {
        console.log("Creating directory:", filePath);
        fs.mkdirSync(filePath, { recursive: true });
        console.log("Directory created");
      }
      const fullPath = path.join(filePath, fileName);
      console.log("Writing file:", fullPath);
      fs.writeFileSync(fullPath, file.buffer);
      console.log("File written:", fileName);
      return fileName;
    } catch (e) {
      console.error("Error writing file:", e);
      throw new HttpException(
        "Произошла ошибка при записи файла",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
