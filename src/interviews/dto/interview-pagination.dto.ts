import { ApiProperty } from "@nestjs/swagger";
import { Interview } from "src/interviews/interviews.model";

export class InterviewsPaginationDto {
    @ApiProperty({ example: 100, description: 'Общее количество статей' })
    total: number;

    @ApiProperty({ example: 10, description: 'Общее количество страниц' })
    totalPages: number;

    @ApiProperty({ example: 1, description: 'Текущая страница' })
    currentPage: number;

    @ApiProperty({ example: 10, description: 'Количество статей на странице' })
    pageSize: number;

    @ApiProperty({ type: [Interview], description: 'Список статей' })
    interviews: [];
}