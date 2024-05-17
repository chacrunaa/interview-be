import { ApiProperty } from "@nestjs/swagger";

export class QueryParamsDelete {
  id: number;
}

export class DeleteInterviewsDto {
  @ApiProperty({
    example: "123",
    description: "id статьи которую желаем удалить",
  })
  id: number;
}
