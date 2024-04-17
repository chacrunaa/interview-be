import { ApiProperty } from "@nestjs/swagger";

export class CreateInterviewDto {
   @ApiProperty({ example: 'Газпром', description: 'Название компании' })
   readonly companyName: string;
   @ApiProperty({ example: 'successful', description: 'Финальный статус взаимодействия с компанией' })
   readonly status: string;
   @ApiProperty({ example: 'middle,senior,junior', description: 'Грейд требуемый компанией. Может быть несколько значений' })
   readonly grade: string;
   @ApiProperty({ example: 'livecoding,conversation,techpart', description: 'Этап взаимодействия с компанией' })
   readonly stage: string;
   @ApiProperty({ example: 'Моё собеседование в газпром, это было ужасно', description: 'Заголовок статьи' })
   readonly articleTitle: string;
   @ApiProperty({ example: 'Я ему одно, он мне другое, так и живём', description: 'Описание статьи, будет формате markdown' })
   readonly articleDescription: string;
   @ApiProperty({ example: 'Лютый', description: 'Уникальный никнэйм пользователя' })
   readonly nickName: string
   @ApiProperty({ example: 10000, description: 'Минимальное предложение по зп. Может быть не указано' })
   readonly minoffer: number
   @ApiProperty({ example: 20000, description: 'Максимальное предложение по зп. Может быть не указано' })
   readonly maxoffer: number
}
