import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { Company } from "./companies.model";
import { QueryParams } from "./dto/get-company.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private companiesRepository: typeof Company,
    private jwtService: JwtService
  ) {}

  async create(dto: CreateCompanyDto) {
    try {
      // this.jwtService.verify(token);
      const exists = await this.companiesRepository.findOne({
        where: { companyName: dto.companyName },
      });
      if (exists) {
        throw new HttpException(
          "Компания с таким названием уже существует",
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.companiesRepository.create(dto);
    } catch (error) {
      throw new HttpException(
        "Произошла ошибка при создании компании: " + error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getCompanies(query: QueryParams) {
    try {
      if (query.companyId) {
        const company = await this.companiesRepository.findByPk(
          query.companyId
        );
        if (!company) {
          throw new HttpException(
            "Компания с таким ID не найдена",
            HttpStatus.NOT_FOUND
          );
        }
        return [company];
      }
      return await this.companiesRepository.findAll();
    } catch (error) {
      if (!(error instanceof HttpException)) {
        console.error("Неожиданная ошибка при запросе компаний:", error);
        throw new HttpException(
          "Возникла ошибка при получении списка компаний. Пожалуйста, попробуйте позже.",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw error;
    }
  }
}
