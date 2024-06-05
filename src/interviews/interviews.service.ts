import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { Interview } from "src/interviews/interviews.model";
import { JwtService } from "@nestjs/jwt";
import { parseQueryAndFilter } from "src/interviews/utils/queryParse.utils";
import { generatePrefixOfInterview } from "src/interviews/utils/generatePrefixOfInterview.utils";
import { QueryParams } from "src/interviews/dto/get-interview.dto";
import {
  GradeEnum,
  StageEnum,
  StatusEnum,
} from "src/interviews/data/objectsOfComparison.constants";
import { QueryParamsDelete } from "./dto/delete-interview.dto";
import { isNumber } from "class-validator";
import { QueryParamsPut } from "./dto/put-interview.dto";

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview) private interviewsRepository: typeof Interview,
    private jwtService: JwtService
  ) {}

  async create(dto: CreateInterviewDto, token: string) {
    const decoded: { id: number; email: string; nickName: string } | undefined =
      this.jwtService.verify(token);
    const newInterview = await this.interviewsRepository.create({
      ...dto,
      nickName: decoded.nickName,
      prefix: generatePrefixOfInterview({
        maxoffer: dto.maxoffer,
        minoffer: dto.minoffer,
      }),
    });

    return newInterview;
  }

  async getInterviews(query: QueryParams) {
    const pageSize = query?.pageSize > 0 ? query.pageSize : 5;
    const page = query?.page > 0 ? query.page : 1;
    const limit = pageSize;
    const offset = (page - 1) * limit;

    const { rows: interviewList, count: total } =
      await this.interviewsRepository.findAndCountAll({
        where: parseQueryAndFilter(query, {
          grade: GradeEnum,
          status: StatusEnum,
          stage: StageEnum,
        }),
        limit: limit,
        offset: offset,
      });
    return {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
      interviews: interviewList,
      test: 'обновили девв деплой'
    };
  }

  async deleteInterview(query: QueryParamsDelete) {
    const interviewId = query.id;
    if (interviewId) {
      if (!isNumber(+interviewId)) {
        throw new HttpException(
          "id должно представлять собой число",
          HttpStatus.BAD_REQUEST
        );
      }

      const data = await this.interviewsRepository.findOne({
        where: { id: interviewId },
      });
      if (!data) {
        throw new HttpException(
          "Статьи с данным id не существует",
          HttpStatus.BAD_REQUEST
        );
      } else {
        try {
          await this.interviewsRepository.destroy({
            where: { id: interviewId },
          });
          const response = {
            data: { id: data.id },
            message: "Статья успешно удалена",
          };
          return response;
        } catch (error) {
          throw new HttpException(
            "Произошла непредвиденная ошибка",
            HttpStatus.BAD_REQUEST
          );
        }
      }
    } else {
      throw new HttpException(
        "Должен быть передан id статьи",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateInterview(query: QueryParamsPut) {
    const { id: interviewId, ...body } = query;
    if (interviewId) {
      if (!isNumber(+interviewId)) {
        throw new HttpException(
          "id должно представлять собой число",
          HttpStatus.BAD_REQUEST
        );
      }

      const data = await this.interviewsRepository.findOne({
        where: { id: interviewId },
      });
      if (!data) {
        throw new HttpException(
          "Статьи с данным id не существует",
          HttpStatus.BAD_REQUEST
        );
      } else {
        try {
          await this.interviewsRepository.update(
            {
              ...body,
              prefix: generatePrefixOfInterview({
                maxoffer: body.maxoffer,
                minoffer: body.minoffer,
              }),
            },
            { where: { id: interviewId } }
          );
          console.log(Interview);

          const newData = await this.interviewsRepository.findOne({
            where: { id: interviewId },
          });

          const response = { data: newData };
          return response;
        } catch (error) {
          console.log(error);

          throw new HttpException(
            "Произошла непредвиденная ошибка",
            HttpStatus.BAD_REQUEST
          );
        }
      }
    } else {
      throw new HttpException(
        "Должен быть передан id статьи",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
