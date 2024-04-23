
import { Column, DataType, Model, Table} from "sequelize-typescript";
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { GradeEnum, StageEnum, StatusEnum } from "src/interviews/data/objectsOfComparison.constants";



interface InterviewCreatorAttrs {
    companyName: string;
    status: StatusEnum[];
    grade: GradeEnum[];
    stage: StageEnum[];
    articleTitle: string;
    articleDescription: string;
    nickName: string
    maxoffer: number
    minoffer: number
    prefix: string
}
@ApiTags('interviews')
@Table({tableName: 'interviews', timestamps: true})
export class Interview extends Model<Interview, InterviewCreatorAttrs> {
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    @ApiProperty({example: 'Газпром', description: 'Название компании'})
    @Column({type: DataType.STRING, allowNull: false})
    companyName: string;

    @ApiProperty({example: 'Супер собеседование', description: 'Заголовок названия собеседования'})
    @Column({type: DataType.STRING, allowNull: false})
    articleTitle: string;

    @ApiProperty({example: 'Это было волшебно', description: 'Описание названия собеседования'})
    @Column({type: DataType.STRING, allowNull: false})
    articleDescription: string;

    @ApiProperty({ example: ['successful'], enum: StageEnum, description: 'Финальный статус взаимодействия с компанией' })
    @Column({type: DataType.JSON, allowNull: false, unique: false, autoIncrement: false, primaryKey: true})
    status: StatusEnum[];

    @ApiProperty({ example: ['middle','senior','junior'], enum: GradeEnum, description: 'Грейд требуемый компанией. Может быть несколько значений' })
    @Column({type: DataType.JSON, allowNull: false, unique: false,autoIncrement: false, primaryKey: true})
    grade: GradeEnum[];
    
    @ApiProperty({ example: ['livecoding','conversation','techpart'], enum: StageEnum, description: 'Этап взаимодействия с компанией' })
    @Column({type: DataType.JSON, allowNull: false, unique: false,autoIncrement: false, primaryKey: true})
    stage: StageEnum[];
    
    @ApiProperty({ example: 'Лютый', description: 'Уникальный никнэйм пользователя' })
    @Column({type: DataType.STRING, allowNull: true, unique: false})
    nickName: string;

    @ApiProperty({ example: 20000, description: 'Максимальное предложение по зп. Может быть не указано' })
    @Column({type: DataType.INTEGER, allowNull: true})
    maxoffer : number;

    @ApiProperty({ example: 10000, description: 'Минимальное предложение по зп. Может быть не указано' })
    @Column({type: DataType.INTEGER, allowNull: true})
    minoffer : number;
    @ApiProperty({ example:'от', description: 'Префикс для правильного вывода оффера, необязательное' })
    @Column({type: DataType.STRING, allowNull: true})
    prefix: string; 
}
