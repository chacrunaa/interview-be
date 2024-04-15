import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { QueryParams } from "src/interviews/dto/create-interview-query.dto";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { Interview } from "src/interviews/interviews.model";
import { JwtService } from '@nestjs/jwt';
import { parseQueryAndFilter } from "src/interviews/utils/queryParse.utils";
import { generatePrefixOfInterview } from "src/interviews/utils/generatePrefixOfInterview.utils";

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
      where: parseQueryAndFilter(query), 
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
