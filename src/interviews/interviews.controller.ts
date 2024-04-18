import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { InterviewsPaginationDto } from "src/interviews/dto/interview-pagination.dto";
import { Interview } from "src/interviews/interviews.model";
import { InterviewsService } from "src/interviews/interviews.service";
@ApiTags('interviews')
@Controller("interviews")
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post() 
  @ApiOperation({ summary: 'Создание новой статьи с описанием собеса'  })
  @ApiResponse({ status: 200, description: 'Статья создана', type: Interview })
  create(@Body() createInterviewDto: CreateInterviewDto, @Headers('Authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    return this.interviewsService.create(createInterviewDto, token);
  }

  @Get()
  @ApiOperation({ summary: 'Получение и фильтрация статей'  })
  @ApiResponse({ status: 200, description: 'Получить и отфильтровать список', type:  InterviewsPaginationDto })
  @ApiQuery({ name: 'status', required: false, description: 'Фильтрация по статусу', type: String })
  @ApiQuery({ name: 'stage', required: false, description: 'Фильтрация по этапу', type: String })
  @ApiQuery({ name: 'grade', required: false, description: 'Фильтрация по грейду', type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Количество страниц', type: Number })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Количество статей на странице', type: Number })

  findAll(@Query() query, 
  ) {
    return this.interviewsService.getInterviews(query);
  }
}
