import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsEnum, isArray } from "class-validator";
import {  GradeEnum, StageEnum, StatusEnum } from "src/interviews/data/objectsOfComparison.constants";

    export class QueryParamsPut {
        id: number;
        companyName?:string
        articleTitle?:string
        articleDescription?: string
        status: StatusEnum[];
        grade: GradeEnum[];
        stage: StageEnum[];
        nickName?: string
        minoffer?:number
        maxoffer?:number
        prefix?:string
    }

    export class PutInterviewsDto {
        @ApiProperty({ example: 100, description: 'id Статьи', required:true })
        id: number;
        @ApiProperty({ example: 'Газпром', description: 'Название компании', required:false })
        companyName: string;
       @IsArray()
       @ArrayNotEmpty()
       @ArrayMaxSize(1)
       @IsEnum(StatusEnum, { each: true })
       @ApiProperty({ example: ['successful'], enum: StatusEnum,isArray:true, description: 'Финальный статус взаимодействия с компанией', required:false })
       status: StatusEnum[];
     
       @IsArray()
       @ArrayNotEmpty()
       @IsEnum(GradeEnum, { each: true })
        @ApiProperty({ example: ['junior', 'middle', 'senior'], enum: GradeEnum,isArray:true, description: 'Грейд требуемый компанией. Может быть несколько значений', required:false })
        grade: GradeEnum[];
       @IsArray()
       @ArrayNotEmpty()
       @IsEnum(StageEnum, { each: true })
        @ApiProperty({ example: ['livecoding','conversation','techpart'], enum: StageEnum,isArray:true, description: 'Этап взаимодействия с компанией', required:false })
        stage: StageEnum[];
        @ApiProperty({ example: 'Моё собеседование в газпром, это было ужасно', description: 'Заголовок статьи', required:false })
        articleTitle: string;
        @ApiProperty({ example: 'Я ему одно, он мне другое, так и живём', description: 'Описание статьи, будет формате markdown', required:false })
        articleDescription: string;
        @ApiProperty({ example: 'Лютый', description: 'Уникальный никнэйм пользователя', required:false })
        nickName: string
        @ApiProperty({ example: 10000, description: 'Минимальное предложение по зп. Может быть не указано', required:false })
        minoffer: number
        @ApiProperty({ example: 20000, description: 'Максимальное предложение по зп. Может быть не указано', required:false })
        maxoffer: number
    }