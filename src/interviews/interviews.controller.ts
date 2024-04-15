import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { InterviewsService } from "src/interviews/interviews.service";

@Controller("interviews") // Этот декоратор указывает базовый путь для всех методов в этом контроллере
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post() 
  create(@Body() createInterviewDto: CreateInterviewDto, @Headers('Authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    return this.interviewsService.create(createInterviewDto, token);
  }

  @Get()
  findAll(@Query() query) {
    return this.interviewsService.getInterviews(query);
  }
}
