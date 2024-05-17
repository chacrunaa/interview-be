import { ApiProperty } from "@nestjs/swagger";
import {
  GradeEnum,
  StageEnum,
  StatusEnum,
} from "src/interviews/data/objectsOfComparison.constants";
import { Interview } from "src/interviews/interviews.model";

export class QueryParams {
  status?: StatusEnum | StatusEnum[];
  stage?: StageEnum | StageEnum[];
  grade?: GradeEnum | GradeEnum[];
  page?: number;
  pageSize?: number;
}
export class GetInterviewsDto {
  @ApiProperty({ example: 100, description: "Общее количество статей" })
  total: number;

  @ApiProperty({ example: 10, description: "Общее количество страниц" })
  totalPages: number;

  @ApiProperty({ example: 1, description: "Текущая страница" })
  currentPage: number;

  @ApiProperty({ example: 10, description: "Количество статей на странице" })
  pageSize: number;

  @ApiProperty({ type: [Interview], description: "Список статей" })
  interviews: [];
}
