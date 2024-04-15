import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { User } from "src/users/users.model";

// Шаг 1 - описываем модель для создания интерьвью

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

@Table({tableName: 'interviews', timestamps: true})
export class Interview extends Model<Interview, InterviewCreatorAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    companyName: string;

    @Column({type: DataType.STRING, allowNull: false})
    articleTitle: string;
    
    @Column({type: DataType.STRING, allowNull: false})
    articleDescription: string;

    @Column({type: DataType.STRING, allowNull: false, unique: false, autoIncrement: false, primaryKey: true})
    status: string;

    @Column({type: DataType.STRING, allowNull: false, unique: false,autoIncrement: false, primaryKey: true})
    grade: string;
    
    @Column({type: DataType.STRING, allowNull: false, unique: false,autoIncrement: false, primaryKey: true})
    stage: string;
    
    @Column({type: DataType.STRING, allowNull: false, unique: false})
    nickName: string;

    @Column({type: DataType.INTEGER, allowNull: true})
    maxoffer : number;

    @Column({type: DataType.INTEGER, allowNull: true})
    minoffer : number;

    @Column({type: DataType.STRING, allowNull: true})
    prefix: string; 
}
