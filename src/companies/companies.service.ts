import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { Company } from "./companies.model";
import { QueryParams } from "./dto/get-company.dto";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private copaniesRepository: typeof Company
  ) {}

  async create(dto: CreateCompanyDto) {
    const newCompani = await this.copaniesRepository.create(dto);
    return newCompani;
  }

  async getCompanies(query: QueryParams) {
    if (query.companyId) {
      const company = await this.copaniesRepository.findByPk(query.companyId);
      return company ? [company] : [];
    }
    return await this.copaniesRepository.findAll();
  }
}
