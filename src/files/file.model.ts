import { Column, DataType, Model, Table } from "sequelize-typescript";

interface FileCreatorAttrs {
  originalName: string;
  videoFileName: string;
  audioFileName: string;
  articleid: string;
}

@Table({ tableName: "files", timestamps: true })
export class File extends Model<File, FileCreatorAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  articleid: string;

  @Column({ type: DataType.STRING, allowNull: false })
  originalName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  videoFileName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  audioFileName: string;
}
