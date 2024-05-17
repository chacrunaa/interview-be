import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsEnum } from "class-validator";
import {
  GradeEnum,
  StageEnum,
  StatusEnum,
} from "src/interviews/data/objectsOfComparison.constants";

export class CreateInterviewDto {
  @ApiProperty({ example: "Газпром", description: "Название компании" })
  readonly companyName: string;
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @IsEnum(StatusEnum, { each: true })
  @ApiProperty({
    example: ["successful"],
    enum: StatusEnum,
    isArray: true,
    description: "Финальный статус взаимодействия с компанией",
  })
  readonly status: StatusEnum[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(GradeEnum, { each: true })
  @ApiProperty({
    example: ["junior", "middle", "senior"],
    enum: GradeEnum,
    isArray: true,
    description: "Грейд требуемый компанией. Может быть несколько значений",
  })
  readonly grade: GradeEnum[];
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(StageEnum, { each: true })
  @ApiProperty({
    example: ["livecoding", "conversation", "techpart"],
    enum: StageEnum,
    isArray: true,
    description: "Этап взаимодействия с компанией",
  })
  readonly stage: StageEnum[];
  @ApiProperty({
    example: "Моё собеседование в газпром, это было ужасно",
    description: "Заголовок статьи",
  })
  readonly articleTitle: string;
  @ApiProperty({
    example: "Я ему одно, он мне другое, так и живём",
    description: "Описание статьи, будет формате markdown",
  })
  readonly articleDescription: string;
  @ApiProperty({
    example: 10000,
    description: "Минимальное предложение по зп. Может быть не указано",
  })
  readonly minoffer: number;
  @ApiProperty({
    example: 20000,
    description: "Максимальное предложение по зп. Может быть не указано",
  })
  readonly maxoffer: number;
}
