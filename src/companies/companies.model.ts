import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiTags, ApiProperty } from "@nestjs/swagger";

interface CompanyCreatorAttrs {
  companyName: string;
  description: string;
}
@ApiTags("companies")
@Table({ tableName: "companies", timestamps: true })
export class Company extends Model<Company, CompanyCreatorAttrs> {
  @ApiProperty({ example: 1, description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({ example: "Газпром", description: "Название компании" })
  @Column({ type: DataType.STRING, allowNull: false })
  companyName?: string;

  @ApiProperty({
    example: "Классная внатуре компания, газ качает",
    description: "Описание компании",
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;
}
