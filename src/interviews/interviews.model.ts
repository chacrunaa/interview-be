import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { User } from "src/users/users.model";
import { ApiTags, ApiProperty } from '@nestjs/swagger';



interface InterviewCreatorAttrs {
    companyName: string;
    status: string;
    grade: string;
    stage: string;
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

    @ApiProperty({ example: 'successful', description: 'Финальный статус взаимодействия с компанией' })
    @Column({type: DataType.STRING, allowNull: false, unique: false, autoIncrement: false, primaryKey: true})
    status: string;

    @ApiProperty({ example: 'middle,senior,junior', description: 'Грейд требуемый компанией. Может быть несколько значений' })
    @Column({type: DataType.STRING, allowNull: false, unique: false,autoIncrement: false, primaryKey: true})
    grade: string;
    
    @ApiProperty({ example: 'livecoding,conversation,techpart', description: 'Этап взаимодействия с компанией' })
    @Column({type: DataType.STRING, allowNull: false, unique: false,autoIncrement: false, primaryKey: true})
    stage: string;
    
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
