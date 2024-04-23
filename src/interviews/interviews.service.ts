import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { Interview } from "src/interviews/interviews.model";
import { JwtService } from '@nestjs/jwt';
import { parseQueryAndFilter } from "src/interviews/utils/queryParse.utils";
import { generatePrefixOfInterview } from "src/interviews/utils/generatePrefixOfInterview.utils";
import { QueryParams } from "src/interviews/dto/get-interview.dto";
import { GradeEnum, StatusEnum } from "src/interviews/data/objectsOfComparison.constants";

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview) private interviewsRepository: typeof Interview,
    private jwtService: JwtService 
  ) {}

  async create(dto: CreateInterviewDto, token: string) {
    const decoded: {id: number, email: string, nickName: string} | undefined = this.jwtService.verify(token);
    const newInterview = await this.interviewsRepository.create({...dto, nickName: decoded.nickName, 
      prefix: generatePrefixOfInterview({
        maxoffer: dto.maxoffer,
        minoffer: dto.minoffer,
      })
     });

    return newInterview;
  }

  async getInterviews(query: QueryParams) {
    // Определяем limit и offset для пагинации
    const limit = query?.pageSize || 5; 
    const offset = ((query?.page - 1) * limit) || 0;    
    const { rows: interviewList, count: total } = await this.interviewsRepository.findAndCountAll({
      where: parseQueryAndFilter(query, {
        grade: GradeEnum,
        status: StatusEnum,
        stage: StatusEnum,
      }), 
      limit: limit,
      offset: offset,     
    });
    return {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: query?.page || 0,
      pageSize: limit,
      interviews: interviewList,

    };
  }
}
