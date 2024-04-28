import { ApiProperty } from "@nestjs/swagger";
import { Company } from "../companies.model";

export class QueryParams {
  companyId?: number;
}
export class GetCompaniesDto {
  @ApiProperty({ type: [Company], description: "Список компаний" })
  companies: [];
}
