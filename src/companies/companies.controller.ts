import { Body, Controller, Get, Post, Query, Headers } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { GetCompaniesDto, QueryParams } from "./dto/get-company.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Company } from "./companies.model";

@ApiTags("Companies")
@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: "Создание компании" })
  @ApiResponse({ status: 200, description: "Компания создана", type: Company })
  create(
    @Body() createCompanyDto: CreateCompanyDto
    // @Headers("Authorization") authHeader: string
  ) {
    // const token = authHeader?.split(" ")[1];
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: "Получить список компаний",
    type: GetCompaniesDto,
  })
  @ApiQuery({
    name: "companyId",
    required: false,
    description: "Определенная компания",
    type: Number,
  })
  findAll(@Query() query: QueryParams) {
    return this.companiesService.getCompanies(query);
  }
}
