import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({
    example: "Газпром",
    description: "Название компании",
  })
  @IsString()
  @Length(2, 100)
  readonly companyName: string;

  @ApiProperty({
    example: "Классная внатуре компания, газ качает",
    description: "Описание компании",
  })
  @IsString()
  @Length(5, 1000)
  readonly description: string;
}
