import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateFileDto {
  @ApiProperty({ type: "array", items: { type: "file", format: "binary" } })
  @IsArray()
  files: Express.Multer.File[];
  @IsString()
  @ApiProperty({ type: "string", description: "ID статьи" })
  articleId: string;
}
