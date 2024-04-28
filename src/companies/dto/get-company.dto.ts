import { ApiProperty } from "@nestjs/swagger";
import { Company } from "../companies.model";

export class QueryParams {
  total: number;
  currentCompany: number;
  companyId?: number;
}
export class GetCompaniesDto {
  @ApiProperty({ example: 1, description: "Текущая компания" })
  currentCompani: number;

  @ApiProperty({ type: [Company], description: "Список компаний" })
  companies: [];
}
