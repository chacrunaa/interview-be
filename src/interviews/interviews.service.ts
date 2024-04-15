import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { QueryParams } from "src/interviews/dto/create-interview-query.dto";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { Interview } from "src/interviews/interviews.model";
import { parseQueryAndFilter } from "src/interviews/utils/queryParse.utils";

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview) private interviewsRepository: typeof Interview
  ) {}

  async create(dto: CreateInterviewDto) {
    const newInterview = await this.interviewsRepository.create(dto);
    return newInterview;
  }
  async getInterviews(query: QueryParams ) {
    console.log('parseQueryAndFilter', parseQueryAndFilter(query))
    const interviewList = await this.interviewsRepository.findAll({
      where: parseQueryAndFilter(query),
    });
    return interviewList;
  }
}
